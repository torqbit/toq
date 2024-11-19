import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import getUserByEmail from "@/actions/getUserByEmail";
import MailerService from "@/services/MailerService";
import { $Enums } from "@prisma/client";

const sendWelcomeEmail = async (name: string, email: string) => {
  const configData = {
    name: name,
    url: `${process.env.NEXTAUTH_URL}/dashboard`,
    email: email,
  };

  MailerService.sendMail("NEW_USER", configData).then((result) => {
    console.log(result.error);
  });
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_PUBLIC_SECRET,
  adapter: {
    ...PrismaAdapter(prisma),
    createUser(user) {
      sendWelcomeEmail(String(user.name), String(user.email));
      return prisma.user.create({
        data: {
          ...user,
          role: user.email == process.env.ADMIN_EMAIL ? $Enums.Role.ADMIN : $Enums.Role.STUDENT,
        },
      });
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isActiveUser = user.isActive ?? true;
      if (!isActiveUser) {
        return "/in-active-user";
      }

      return true;
    },

    async jwt({ token, user, account, profile, trigger, session }) {
      const dbUser = await getUserByEmail(token?.email as string);
      if (trigger === "update" && session?.name) {
        token.name = session?.name;
        token.phone = session?.phone;
        token.picture = session?.image;
      }
      if (!dbUser) {
        if (account) {
          token.accessToken = account.access_token;
          token.id = user?.id;
          token.role = "STUDENT";
        }

        return this.signIn;
      }
      return {
        ...token,
        id: dbUser.id,
        role: dbUser.role,
        phone: dbUser.phone,
        isActive: dbUser.isActive,
        user: {
          name: dbUser.name,
          email: dbUser?.email,
          image: dbUser.image,
        },
      };
    },
    async session({ session, token, trigger, newSession }) {
      if (token) {
        session.id = token.id;
        session.role = token.role;
        session.phone = token.phone as string;
        session.isActive = token.isActive;
        session.user = token.user as Object;
        session.user.name = token.name;

        if ((trigger = "update" && newSession?.name)) {
          session.user.name = newSession?.name;
          session.phone = newSession?.phone;
          token.picture = newSession?.image;
        }
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
export default NextAuth(authOptions);

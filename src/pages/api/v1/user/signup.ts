import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import bcrypt from "bcryptjs";
import getUserByEmail from "@/actions/getUserByEmail";
import { z } from "zod";
import { Role } from "@prisma/client";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"), // Name must be a non-empty string
  email: z.string().email("Invalid email address"), // Email must be a valid email format
  password: z.string().min(6, "Password must be at least 6 characters long"), // Password must be at least 8 characters
});

type SignUpRequest = z.infer<typeof userSchema>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const newUser: SignUpRequest = userSchema.parse(body);

    const existingUser = await getUserByEmail(newUser.email);
    if (!existingUser) {
      const usersCount = await prisma.user.count();
      const userRole = usersCount == 0 ? Role.ADMIN : Role.STUDENT;
      const dbUser = await prisma.user.create({
        data: { name: newUser.name, email: newUser.email, role: userRole },
      });
      if (dbUser) {
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        const dbAccount = await prisma.account.create({
          data: {
            userId: dbUser.id,
            type: "email",
            provider: "credentials",
            password: hashedPassword,
            providerAccountId: new Date().getTime().toString(),
          },
        });
        if (dbAccount.id) {
          return res.status(200).json({ success: true, message: "You have successfully signedup" });
        }
      }
    } else {
      return res.status(400).json({ success: false, error: "Another user already exists with this email" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);

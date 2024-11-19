import prisma from "@/lib/prisma";

export default async function getUserByEmail(email: string) {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      phone: true,
      isActive: true,
      account: {
        select: {
          password: true,
        },
      },
    },
    where: {
      email: email,
    },
  });

  return user;
}

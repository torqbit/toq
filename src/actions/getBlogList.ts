import prisma from "@/lib/prisma";
import { generateDayAndYear } from "@/lib/utils";
import { IBlogCard } from "@/types/landing/blog";
import { StateType } from "@prisma/client";

const getBlogList = async (): Promise<IBlogCard[]> => {
  const blogs = await prisma.blog.findMany({
    where: {
      contentType: "BLOG",
      state: StateType.ACTIVE,
    },
    select: {
      user: {
        select: {
          image: true,
          name: true,
        },
      },
      content: true,
      title: true,
      id: true,
      banner: true,
      createdAt: true,
      slug: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const blogList =
    blogs.length > 0
      ? blogs.map((b) => {
          return {
            title: b.title,
            author: { name: String(b.user.name), picture: String(b.user.image) },
            img: b.banner,
            date: generateDayAndYear(b.createdAt),
            link: `/blogs/${b.slug}`,
          };
        })
      : [];
  return blogList;
};

export default getBlogList;

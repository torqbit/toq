import prisma from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";

export const getTotalAssignment = async (courseId: number) => {
  const res = await prisma.course.findUnique({
    where: {
      courseId: courseId,
    },
    select: {
      chapters: {
        where: {
          isActive: true,
        },
        select: {
          resource: {
            where: {
              isActive: true,
              contentType: "Assignment",
            },
            select: {
              contentType: true,
            },
          },
        },
      },
    },
  });

  let totalAssig: any[] = [];
  res?.chapters.map((c, i) =>
    c.resource.map((r, i) => {
      totalAssig.push(r.contentType);
    })
  );

  return totalAssig;
};

export const getAllCourses = async (id: string) => {
  const res = await prisma.course.findMany({
    select: {
      courseId: true,
      name: true,
      difficultyLevel: true,
      state: true,
      description: true,
      totalResources: true,
      user: {
        select: {
          name: true,
        },
      },
      chapters: {
        select: {
          resource: {
            select: {
              video: {
                select: {
                  videoDuration: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return JSON.stringify(res);
};

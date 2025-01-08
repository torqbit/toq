import prisma from "@/lib/prisma";
import { convertSecToHourandMin } from "@/pages/admin/content";
import { ICourseCard } from "@/types/landing/courses";
import { CourseType, StateType } from "@prisma/client";

const getCourseList = async (): Promise<ICourseCard[]> => {
  const allCourses = await prisma.course.findMany({
    where: {
      state: StateType.ACTIVE,
    },
    select: {
      courseId: true,
      name: true,
      difficultyLevel: true,
      state: true,
      description: true,
      totalResources: true,
      previewMode: true,
      tvThumbnail: true,
      slug: true,
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
              assignment: {
                select: {
                  estimatedDuration: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const courseList =
    allCourses.length > 0
      ? allCourses.map((course: any) => {
          let totalDuration = 0;
          course.chapters.forEach((chap: any) => {
            chap.resource.forEach((r: any) => {
              if (r.video) {
                totalDuration = totalDuration + r.video?.videoDuration;
              } else if (r.assignment) {
                totalDuration = totalDuration + Number(r.assignment.estimatedDuration) * 60;
              }
            });
          });
          let duration = convertSecToHourandMin(totalDuration);
          return {
            title: course.name,
            tvThumbnail: course.tvThumbnail || "",
            duration: `${duration}`,
            description: course.description,
            link: `/courses/${course.slug}`,
            courseType: course.courseType || CourseType.FREE,
            price: Number(course.coursePrice),
            difficulty: course.difficultyLevel,
          };
        })
      : [];
  return courseList;
};

export default getCourseList;

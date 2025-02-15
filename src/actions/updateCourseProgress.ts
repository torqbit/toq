import prisma from "@/lib/prisma";
import { CeritificateService } from "@/services/certificate/CertificateService";
import { ICertificateInfo } from "@/types/courses/Course";
import { ResourceContentType, StateType } from "@prisma/client";

const updateCourseProgress = async (
  courseId: number,
  lessonId: number,
  studentId: string,
  contentType: ResourceContentType,
  registrationId?: number,
  certificateExist?: boolean,
  totalLessons?: number,
  totalWatched?: number
): Promise<{ lessonsCompleted: number; totalLessons: number }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProgress = await prisma.courseProgress.findUnique({
        where: {
          studentId_resourceId: {
            studentId: studentId,
            resourceId: lessonId,
          },
        },
      });

      if (checkProgress) {
        resolve({ lessonsCompleted: Number(totalWatched), totalLessons: Number(totalLessons) });
      } else {
        const updateProgress = await prisma?.courseProgress.create({
          data: {
            courseId: courseId,
            resourceId: lessonId,
            studentId: studentId,
          },
          select: {
            course: {
              select: {
                previewMode: true,
              },
            },
          },
        });

        if (updateProgress) {
          const courseProgress = await prisma.$queryRaw<
            any[]
          >`select COUNT(re.resourceId) as lessons, COUNT(cp.resourceId) as watched_lessons FROM Course as co
          INNER JOIN \`Order\` as o ON o.productId = co.courseId
          INNER JOIN CourseRegistration as cr ON cr.orderId = o.id
        INNER JOIN Chapter as ch ON co.courseId = ch.courseId 
        INNER JOIN Resource as re ON ch.chapterId = re.chapterId
        LEFT OUTER JOIN CourseProgress as cp ON re.resourceId = cp.resourceId AND  cp.studentId = ${studentId}
        WHERE co.courseId = ${Number(courseId)} AND re.state = ${StateType.ACTIVE} AND re.createdAt <= cr.dateJoined 
        `;
          if (courseProgress.length > 0) {
            const lessonsDetail = {
              lessonsCompleted: Number(courseProgress[0].watched_lessons),
              totalLessons: Number(courseProgress[0].lessons),
            };

            if (contentType === ResourceContentType.Video) {
              resolve(lessonsDetail);
            }

            if (
              lessonsDetail.lessonsCompleted === lessonsDetail.totalLessons &&
              !updateProgress.course.previewMode &&
              contentType === ResourceContentType.Assignment &&
              !certificateExist &&
              registrationId
            ) {
              const studentDetail = await prisma.user.findUnique({
                where: {
                  id: studentId,
                },
                select: {
                  email: true,
                  name: true,
                },
              });

              await new CeritificateService().generateCourseCertificate(
                registrationId,
                Number(courseId),
                String(studentDetail?.name)
              );

              resolve({ lessonsCompleted: courseProgress[0].watched_lessons, totalLessons: courseProgress[0].lessons });
            } else {
              resolve({ lessonsCompleted: courseProgress[0].watched_lessons, totalLessons: courseProgress[0].lessons });
            }
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default updateCourseProgress;

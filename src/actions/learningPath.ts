import prisma from "@/lib/prisma";

import { APIResponse } from "@/types/apis";
import { FileObjectType } from "@/types/cms/common";

import { ILearningCourseList, ILearningPathDetail, ILearningPreviewDetail } from "@/types/learingPath";
import { ProductType, Role, StateType } from "@prisma/client";
import { uploadThumbnail } from "./courses";
import appConstant from "@/services/appConstant";
import { convertSecToHourandMin } from "@/pages/admin/content";
class LearningPath {
  async createLearningPath(
    file: any,
    slug: string,
    title: string,
    description: string,
    state: StateType,
    authorId: string,
    courses: { learningPathId: number; courseId: number; sequenceId: number }[]
  ): Promise<APIResponse<ILearningPathDetail>> {
    let learningPathBanner: string;
    if (file) {
      const response = await uploadThumbnail(file, slug, FileObjectType.LEARNING_PATH, "learning_path");
      if (response.success) {
        learningPathBanner = response.body;
      } else {
        console.log(response.error);
      }
    }

    const response = await prisma
      .$transaction(async (tx) => {
        const productCreate = await tx.product.create({
          data: {
            ptype: ProductType.LEARNING_PATH,
          },
        });

        let response = await tx.learningPath.create({
          data: {
            id: productCreate.productId,
            title,
            description,
            slug,
            state,
            authorId: authorId,
            banner: learningPathBanner || "",
          },
          select: {
            id: true,
            title: true,
            description: true,
            state: true,
            banner: true,
          },
        });

        let learningPathId = response.id;

        await tx.learningPathCourses.createMany({
          data: courses.map((l) => {
            return {
              ...l,
              learningPathId: learningPathId,
            };
          }),
          skipDuplicates: true,
        });

        return response;
      })
      .then((r) => {
        return { success: true, body: r };
      })
      .catch((error) => {
        return { success: false, body: error };
      });
    return new APIResponse(
      response.success,
      response.success ? 200 : 400,
      response.success ? "Learning path has been created" : response.body,
      response.success ? response.body : undefined
    );
  }

  async updateLearningPath(
    file: any,
    id: number,
    slug: string,
    title: string,
    description: string,
    state: StateType,
    authorId: string,
    courses: { learningPathId: number; courseId: number; sequenceId: number }[],
    banner: string
  ): Promise<APIResponse<ILearningPathDetail>> {
    let learningPathBanner = banner;
    if (file) {
      const response = await uploadThumbnail(file, slug, FileObjectType.LEARNING_PATH, "learning_path", banner);
      if (response.success) {
        learningPathBanner = response.body;
      } else {
        console.log(response.error);
      }
    }

    const response = await prisma
      .$transaction(async (tx) => {
        let response = await tx.learningPath.update({
          where: {
            id: id,
            authorId: authorId,
          },
          data: {
            title,
            description,
            slug,
            state,
            authorId: authorId,
            banner: learningPathBanner || "",
          },
          select: {
            id: true,
            title: true,
            description: true,
            state: true,
            banner: true,
          },
        });

        let learningPathId = response.id;

        await tx.learningPathCourses.deleteMany({
          where: {
            learningPathId: learningPathId,
          },
        });

        await tx.learningPathCourses.createMany({
          data: courses,
          skipDuplicates: true,
        });

        return response;
      })
      .then((r) => {
        return { success: true, body: r };
      })
      .catch((error) => {
        console.log(error);
        return { success: false, body: error };
      });
    return new APIResponse(
      response.success,
      response.success ? 200 : 400,
      response.success ? "Learning path has been updated" : response.body,
      response.success ? response.body : undefined
    );
  }

  async getLearningPreviewDetail(
    pathId: number,
    userRole?: Role,
    userId?: string
  ): Promise<APIResponse<ILearningPreviewDetail>> {
    const detail = await prisma.learningPath.findUnique({
      where: {
        id: Number(pathId),
      },
      select: {
        title: true,
        description: true,
        id: true,
        state: true,
        slug: true,
        price: true,
        banner: true,
        author: {
          select: {
            name: true,
          },
        },
        learningPathCourses: {
          select: {
            courseId: true,
            course: {
              select: {
                tvThumbnail: true,
                description: true,
                slug: true,
                name: true,
                user: {
                  select: {
                    image: true,
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
                        assignment: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            sequenceId: "asc",
          },
        },
      },
    });

    const totalAssignments = detail?.learningPathCourses.reduce((total, course) => {
      const courseAssignments = course.course.chapters.reduce((courseTotal, chapter) => {
        const chapterAssignments = chapter.resource.filter((resource) => resource.assignment).length;
        return courseTotal + chapterAssignments;
      }, 0);

      return total + courseAssignments;
    }, 0);

    const totalVideoDuration = detail?.learningPathCourses.reduce((total, course) => {
      const courseDuration = course.course.chapters.reduce((courseTotal, chapter) => {
        const chapterVideoDuration = chapter.resource.reduce((videoTotal, resource) => {
          if (resource.video && resource.video.videoDuration) {
            return videoTotal + resource.video.videoDuration;
          } else if (resource.assignment && resource.assignment.estimatedDuration) {
            return videoTotal + Number(resource.assignment.estimatedDuration) * 60;
          }
          return videoTotal;
        }, 0);
        return courseTotal + chapterVideoDuration;
      }, 0);

      return total + courseDuration;
    }, 0);

    if (detail) {
      const instructors = new Set(detail.learningPathCourses.map((c) => `${c.course.user.image}`));

      let data = {
        title: detail?.title,
        id: detail?.id,
        description: detail?.description,
        banner: detail?.banner || "",
        price: detail?.price,
        slug: detail?.slug,
        role: userRole,
        currency: appConstant.currency,
        assignmentsCount: Number(totalAssignments),
        contentDurationInHrs: Math.floor(totalVideoDuration || 0 / 60),
        author: {
          name: detail.author.name,
          designation: "a course instructor at OpenAI",
        },
        instructors: Array.from(instructors),
        learningPathCourses: detail.learningPathCourses.map((c) => {
          return {
            courseId: c.courseId,
            slug: c.course.slug || "",
            banner: c.course.tvThumbnail || "",
            title: c.course.name,
            description: c.course.description,
          };
        }),
      };
      return new APIResponse(true, 200, "Learning path detail has been fetched", data);
    } else {
      return new APIResponse(false, 404, "Learning path detail not found");
    }
  }

  async getLearningDetail(pathId: number): Promise<APIResponse<ILearningPathDetail>> {
    const detail = await prisma.learningPath.findUnique({
      where: {
        id: Number(pathId),
      },
      select: {
        title: true,
        description: true,
        id: true,
        state: true,
        slug: true,
        price: true,
        banner: true,
        author: {
          select: {
            name: true,
          },
        },
        learningPathCourses: {
          select: {
            courseId: true,
            course: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            sequenceId: "asc",
          },
        },
      },
    });

    if (detail) {
      return new APIResponse(true, 200, "Learning path detail has been fetched", {
        ...detail,
        learningPathCourses: detail.learningPathCourses.map((l) => {
          return { courseId: l.courseId, name: l.course.name };
        }),
      });
    } else {
      return new APIResponse(false, 404, "Learning path detail not found");
    }
  }

  async getCoursesList(): Promise<APIResponse<ILearningCourseList[]>> {
    const courseList = await prisma.course.findMany({
      where: {
        state: StateType.ACTIVE,
      },
      select: {
        name: true,
        courseId: true,
      },
    });

    return new APIResponse(true, 200, "", courseList);
  }

  async listLearningPath(
    userRole?: Role,
    userId?: string,
    state?: StateType
  ): Promise<APIResponse<ILearningPathDetail[]>> {
    if (userRole == Role.ADMIN) {
      const r = await prisma.learningPath.findMany({
        select: {
          title: true,
          description: true,
          state: true,
          slug: true,
          price: true,

          banner: true,
          id: true,

          author: {
            select: {
              name: true,
            },
          },
          learningPathCourses: {
            select: {
              courseId: true,
            },
          },
        },
      });

      return new APIResponse(true, 200, "Learning path list has been fetched", r);
    } else if (userRole == Role.AUTHOR && userId) {
      const r = await prisma.learningPath.findMany({
        where: {
          state: StateType.ACTIVE,
          authorId: userId,
        },
        select: {
          title: true,
          description: true,
          state: true,
          slug: true,
          price: true,

          id: true,
          banner: true,
          author: {
            select: {
              name: true,
            },
          },
          learningPathCourses: {
            select: {
              courseId: true,
            },
          },
        },
      });

      return new APIResponse(true, 200, "Learning path list has been fetched", r);
    } else {
      const r = await prisma.learningPath.findMany({
        where: {
          state: StateType.ACTIVE,
        },
        select: {
          title: true,
          description: true,
          state: true,
          slug: true,
          price: true,

          id: true,

          banner: true,
          author: {
            select: {
              name: true,
            },
          },
          learningPathCourses: {
            select: {
              courseId: true,
            },
          },
        },
      });
      return new APIResponse(true, 200, "Learning path list has been fetched", r);
    }
  }
}

export default new LearningPath();

import { createSlug, getFileExtension } from "@/lib/utils";
import appConstant from "@/services/appConstant";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { APIResponse } from "@/types/apis";
import { FileObjectType, StaticFileCategory, VideoObjectType } from "@/types/cms/common";
import fs from "fs";
import os from "os";
import prisma from "@/lib/prisma";
import path from "path";
import {
  IChapterView,
  ICourseDetailView,
  ICourseListItem,
  ILessonView,
  VideoAPIResponse,
} from "@/types/courses/Course";
import { mergeChunks, saveToLocal } from "@/lib/upload/utils";
import {
  ConfigurationState,
  courseDifficultyType,
  gatewayProvider,
  Prisma,
  ResourceContentType,
  Role,
  StateType,
} from "@prisma/client";
import { JWT } from "next-auth/jwt";
import { getCourseAccessRole } from "./getCourseAccessRole";
import { getCurrency } from "./getCurrency";

export const uploadThumbnail = async (
  file: any,
  name: string,
  objectType: FileObjectType,
  fileType: StaticFileCategory,
  existingFilePath?: string
): Promise<APIResponse<any>> => {
  if (file) {
    let response: APIResponse<any>;
    const extension = getFileExtension(file.originalFilename);
    const sourcePath = file.filepath;
    const currentTime = new Date().getTime();
    const fullName = `${name}-${currentTime}.${extension}`;
    const fileBuffer = await fs.promises.readFile(`${sourcePath}`);
    const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
    const cmsConfig = (await cms.getCMSConfig()).body?.config;

    if (cmsConfig) {
      // deleting thumbnail

      if (existingFilePath) {
        await cms.deleteCDNImage(cmsConfig, existingFilePath);
      }
      // upload thumbnail
      response = await cms.uploadCDNImage(cmsConfig, fileBuffer, objectType, fullName, fileType);
      return response;
    } else {
      return new APIResponse(false, 400, "CMS configuration was not found");
    }
  } else {
    return new APIResponse(false, 400, "File is missing");
  }
};

export const uploadArchive = async (
  file: any,
  name: string,
  objectType: FileObjectType,
  fileType: StaticFileCategory,
  existingFilePath?: string
): Promise<APIResponse<any>> => {
  if (file) {
    let response: APIResponse<any>;
    const extension = getFileExtension(file.originalFilename);
    const sourcePath = file.filepath;
    const currentTime = new Date().getTime();
    const fullName = `${name}-${currentTime}.${extension}`;
    const fileBuffer = await fs.promises.readFile(`${sourcePath}`);
    const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
    const cmsConfig = (await cms.getCMSConfig()).body?.config;

    if (cmsConfig) {
      // deleting thumbnail

      if (existingFilePath) {
        await cms.deleteCDNImage(cmsConfig, existingFilePath);
      }
      // upload thumbnail
      response = await cms.uploadPrivateFile(cmsConfig, fileBuffer, objectType, fullName, fileType);
      return response;
    } else {
      return new APIResponse(false, 400, "CMS configuration was not found");
    }
  } else {
    return new APIResponse(false, 400, "File is missing");
  }
};

export const uploadVideo = async (
  file: any,
  name: string,
  objectId: number,
  objectType: VideoObjectType,
  chunkIndex: number,
  totalChunks: number
): Promise<APIResponse<VideoAPIResponse>> => {
  if (file) {
    let response: APIResponse<any>;
    const extension = getFileExtension(file.originalFilename);
    const sourcePath = file.filepath;
    const currentTime = new Date().getTime();
    let fullName = `${name}.part${chunkIndex}.${extension}`;
    const cms = new ContentManagementService().getCMS(appConstant.defaultCMSProvider);
    const cmsConfig = (await cms.getCMSConfig()).body?.config;

    let needDeletion = false;
    let videoProviderId: string | undefined | null;

    await saveToLocal(fullName, sourcePath);

    const homeDir = os.homedir();

    const localDirPath = path.join(homeDir, `${appConstant.homeDirName}/${appConstant.staticFileDirName}`);

    const totalFile = fs.readdirSync(localDirPath).filter((file) => file.startsWith(name));
    if (totalFile.length === totalChunks) {
      const mergedFinalFilePath = path.join(localDirPath, `${name}.${currentTime}.${extension}`);
      fullName = createSlug(name);
      await mergeChunks(name, totalChunks, extension, mergedFinalFilePath);
      const fileBuffer = await fs.promises.readFile(mergedFinalFilePath);
      if (objectType == "course") {
        const trailerVideo = await prisma.course.findUnique({
          where: {
            courseId: objectId,
          },
          select: {
            tvProviderId: true,
          },
        });
        videoProviderId = trailerVideo?.tvProviderId;
        needDeletion = typeof trailerVideo !== undefined || trailerVideo != null;
      } else if (objectType == "lesson") {
        const videoLesson = await prisma?.video.findUnique({
          where: {
            resourceId: objectId,
          },
          select: {
            providerVideoId: true,
          },
        });
        videoProviderId = videoLesson?.providerVideoId;
        needDeletion = typeof videoLesson !== undefined || videoLesson != null;
      }
      if (cmsConfig) {
        if (needDeletion && videoProviderId) {
          await cms.deleteVideo(cmsConfig, videoProviderId, objectId, objectType);
        }
        response = await cms.uploadVideo(cmsConfig, fileBuffer, fullName, objectType, objectId);
        if (mergedFinalFilePath != "") {
          fs.unlinkSync(mergedFinalFilePath);
        }
        return new APIResponse(response.success, response.status, response.message, response.body);
      } else {
        return new APIResponse(false, 404, "Video storage configuration was not found");
      }
    } else {
      return new APIResponse(false, 200, "uploading");
    }
  } else {
    return new APIResponse(false, 404, "File is missing");
  }
};

export const getCourseDetailedView = async (
  courseId: number | string,
  isSlug: boolean = false,
  user?: {
    id: string;
    role: Role;
  }
): Promise<APIResponse<ICourseDetailView>> => {
  const whereClause: Prisma.CourseWhereUniqueInput = isSlug
    ? { slug: String(courseId) }
    : { courseId: Number(courseId) };

  const courseDBDetails = await prisma.course.findUnique({
    select: {
      name: true,
      courseId: true,
      description: true,
      expiryInDays: true,
      tvUrl: true,
      user: {
        select: {
          name: true,
          id: true,
          image: true,
        },
      },
      state: true,
      chapters: {
        select: {
          name: true,
          description: true,
          resource: {
            orderBy: {
              sequenceId: "asc",
            },
            select: {
              sequenceId: true,
              name: true,
              description: true,
              state: true,
              video: {
                select: {
                  videoDuration: true,
                  resourceId: true,
                },
              },
              assignment: {
                select: {
                  estimatedDuration: true,
                },
              },
            },
            where: {
              state: StateType.ACTIVE,
            },
          },
        },
      },

      difficultyLevel: true,
      courseType: true,
      coursePrice: true,
    },
    where: whereClause,
  });

  if (courseDBDetails) {
    let userRole: Role = Role.NOT_ENROLLED;
    let enrolmentDate: string | undefined;
    let remainingDays = null;
    let certificateId: string | undefined;
    if (user) {
      if (user.role === Role.ADMIN) {
        userRole = Role.ADMIN;
      } else if (user.role == Role.AUTHOR && courseDBDetails.user.id == user.id) {
        userRole = Role.AUTHOR;
      } else {
        //get the registration details for this course and userId
        const hasAccess = await getCourseAccessRole(user.role, user.id, courseId, isSlug);
        if (hasAccess && hasAccess.role == Role.STUDENT && hasAccess.dateJoined) {
          userRole = Role.STUDENT;

          let certificateInfo = await prisma.courseRegistration.findFirst({
            where: {
              studentId: user.id,
              order: {
                productId: hasAccess.isLearningPath ? hasAccess.productId : courseDBDetails.courseId,
              },
            },
            select: {
              certificate: {
                where: {
                  productId: courseDBDetails.courseId,
                },
                select: {
                  id: true,
                },
              },
            },
          });

          certificateId =
            certificateInfo?.certificate.map((certi) => certi.id).length == 0
              ? undefined
              : certificateInfo?.certificate.map((certi) => certi.id)[0];

          // Get today's date
          const today = new Date();

          // Calculate the difference in time (in milliseconds) between the end date and today
          const timeDifference = hasAccess.dateExpiry ? hasAccess.dateExpiry.getTime() - today.getTime() : undefined;

          remainingDays = timeDifference && Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
          enrolmentDate = hasAccess.dateJoined.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });
        }
      }
    }

    let contentDurationInHrs = 0;
    let assignmentCount = 0;

    const lessons = courseDBDetails.chapters.flatMap((c) => c.resource);
    lessons.forEach((l) => {
      if (l.assignment && l.assignment.estimatedDuration) {
        assignmentCount++;
        contentDurationInHrs += Number((l.assignment.estimatedDuration / 60).toFixed(1));
      } else if (l.video && l.video.videoDuration) {
        contentDurationInHrs += Number((l.video.videoDuration / 3600).toFixed(1));
      }
    });

    let chapters: IChapterView[] = courseDBDetails.chapters.map((c) => {
      const lessons: ILessonView[] = c.resource.map((l) => {
        if (l.assignment && l.assignment.estimatedDuration) {
          return {
            name: l.name,
            description: l.description || "",
            state: l.state,
            sequenceId: l.sequenceId,
            lessonType: ResourceContentType.Assignment,
            durationInMins: l.assignment.estimatedDuration,
          };
        } else {
          const vidDuration = l?.video?.videoDuration || 0;
          return {
            name: l.name,
            description: l.description || "",
            state: l.state,
            lessonType: ResourceContentType.Video,
            sequenceId: l.sequenceId,

            durationInMins: Number((vidDuration / 60).toFixed(1)),
          };
        }
      });
      return {
        name: c.name,
        description: c.description || "",
        lessons: lessons,
      };
    });

    const courseDetailedView: ICourseDetailView = {
      id: courseDBDetails.courseId,
      name: courseDBDetails.name,
      description: courseDBDetails.description,
      state: courseDBDetails.state,
      expiryInDays: courseDBDetails.expiryInDays,
      difficultyLevel: courseDBDetails.difficultyLevel || courseDifficultyType.Beginner,
      chapters: chapters,
      trailerEmbedUrl: courseDBDetails.tvUrl || undefined,
      role: userRole,
      remainingDays: remainingDays || null,
      enrolmentDate: enrolmentDate || null,
      certificateId: certificateId || null,
      author: {
        name: courseDBDetails.user.name,
        imageUrl: courseDBDetails.user.image || null,
        designation: `Software engineer`,
      },
      pricing: {
        amount: courseDBDetails.coursePrice || 0,
        currency: await getCurrency(gatewayProvider.CASHFREE),
      },
      contentDurationInHrs: contentDurationInHrs,
      assignmentsCount: assignmentCount,
    };

    return new APIResponse(true, 200, `Succesfully fetched course detailed view`, courseDetailedView);
  } else return new APIResponse(true, 200, `Succesfully fetched course detailed view`);
};

export const listCourseListItems = async (token: JWT | null): Promise<ICourseListItem[]> => {
  let courses: ICourseListItem[] = [];

  const allCourses = await prisma.course.findMany({
    select: {
      courseId: true,
      name: true,
      difficultyLevel: true,
      state: true,
      description: true,
      totalResources: true,
      previewMode: true,
      tvThumbnail: true,
      coursePrice: true,
      slug: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  let courseListItems: ICourseListItem[] = await Promise.all(
    allCourses.map(async (c) => {
      let userRole: Role = Role.NOT_ENROLLED;
      if (token) {
        if (token.role === Role.ADMIN) {
          userRole = Role.ADMIN;
        } else if (token.role == Role.AUTHOR && c.user.id == token.id) {
          userRole = Role.AUTHOR;
        } else {
          //get the registration details for this course and userId
          const hasAccess = await getCourseAccessRole(token.role, token.id, c.courseId);

          const registrationDetails = await prisma.courseRegistration.count({
            where: {
              studentId: token.id,
              order: {
                productId: hasAccess.isLearningPath ? hasAccess.productId : c.courseId,
              },
            },
          });
          if (registrationDetails > 0) {
            userRole = Role.STUDENT;
          }
        }
      }
      return {
        id: c.courseId,
        title: c.name,
        slug: c.slug || `${c.courseId}-`,
        description: c.description,
        difficultyLevel: c.difficultyLevel,
        author: c.user.name,
        price: c.coursePrice,
        trailerThumbnail: c.tvThumbnail || null,
        currency: await getCurrency(gatewayProvider.CASHFREE),

        state: c.state,
        userRole: userRole,
      };
    })
  );

  if (token === null || (token && token.role === Role.STUDENT)) {
    courses = courseListItems.filter((c) => c.state === StateType.ACTIVE);
  } else if (token && token.role === Role.AUTHOR) {
    courses = courseListItems.filter((c) => c.state === StateType.ACTIVE || (c.userRole && c.userRole === Role.AUTHOR));
  } else {
    courses = courseListItems;
  }
  return courses;
};

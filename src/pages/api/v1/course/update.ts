import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { createSlug } from "@/lib/utils";
import { readFieldWithFile } from "../upload/video/upload";
import { uploadThumbnail } from "@/actions/uploadThumbnail";
import { APIResponse } from "@/types/apis";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;

    const body = JSON.parse(fields.course[0]);
    const name = createSlug(fields.title[0]);
    const fileType = fields.hasOwnProperty("fileType") && fields.fileType[0];
    let courseId = Number(body.courseId);

    const findCourse = await prisma.course.findUnique({
      where: {
        courseId: body.courseId,
      },
      select: {
        thumbnail: true,
      },
    });
    let response: APIResponse<any>;
    let thumbnail;

    if (files.file) {
      response = await uploadThumbnail(files.file[0], name, "course", fileType);
      if (response.success) {
        thumbnail = response.body;
      } else {
        return res.status(response.status).json(response);
      }
    }

    if (findCourse) {
      let slug = `untitled-${new Date().getTime()}`;
      if (body.name && body.name != "Untitled") {
        slug = createSlug(body.name);
      }
      const updateCourse = await prisma.course.update({
        where: {
          courseId: Number(courseId),
        },
        data: {
          ...body,
          thumbnail: thumbnail ? thumbnail : findCourse.thumbnail,
          slug: slug,
        },
      });
      return res.status(200).json({
        info: false,
        success: true,
        message: "Course updated successfully",
        course: updateCourse,
      });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

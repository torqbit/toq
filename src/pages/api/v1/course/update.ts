import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { createSlug } from "@/lib/utils";
import { readFieldWithFile } from "../upload/video/upload";
import { uploadThumbnail } from "@/actions/uploadThumbnail";
import { APIResponse } from "@/types/apis";
import { FileObjectType } from "@/types/cms/common";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;

    const body = JSON.parse(fields.course[0]);
    const name = createSlug(body.name);
    let courseId = Number(body.courseId);
    let response: APIResponse<any>;
    let thumbnail;

    if (files.file) {
      response = await uploadThumbnail(files.file[0], name, FileObjectType.COURSE, "thumbnail", body.thumbnail);
      if (response.success) {
        thumbnail = response.body;
      } else {
        return res.status(response.status).json(response);
      }
    }

    const findCourse = await prisma.course.findUnique({
      where: {
        courseId: body.courseId,
      },
      select: {
        thumbnail: true,
      },
    });

    if (findCourse) {
      const updateCourse = await prisma.course.update({
        where: {
          courseId: Number(courseId),
        },
        data: {
          ...body,
          thumbnail: thumbnail ? thumbnail : findCourse.thumbnail,
          slug: name,
        },
      });
      return res.status(200).json({
        info: false,
        success: true,
        message: "Course has been updated",
        course: updateCourse,
      });
    } else {
      return res.status(400).json({ success: false, error: "Course not found" });
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

import { getToken } from "next-auth/jwt";

import { getCookieName } from "@/lib/utils";
import { ProductType } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const authorId = token?.id;

    const productCreate = await prisma.product.create({
      data: {
        ptype: ProductType.COURSE,
      },
    });

    let response = await prisma.course.create({
      data: {
        courseId: productCreate.productId,
        name: "Untitled",
        description: "Description about the Untitled Course",
        slug: `untitled-${new Date().getTime()}`,
        durationInMonths: 1,
        state: "DRAFT",
        authorId: authorId || "",
        skills: [],
        about: "",
        sequenceId: 0,
        icon: "",
      },
    });
    return res.status(201).json({
      success: true,
      message: "Draft course created",
      getCourse: response,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

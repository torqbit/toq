import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import withValidation from "@/lib/api-middlewares/with-validation";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { addDays, getCookieName } from "@/lib/utils";
import MailerService from "@/services/MailerService";
import { CourseState, CourseType, orderStatus, ProductType } from "@prisma/client";
import { PaymentManagemetService } from "@/services/payment/PaymentManagementService";
import { CashFreeConfig, CoursePaymentConfig, UserConfig } from "@/types/payment";
import { APIResponse } from "@/types/apis";

export const validateReqBody = z.object({
  pathId: z.number(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cookieName = getCookieName();

    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const body = await req.body;
    const reqBody = validateReqBody.parse(body);
    console.log(reqBody, "req");
    // check is user Active

    if (!token || !token.isActive) {
      return res.status(400).json({
        success: false,
        error: " You don't have an active user",
      });
    }

    // check user already enrolled

    const alreadyEnrolled = await prisma.order.findUnique({
      where: {
        studentId_productId: {
          productId: reqBody.pathId,
          studentId: token.id,
        },
      },
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        alreadyEnrolled: true,
        error: "You have already enrolled in this course",
      });
    }

    const learningPath = await prisma.learningPath.findUnique({
      where: {
        id: reqBody.pathId,
      },
      select: {
        price: true,
        slug: true,
        title: true,
        banner: true,
        learningPathCourses: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (learningPath && learningPath?.price === 0) {
      //   const expiryDate = addDays(Number(course.expiryInDays));
      // IF COURSE IS FREE
      const alreadyRegisteredCourses = await prisma.courseRegistration.findMany({
        where: {
          order: {
            product: {
              productId: {
                in: learningPath.learningPathCourses.map((C) => C.courseId),
              },
            },
            studentId: token.id,
          },
        },
      });
      console.log(alreadyRegisteredCourses, "already");
      //   await prisma.$transaction(async (tx) => {
      //     const createOrder = await tx.order.create({
      //       data: {
      //         studentId: token.id,
      //         orderStatus: orderStatus.SUCCESS,
      //         productId: reqBody.pathId,
      //         amount: 0,
      //       },
      //     });

      //     const createRegistration = learningPath.learningPathCourses
      //       .map((c) => c.courseId)
      //       .map((cId) => {
      //         return {
      //           studentId: token.id,
      //           orderId: createOrder.id,
      //           courseState: CourseState.ENROLLED,
      //         };
      //       });

      //     await prisma.courseRegistration.create({
      //       data: {
      //         studentId: token.id,

      //         orderId: createOrder.id,
      //         courseState: CourseState.ENROLLED,
      //       },
      //     });
      //   });

      //   const configData = {
      //     name: token.name,
      //     email: token.email,

      //     url: `${process.env.NEXTAUTH_URL}/academy/${learningPath.slug}`,
      //     course: {
      //       name: learningPath.title,
      //       thumbnail: learningPath.banner,
      //     },
      //   };

      //   MailerService.sendMail("COURSE_ENROLMENT", configData).then((result) => {
      //     console.log(result.error);
      //   });

      return res.status(200).json({
        success: true,
        message: "Congratulations! You’ve successfully enrolled in this learning path.",
      });
    } else {
      return res.status(404).json(new APIResponse(false, 404, "Learning path not found"));
    }
  } catch (error: any) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withValidation(validateReqBody, withAuthentication(handler)));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import withValidation from "@/lib/api-middlewares/with-validation";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-method";
import * as z from "zod";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { CourseState, EntityType, NotificationType, orderStatus } from "@prisma/client";
import { APIResponse } from "@/types/apis";
import { ISendNotificationProps } from "@/types/notification";
import NotificationHandler from "@/actions/notification";
import EmailManagementService from "@/services/cms/email/EmailManagementService";

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
    // check is user Active

    if (!token || !token.isActive) {
      return res.status(400).json({
        success: false,
        error: " You don't have an active user",
      });
    }

    // check user already enrolled

    const alreadyEnrolled = await prisma.order.findFirst({
      where: {
        productId: reqBody.pathId,
        studentId: token.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        alreadyEnrolled: true,
        error: "You have already enrolled in this learning path",
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
        authorId: true,
        learningPathCourses: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (learningPath && learningPath?.price === 0) {
      await prisma.$transaction(async (tx) => {
        const createOrder = await tx.order.create({
          data: {
            studentId: token.id,
            orderStatus: orderStatus.SUCCESS,
            productId: reqBody.pathId,
            amount: 0,
          },
        });

        await prisma.courseRegistration.create({
          data: {
            studentId: token.id,
            orderId: createOrder.id,
            courseState: CourseState.ENROLLED,
          },
        });
      });

      let notificationData: ISendNotificationProps = {
        notificationType: NotificationType.ENROLLED,
        recipientId: learningPath?.authorId,
        subjectId: String(token?.id),
        subjectType: EntityType.USER,
        objectId: String(reqBody.pathId),
        objectType: EntityType.LEARNING_PATH,
      };

      NotificationHandler.createNotification(notificationData);

      const configData = {
        name: token.name,
        email: token.email,

        url: `${process.env.NEXTAUTH_URL}/academy/${learningPath.slug}`,
        course: {
          name: learningPath.title,
          thumbnail: learningPath.banner,
        },
      };
      const ms = await EmailManagementService.getMailerService();

      ms &&
        ms.sendMail("LEARNING_ENROLMENT", configData).then((result) => {
          console.log(result.error);
        });

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

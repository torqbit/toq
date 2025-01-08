import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { addDays, generateDayAndYear, getCookieName } from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import MailerService from "@/services/MailerService";
import { CourseState, CourseType, gatewayProvider, paymentMode, paymentStatus } from "@prisma/client";
import { BillingService } from "@/services/BillingService";
import { InvoiceData } from "@/types/payment";
import { businessConfig } from "@/services/businessConfig";
import appConstant from "@/services/appConstant";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookieName = getCookieName();
    const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
    const { courseId, amount, studentId } = req.body;

    const course = await prisma.course.findUnique({
      where: {
        courseId: courseId,
      },
      select: {
        courseType: true,
        tvThumbnail: true,
        name: true,
        expiryInDays: true,
        coursePrice: true,
        slug: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    const findUserDetail = await prisma.user.findUnique({
      where: {
        id: studentId,
      },
      select: {
        name: true,
        email: true,
        phone: true,
      },
    });

    if (token?.id !== course?.user.id) {
      return res.status(403).json({ success: false, error: "You are not authorized" });
    }

    if (course && findUserDetail) {
      const expiryDate = addDays(Number(course.expiryInDays));
      // IF COURSE IS FREE
      if (course.courseType === CourseType.FREE) {
        await prisma.courseRegistration
          .create({
            data: {
              studentId: studentId,
              courseId: courseId,
              expireIn: expiryDate,
              courseState: CourseState.ENROLLED,
            },
          })
          .then((result) => {
            const configData = {
              name: findUserDetail?.name,
              email: findUserDetail?.email,
              url: `${process.env.NEXTAUTH_URL}/courses/${course.slug}`,
              course: {
                name: course.name,
                thumbnail: course.tvThumbnail,
              },
            };

            MailerService.sendMail("COURSE_ENROLMENT", configData).then((result) => {
              console.log(result.error);
            });
          });

        return res.status(200).json({
          success: true,
          message: "Course has been registered",
        });
      }

      // IF COURSE IS PAID

      if (course.courseType === CourseType.PAID) {
        const registerCourse = await prisma.courseRegistration.create({
          data: {
            studentId: studentId,
            courseId: courseId,
            expireIn: expiryDate,
            courseState: CourseState.ENROLLED,
            courseType: CourseType.PAID,
          },
          select: {
            registrationId: true,
          },
        });

        const order = await prisma.order.create({
          data: {
            studentId: studentId,
            latestStatus: paymentStatus.SUCCESS,
            courseId: courseId,
            paymentGateway: gatewayProvider.CASH,
            amount: amount,
            registrationId: registerCourse.registrationId,
            paymentMode: paymentMode.OFFLINE,
          },
          select: {
            id: true,
          },
        });

        const invoiceData = await prisma.invoice.create({
          data: {
            studentId: studentId,
            taxRate: appConstant.payment.taxRate,
            taxIncluded: true,
            paidDate: new Date(),
            amountPaid: amount,
            orderId: order.id,
            items: { courses: [courseId] },
          },
        });

        const invoiceConfig: InvoiceData = {
          courseDetail: {
            courseId: courseId,
            courseName: course.name,

            slug: String(course.slug),
            validUpTo: generateDayAndYear(addDays(Number(course.expiryInDays))),
            thumbnail: String(course.thumbnail),
          },

          totalAmount: amount,
          currency: "INR",
          businessInfo: {
            gstNumber: businessConfig.gstNumber,
            panNumber: businessConfig.panNumber,
            address: businessConfig.address,
            state: businessConfig.state,
            country: businessConfig.country,
            taxRate: Number(invoiceData.taxRate),
            taxIncluded: invoiceData.taxIncluded,
            platformName: appConstant.platformName,
          },
          stundentInfo: {
            name: String(findUserDetail?.name),
            email: String(findUserDetail?.email),
            phone: String(findUserDetail?.phone),
          },

          invoiceNumber: Number(invoiceData.id),
        };
        let savePath = `${process.env.MEDIA_UPLOAD_PATH}/${appConstant.invoiceTempDir}/${invoiceData.id}_invoice.pdf`;

        new BillingService().sendInvoice(invoiceConfig, savePath);

        return res.status(200).json({
          success: true,
          message: "Course has been registered",
        });
      }
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
export default withMethods(["POST"], withAuthentication(withUserAuthorized(handler)));

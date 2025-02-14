import { APIResponse } from "@/types/apis";
import prisma from "@/lib/prisma";
import { CourseState, CourseType, EntityType, NotificationType, orderStatus } from "@prisma/client";
import { addDays } from "@/lib/utils";
import { ISendNotificationProps } from "@/types/notification";
import NotificationHandler from "@/actions/notification";
import { CoursePaymentConfig, PaymentApiResponse, UserConfig } from "@/types/payment";
import { PaymentManagemetService } from "@/services/payment/PaymentManagementService";
import { ICourseEnrollmentProps } from "@/types/courses/Course";
import EmailManagemetService from "@/services/cms/email/EmailManagementService";
class EnrollmentService {
  async sendNotificationAndMail(info: ICourseEnrollmentProps): Promise<APIResponse<string>> {
    let notificationData: ISendNotificationProps = {
      notificationType: NotificationType.ENROLLED,
      recipientId: info.courseInfo.authorId,
      subjectId: info.studentInfo.studentId,
      subjectType: EntityType.USER,
      objectId: String(info.courseInfo.courseId),
      objectType: EntityType.COURSE,
    };

    NotificationHandler.createNotification(notificationData);

    const configData = {
      name: info.studentInfo.name,
      email: info.studentInfo.email,

      url: `${process.env.NEXTAUTH_URL}/courses/${info.courseInfo.slug}`,
      course: {
        name: info.courseInfo.name,
        thumbnail: info.courseInfo.tvThumbnail,
      },
    };

    const ms = await EmailManagemetService.getMailerService();
    if (ms) {
      ms.sendMail("COURSE_ENROLMENT", configData).then((result) => {
        console.log(result.error);
      });
    }
    return new APIResponse(true, 200, "Congratulations! You’ve successfully enrolled in this course.");
  }

  async freeCourseEnrollment(info: ICourseEnrollmentProps): Promise<APIResponse<string>> {
    await prisma.$transaction(async (tx) => {
      const createOrder = await tx.order.create({
        data: {
          studentId: info.studentInfo.studentId,
          orderStatus: orderStatus.SUCCESS,
          productId: info.courseInfo.courseId,
          amount: 0,
        },
      });

      await prisma.courseRegistration.create({
        data: {
          studentId: info.studentInfo.studentId,
          expireIn: info.courseInfo.expiryDate,
          orderId: createOrder.id,
          courseState: CourseState.ENROLLED,
        },
      });
    });

    return await this.sendNotificationAndMail(info);
  }

  async paidCourseEnrollment(
    info: ICourseEnrollmentProps
  ): Promise<APIResponse<PaymentApiResponse | { phoneNotFound: boolean } | { alreadyEnrolled: boolean }>> {
    if (!info.studentInfo.phone) {
      return new APIResponse(false, 404, "Missing phone number", { phoneNotFound: true });
    } else if (info.studentInfo.phone.length > 10 || info.studentInfo.phone.length < 10) {
      return new APIResponse(false, 404, "Phone number must be of 10 digits !", { phoneNotFound: true });
    } else {
      const userConfig: UserConfig = {
        studentId: info.studentInfo.studentId,
        email: info.studentInfo.email,
        studentName: info.studentInfo.name,
        phone: info.studentInfo.phone,
      };

      const courseConfig: CoursePaymentConfig = {
        courseId: info.courseInfo.courseId,
        slug: info.courseInfo.slug,
        amount: info.courseInfo.coursePrice,
        coursePrice: info.courseInfo.coursePrice,
      };
      const pms = new PaymentManagemetService();

      const paymentData = await pms.processPayment(userConfig, courseConfig);
      if (paymentData.status == 208) {
        return new APIResponse(paymentData.success, paymentData.status, paymentData.message, { alreadyEnrolled: true });
      }
      return paymentData;
    }
  }

  async courseEnrollment(
    studentInfo: {
      studentId: string;
      name: string;
      email: string;
    },
    courseId: number
  ): Promise<APIResponse<any>> {
    const registrationDetail = await prisma.courseRegistration.findFirst({
      where: {
        studentId: studentInfo.studentId,
        order: {
          productId: courseId,
        },
      },
      select: {
        registrationId: true,
        expireIn: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const courseDetail = await prisma.course.findUnique({
      where: {
        courseId: courseId,
      },
      select: {
        authorId: true,
        coursePrice: true,
        expiryInDays: true,
        slug: true,
        name: true,
        tvThumbnail: true,
      },
    });
    const expiryDate = addDays(Number(courseDetail?.expiryInDays));

    let info: ICourseEnrollmentProps = {
      courseInfo: {
        expiryDate,
        courseId: courseId,
        authorId: courseDetail?.authorId || "",
        slug: courseDetail?.slug || "",
        name: courseDetail?.name || "",
        coursePrice: courseDetail?.coursePrice || 0,
        tvThumbnail: courseDetail?.tvThumbnail || "",
      },
      studentInfo: studentInfo,
    };

    if (courseDetail) {
      if (registrationDetail?.expireIn && registrationDetail.expireIn.getTime() > new Date().getTime()) {
        return new APIResponse(false, 400, "You have already enrolled in this course", { alreadyEnrolled: true });
      } else {
        if (courseDetail?.coursePrice == 0) {
          return await this.freeCourseEnrollment(info);
        } else {
          return await this.paidCourseEnrollment(info);
        }
      }
    } else {
      return new APIResponse(false, 404, "Course detail not found");
    }
  }
}

export default new EnrollmentService();

import ProgramService from "@/services/ProgramService";
import { getFetch, IResponse, postFetch } from "@/services/request";
import { CourseLessonAPIResponse, CourseLessons, ICourseDetailView, ICoursePriviewInfo } from "@/types/courses/Course";
import { Alert, AlertProps, Breadcrumb, Form, Modal, message } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { $Enums, CourseState, orderStatus, Role } from "@prisma/client";
import styles from "@/styles/Preview.module.scss";
import appConstant from "@/services/appConstant";
import AddPhone from "@/components/AddPhone/AddPhone";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import getCourseDetail, { extractLessonAndChapterDetail } from "@/actions/getCourseDetail";
import prisma from "@/lib/prisma";
import { PaymentManagemetService } from "@/services/payment/PaymentManagementService";
import { getCourseDetailedView } from "@/actions/courses";
import Preview from "@/components/Admin/Content/Preview";

const LearnCoursesPage: NextPage<{
  siteConfig: PageSiteConfig;
  userRole: Role;
  course: ICoursePriviewInfo;
  courseViewDetail?: ICourseDetailView;
  lessons: CourseLessons[];
  courseId: number;
}> = ({ siteConfig, userRole, course, courseViewDetail, lessons, courseId }) => {
  const router = useRouter();
  const [form] = Form.useForm();

  const [courseDetail, setCourseDetail] = useState<CourseLessonAPIResponse>({
    success: lessons.length > 0,
    statusCode: lessons.length > 0 ? 200 : 404,
    message: "",
    course,
    lessons,
  });
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>();
  const [nextLessonId, setNextLessonId] = useState<number>();
  const [paymentDisable, setPaymentDisable] = useState<boolean>(false);
  const [paymentStatusLoading, setPaymentStatusLaoding] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");

  const [modal, contextModalHolder] = Modal.useModal();

  const [enableModal, setModal] = useState<{ active: boolean; message: string }>({ active: false, message: "" });

  const [alertConfig, setAlertConfig] = useState<AlertProps>({
    type: "info",
    description: "",
    message: "",
  });

  const [paymentStatus, setPaymentStatus] = useState<orderStatus>();

  const handleCheckout = async (sessionId: string, gatewayName: string) => {
    switch (gatewayName) {
      case $Enums.gatewayProvider.CASHFREE:
        const cashfree = await load({
          mode: "sandbox",
        });

        let checkoutOptions = {
          paymentSessionId: sessionId,
          redirectTarget: "_self",
        };
        cashfree.checkout(checkoutOptions).then((result: any) => {
          if (result.paymentDetails) {
            setPaymentDisable(false);
            setPaymentStatus(orderStatus.SUCCESS);
            setRefresh(!refresh);
          }
          setLoading(false);
        });

        break;
      default:
        setLoading(false);
        messageApi.error("Unable to find the payment provider.Contact the support team");
    }
  };

  const getNextLessonId = async (courseId: number) => {
    ProgramService.getNextLessonId(
      courseId,
      (result) => {
        setNextLessonId(result.nextLessonId);
      },
      (error) => {}
    );
  };

  const handleLessonRedirection = async (courseId: number) => {
    ProgramService.getNextLessonId(
      courseId,
      (result) => {
        router.replace(`/courses/${router.query.slug}/lesson/${result.nextLessonId}`);
      },
      (error) => {}
    );
  };

  const onEnrollCourse = async () => {
    setLoading(true);
    try {
      if (
        courseDetail?.course.userRole === Role.AUTHOR ||
        courseDetail?.course.userRole === Role.ADMIN ||
        courseDetail?.course.userRole === Role.STUDENT
      ) {
        router.replace(`/courses/${router.query.slug}/lesson/${nextLessonId}`);
        return;
      }
      const res = await postFetch(
        {
          courseId: Number(courseId),
          orderId,
        },
        "/api/v1/course/enroll"
      );
      const result = (await res.json()) as IResponse;

      if (res.ok && result.success) {
        getPaymentStatus();
        if (courseDetail?.course.courseType === $Enums.CourseType.FREE) {
          setLoading(false);
          setRefresh(!refresh);

          modal.success({
            title: result.message,
            onOk: () => {
              handleLessonRedirection(courseId);
            },
          });
        } else if (courseDetail?.course.courseType === $Enums.CourseType.PAID) {
          handleCheckout(result.gatewayResponse.sessionId, result.gatewayName);
        }
      } else {
        if (result.alreadyEnrolled) {
          router.replace(`/courses/${router.query.slug}/lesson/${nextLessonId}`);
          setLoading(false);
        } else {
          if (result.phoneNotFound && result.error) {
            setModal({ active: true, message: result.error });
          } else {
            messageApi.error(result.error);
          }
          getPaymentStatus();
          setLoading(false);
        }
      }
    } catch (err: any) {
      messageApi.error("Error while enrolling course ", err?.message);
      setLoading(false);
    }
  };

  const handlePurchase = async (courseId: number) => {
    console.log(`inside purchase`);
    setLoading(true);
    try {
      const res = await postFetch(
        {
          courseId: courseId,
        },
        "/api/v1/course/enroll"
      );
      const result = (await res.json()) as IResponse;

      if (res.ok && result.success) {
        // getPaymentStatus();
        if (courseDetail?.course.courseType === $Enums.CourseType.FREE) {
          setLoading(false);
          setRefresh(!refresh);

          modal.success({
            title: result.message,
            onOk: () => {
              handleLessonRedirection(courseId);
            },
          });
        } else if (courseDetail?.course.courseType === $Enums.CourseType.PAID) {
          handleCheckout(result.gatewayResponse.sessionId, result.gatewayName);
        }
      } else {
        if (result.alreadyEnrolled) {
          router.replace(`/courses/${router.query.slug}/lesson/${nextLessonId}`);
          setLoading(false);
        } else {
          if (result.phoneNotFound && result.error) {
            setModal({ active: true, message: result.error });
          } else {
            messageApi.error(result.error);
          }
          // getPaymentStatus();
          setLoading(false);
        }
      }
    } catch (err: any) {
      messageApi.error("Error while enrolling course ", err?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      userRole && getNextLessonId(courseId);
      userRole && getPaymentStatus();

      setTimeout(() => {
        userRole && getPaymentStatus();
      }, appConstant.payment.lockoutMinutes + 3000);
    }
  }, [courseId, refresh]);

  const getPaymentStatus = async () => {
    setPaymentStatusLaoding(true);
    const res = await getFetch(`/api/v1/course/payment/paymentStatus?courseId=${courseId}`);
    const result = (await res.json()) as IResponse;
    if (router.query.callback) {
      setAlertConfig({ type: result.alertType, message: result.alertMessage, description: result.alertDescription });
    }

    if (result.success) {
      setPaymentDisable(result.paymentDisable);
      setOrderId(result.orderId);
      setPaymentStatus(result.status);
      setPaymentStatusLaoding(false);
    } else {
      setPaymentDisable(false);
      setPaymentStatus(result.status);
      setPaymentStatusLaoding(false);
    }
  };

  const onCloseAlert = () => {
    router.replace(`/courses/${router.query.slug}`);
  };

  const onCloseModal = () => {
    setModal({ active: false, message: "" });
    form.resetFields();
  };

  return (
    <>
      {!userRole ? (
        <>
          <MarketingLayout
            siteConfig={siteConfig}
            heroSection={
              courseViewDetail && (
                <Preview
                  courseDetail={courseViewDetail}
                  previewMode={false}
                  handlePurchase={() => router.push(`/login?redirect=courses/${router.query.slug}`)}
                  handleLessonRedirection={() => {}}
                  extraStyle={{ padding: "100px 0 50px" }}
                />
              )
            }
          >
            {/* <CoursePreview
              courseId={Number(courseId)}
              nextLessonId={nextLessonId}
              courseDetails={course}
              chapters={lessons}
              onEnrollCourse={() => {}}
              paymentDisable={false}
            /> */}
          </MarketingLayout>
        </>
      ) : (
        <AppLayout siteConfig={siteConfig}>
          {contextMessageHolder}
          {contextModalHolder}

          {router.query.callback && alertConfig.message && (
            <Alert
              message={alertConfig.message}
              description={alertConfig.description}
              type={alertConfig.type}
              showIcon
              onClose={onCloseAlert}
              closable
              className={styles.alertMessage}
            />
          )}

          <div style={{ padding: "20px 0" }}>
            {courseViewDetail && (
              <Preview
                courseDetail={courseViewDetail}
                previewMode={false}
                handlePurchase={handlePurchase}
                handleLessonRedirection={handleLessonRedirection}
              />
            )}
          </div>

          <AddPhone title={enableModal.message} open={enableModal.active} onCloseModal={onCloseModal} />
        </AppLayout>
      )}
    </>
  );
};

export default LearnCoursesPage;
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, query } = ctx;
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  if (query.order_id && typeof query.order_id === "string") {
    const pms = new PaymentManagemetService();
    await pms.updateOrder(query.order_id);
  }

  const cdv = user
    ? await getCourseDetailedView(String(query.slug), true, {
        id: user.id,
        role: user.role,
      })
    : await getCourseDetailedView(String(query.slug), true);

  const courseInfo = await prisma?.course.findUnique({
    where: {
      slug: String(query.slug),
    },
    select: {
      courseId: true,
    },
  });
  const detail = courseInfo?.courseId && (await getCourseDetail(Number(courseInfo.courseId), user?.role, user?.id));

  if (detail && detail?.courseDetail && detail?.courseDetail.length > 0) {
    const info = extractLessonAndChapterDetail(detail.courseDetail, detail?.userStatus as CourseState, detail.userRole);
    if (user) {
      return {
        props: {
          userRole: user?.role,
          siteConfig: site,
          course: {
            ...info.courseInfo,
            progress: info.progress,
            userStatus: info.courseInfo.userStatus ? info.courseInfo.userStatus : Role.NA,
          },
          courseViewDetail: cdv.body,
          lessons: info.chapterLessons,
          courseId: courseInfo.courseId,
        },
      };
    } else {
      return {
        props: {
          siteConfig: site,
          course: {
            ...info.courseInfo,
            progress: info.progress,
            userStatus: info.courseInfo.userStatus ? info.courseInfo.userStatus : Role.NA,
          },
          courseViewDetail: cdv.body,
          lessons: info.chapterLessons,
          courseId: courseInfo.courseId,
        },
      };
    }
  } else {
    return {
      props: {
        siteConfig: site,
        lessons: [],
        courseViewDetail: cdv.body,
        courseId: courseInfo?.courseId,
      },
    };
  }
};

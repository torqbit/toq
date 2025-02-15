import ProgramService from "@/services/ProgramService";
import { getFetch, IResponse, postFetch } from "@/services/request";
import { CourseLessonAPIResponse, CourseLessons, ICourseDetailView, ICoursePriviewInfo } from "@/types/courses/Course";
import { Alert, AlertProps, Breadcrumb, Form, Modal, message } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { $Enums, CourseState, orderStatus, Role, User } from "@prisma/client";
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
import { useSession } from "next-auth/react";
import { useMediaQuery } from "react-responsive";
import { APIResponse } from "@/types/apis";

const LearnCoursesPage: NextPage<{
  siteConfig: PageSiteConfig;
  userRole: Role;
  course: ICoursePriviewInfo;
  viewDetail?: ICourseDetailView;
  lessons: CourseLessons[];
  courseId: number;
}> = ({ siteConfig, userRole, course, viewDetail, lessons, courseId }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const router = useRouter();
  const [form] = Form.useForm();
  const { data: user } = useSession();
  const [courseViewDetail, setCourseViewDetail] = useState<ICourseDetailView | undefined>(viewDetail);

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
  const [paymentStatusLoading, setPaymentStatusLoading] = useState<boolean>(false);
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
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const handleLessonRedirection = async (courseId: number) => {
    ProgramService.getNextLessonId(
      courseId,
      (result) => {
        router.push(`/courses/${router.query.slug}/lesson/${result.nextLessonId}`);
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const handlePurchase = async (courseId: number) => {
    setLoading(true);
    try {
      const res = await postFetch(
        {
          courseId: courseId,
        },
        "/api/v1/course/enroll"
      );
      const response = (await res.json()) as APIResponse<any>;
      let result = response.body;
      setLoading(false);

      if (response.success) {
        if (courseDetail?.course.courseType === $Enums.CourseType.FREE) {
          setLoading(false);
          setCourseViewDetail({ ...courseViewDetail, role: Role.STUDENT } as ICourseDetailView);
          modal.success({
            title: response.message,
            onOk: () => {
              handleLessonRedirection(courseId);
            },
          });
        } else if (courseDetail?.course.courseType === $Enums.CourseType.PAID) {
          handleCheckout(result.gatewayResponse.sessionId, result.gatewayName);
        }
      } else {
        if (result.alreadyEnrolled) {
          router.push(`/courses/${router.query.slug}/lesson/${nextLessonId}`);
          setLoading(false);
        } else {
          if (result.phoneNotFound && response.error) {
            setModal({ active: true, message: response.error });
          } else {
            messageApi.error(response.error);
          }
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.log(err);
      messageApi.error("Error while enrolling course ", err?.message);
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (courseId) {
  //     userRole && getPaymentStatus();

  //     setTimeout(() => {
  //       userRole && getPaymentStatus();
  //     }, appConstant.payment.lockoutMinutes + 3000);
  //   }
  // }, [courseId, refresh]);

  // const getPaymentStatus = async () => {
  //   setPaymentStatusLoading(true);
  //   const res = await getFetch(`/api/v1/course/payment/paymentStatus?courseId=${courseId}`);
  //   const result = (await res.json()) as IResponse;
  //   if (router.query.callback) {
  //     setPaymentStatus(result.status);
  //     setAlertConfig({ type: result.alertType, message: result.alertMessage, description: result.alertDescription });
  //   }

  //   if (result.success) {
  //     setPaymentDisable(result.paymentDisable);
  //     setOrderId(result.orderId);
  //     setPaymentStatus(result.status);
  //     setPaymentStatusLoading(false);
  //   } else {
  //     setPaymentDisable(false);
  //     setPaymentStatus(result.status);
  //     setPaymentStatusLoading(false);
  //   }
  // };

  const onCloseAlert = () => {
    router.replace(`/courses/${router.query.slug}`);
  };

  const onCloseModal = () => {
    setModal({ active: false, message: "" });
    form.resetFields();
  };

  return (
    <>
      {contextMessageHolder}
      {contextModalHolder}
      {typeof userRole === "undefined" || userRole === Role.STUDENT ? (
        <>
          <MarketingLayout
            mobileHeroMinHeight={60}
            showFooter={!isMobile || userRole !== Role.STUDENT}
            user={
              userRole
                ? ({
                    id: user?.id,
                    name: user?.user?.name || "",
                    email: user?.user?.email || "",
                    phone: user?.phone || "",
                    role: userRole,
                  } as User)
                : undefined
            }
            siteConfig={siteConfig}
          >
            {courseViewDetail && (
              <Preview
                courseDetail={courseViewDetail}
                previewMode={false}
                loading={loading}
                handlePurchase={() => {
                  userRole && userRole === Role.STUDENT
                    ? handlePurchase(courseId)
                    : router.push(`/login?redirect=courses/${router.query.slug}`);
                }}
                handleLessonRedirection={() => {
                  userRole && userRole === Role.STUDENT && handleLessonRedirection(courseId);
                }}
                paymentCallback={router.query.callback === "payment"}
                extraStyle={{ padding: "20px 0 50px" }}
              />
            )}
          </MarketingLayout>
        </>
      ) : (
        <AppLayout siteConfig={siteConfig}>
          {contextMessageHolder}
          {contextModalHolder}

          <div style={{ padding: "20px 0" }}>
            {courseViewDetail && (
              <Preview
                courseDetail={courseViewDetail}
                previewMode={false}
                loading={loading}
                handlePurchase={handlePurchase}
                paymentCallback={router.query.callback === "payment"}
                handleLessonRedirection={handleLessonRedirection}
              />
            )}
          </div>
        </AppLayout>
      )}
      <AddPhone title={enableModal.message} open={enableModal.active} onCloseModal={onCloseModal} />
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
          viewDetail: cdv.body,
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
          viewDetail: cdv.body,
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
        viewDetail: cdv.body,
        courseId: courseInfo?.courseId,
      },
    };
  }
};

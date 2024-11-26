import Preview from "@/components/Admin/Content/Preview";

import SpinLoader from "@/components/SpinLoader/SpinLoader";
import ProgramService from "@/services/ProgramService";
import { getFetch, IResponse, postFetch } from "@/services/request";
import { CourseLessonAPIResponse } from "@/types/courses/Course";
import { Alert, AlertProps, Button, Form, InputNumber, Modal, message } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { $Enums, Role } from "@prisma/client";
import styles from "@/styles/Preview.module.scss";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { useSession } from "next-auth/react";
import appConstant from "@/services/appConstant";
import AddPhone from "@/components/AddPhone/AddPhone";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

const LearnCoursesPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { data: user, update } = useSession();

  const [courseDetail, setCourseDetail] = useState<CourseLessonAPIResponse>();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>();
  const [nextLessonId, setNextLessonId] = useState<number>();
  const [paymentDisable, setPaymentDisable] = useState<boolean>(false);
  const [paymentStatusLoading, setPaymentStatusLaoding] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [modal, contextModalHolder] = Modal.useModal();
  const { dispatch, globalState } = useAppContext();

  const [enableModal, setModal] = useState<{ active: boolean; message: string }>({ active: false, message: "" });

  const [alertConfig, setAlertConfig] = useState<AlertProps>({
    type: "info",
    description: "",
    message: "",
  });

  const [paymentStatus, setPaymentStatus] = useState<$Enums.paymentStatus>();

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
            setPaymentStatus($Enums.paymentStatus.SUCCESS);
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

  const getNextLessonId = async () => {
    ProgramService.getNextLessonId(
      Number(router.query.courseId),
      (result) => {
        setNextLessonId(result.nextLessonId);
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
        router.replace(`/courses/${router.query.courseId}/lesson/${nextLessonId}`);
        return;
      }
      const res = await postFetch(
        {
          courseId: Number(router.query.courseId),
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
              getNextLessonId();
            },
          });
        } else if (courseDetail?.course.courseType === $Enums.CourseType.PAID) {
          handleCheckout(result.gatewayResponse.sessionId, result.gatewayName);
        }
      } else {
        if (result.alreadyEnrolled) {
          router.replace(`/courses/${router.query.courseId}/lesson/${nextLessonId}`);
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

  useEffect(() => {
    if (router.query.courseId) {
      getNextLessonId();
      getPaymentStatus();

      ProgramService.getCourses(
        Number(router.query.courseId),
        (result) => {
          setCourseDetail(result);
        },
        (error) => {
          message.error(error);
        }
      );
      setTimeout(() => {
        getPaymentStatus();
      }, appConstant.payment.lockoutMinutes + 3000);
    }
  }, [router.query.courseId, refresh]);

  const getPaymentStatus = async () => {
    setPaymentStatusLaoding(true);
    const res = await getFetch(`/api/v1/course/payment/paymentStatus?courseId=${router.query.courseId}`);
    const result = (await res.json()) as IResponse;
    if (router.query.callback) {
      setAlertConfig({ type: result.alertType, message: result.alertMessage, description: result.alertDescription });
    }

    if (result.success) {
      setPaymentDisable(result.paymentDisable);
      setPaymentStatus(result.status);
      setPaymentStatusLaoding(false);
    } else {
      setPaymentDisable(false);
      setPaymentStatus(result.status);
      setPaymentStatusLaoding(false);
    }
  };

  const onCloseAlert = () => {
    router.replace(`/courses/${router.query.courseId}`);
  };

  const onCloseModal = () => {
    setModal({ active: false, message: "" });
    form.resetFields();
  };

  const addPhone = async () => {
    const res = await postFetch({ phone: form.getFieldsValue().phone }, "/api/user/update");
    const result = (await res.json()) as IResponse;
    if (res.ok && result.success) {
      update({
        phone: form.getFieldsValue().phone,
      });
      dispatch({ type: "SET_USER", payload: { ...globalState.session, phone: form.getFieldsValue().phone } });
      onCloseModal();
      messageApi.success(result.message);
    } else {
      console.log(result.error);
      messageApi.error(result.error);
    }
  };
  return (
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
      {courseDetail ? (
        <Preview
          videoUrl={courseDetail?.course.courseTrailer}
          onEnrollCourse={onEnrollCourse}
          courseDetail={courseDetail}
          paymentDisable={paymentDisable}
          paymentStatus={paymentStatus}
          paymentStatusLoading={paymentStatusLoading}
          loading={loading}
        />
      ) : (
        <SpinLoader className="course__spinner" />
      )}

      <AddPhone title={enableModal.message} open={enableModal.active} onCloseModal={onCloseModal} />
    </AppLayout>
  );
};

export default LearnCoursesPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};

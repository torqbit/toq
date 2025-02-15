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
import prisma from "@/lib/prisma";
import { PaymentManagemetService } from "@/services/payment/PaymentManagementService";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "react-responsive";
import learningPath from "@/actions/learningPath";
import { ILearningPreviewDetail } from "@/types/learingPath";
import LearningPathDetail from "@/components/Admin/LearningPath/LearningPathDetail";
import LearningPathSerivices from "@/services/learningPath/LearningPathSerivices";

const LearnCoursesPage: NextPage<{
  siteConfig: PageSiteConfig;
  userRole: Role;
  detail: ILearningPreviewDetail;
  pathId: number;
}> = ({ siteConfig, userRole, pathId, detail }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const router = useRouter();
  const [form] = Form.useForm();
  const { data: user } = useSession();
  const [learningDetail, setLearningDetail] = useState<ILearningPreviewDetail>(detail);
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [nextLessonId, setNextLessonId] = useState<number>();
  const [refresh, setRefresh] = useState<boolean>(false);

  const [modal, contextModalHolder] = Modal.useModal();

  const [enableModal, setModal] = useState<{ active: boolean; message: string }>({ active: false, message: "" });

  const getLatestLessonId = async (pathId: number) => {
    LearningPathSerivices.latestLesson(pathId, (result) => {
      result.body ? router.push(`/${result.body}`) : messageApi.error(result.error);
    });
  };

  const handleLessonRedirection = async (pathId: number) => {
    getLatestLessonId(pathId);
  };

  const handlePurchase = async (pathId: number) => {
    setLoading(true);
    try {
      const res = await postFetch(
        {
          pathId: pathId,
        },
        "/api/v1/learningPath/enroll"
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        if (detail?.price === 0) {
          setLoading(false);
          setRefresh(!refresh);
          setLearningDetail({ ...learningDetail, role: Role.STUDENT });
          modal.success({
            title: result.message,
            onOk: () => {
              handleLessonRedirection(detail.id);
            },
          });
        }
      } else {
        if (result.alreadyEnrolled) {
          setLoading(false);
        } else {
          if (result.phoneNotFound && result.error) {
            setModal({ active: true, message: result.error });
          } else {
            messageApi.error(result.error);
          }
          setLoading(false);
        }
      }
      setLoading(false);
    } catch (err: any) {
      messageApi.error("Error while enrolling course ", err?.message);
      setLoading(false);
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
            {detail && (
              <LearningPathDetail
                loading={loading}
                detail={learningDetail}
                previewMode={false}
                handlePurchase={() => {
                  userRole && userRole === Role.STUDENT
                    ? handlePurchase(pathId)
                    : router.push(`/login?redirect=courses/${router.query.slug}`);
                }}
                handleLessonRedirection={() => {
                  userRole && userRole === Role.STUDENT && handleLessonRedirection(pathId);
                }}
                paymentCallback={router.query.callback === "payment"}
                extraStyle={{ padding: "20px 0 50px", width: "80vw" }}
              />
            )}
          </MarketingLayout>
        </>
      ) : (
        <AppLayout siteConfig={siteConfig}>
          {contextMessageHolder}
          {contextModalHolder}

          <div style={{ padding: "20px 0" }}>
            {detail && (
              <LearningPathDetail
                loading={loading}
                detail={learningDetail}
                previewMode={false}
                handlePurchase={handlePurchase}
                paymentCallback={router.query.callback === "payment"}
                handleLessonRedirection={handleLessonRedirection}
                extraStyle={{ width: "80vw" }}
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

  const learningInfo = await prisma?.learningPath.findFirst({
    where: {
      slug: String(query.slug),
    },
    select: {
      id: true,
    },
  });
  const detail =
    learningInfo?.id && (await learningPath.getLearningPreviewDetail(learningInfo.id, user?.role, user?.id));

  if (detail && detail?.success && detail?.body) {
    if (user) {
      return {
        props: {
          userRole: user?.role,
          siteConfig: site,
          detail: detail.body,
          pathId: learningInfo.id,
        },
      };
    } else {
      return {
        props: {
          siteConfig: site,
          detail: detail.body,
          pathId: learningInfo.id,
        },
      };
    }
  } else {
    return {
      props: {
        siteConfig: site,
        lessons: [],
        detail: null,
      },
    };
  }
};

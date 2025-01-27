import learningPath from "@/actions/learningPath";
import LearningPathForm from "@/components/Admin/LearningPath/LearningPathForm";
import AppLayout from "@/components/Layouts/AppLayout";
import { getCookieName } from "@/lib/utils";
import { getSiteConfig } from "@/services/getSiteConfig";
import learningPathSerivices from "@/services/learningPath/LearningPathSerivices";
import { PageSiteConfig } from "@/services/siteConstant";
import { ILearningCourseList, ILearningPathDetail } from "@/types/learingPath";
import { StateType } from "@prisma/client";
import { Form, message } from "antd";

import { GetServerSidePropsContext, NextPage } from "next";
import { getToken } from "next-auth/jwt";
import { useRouter } from "next/router";
import { useState } from "react";

const UpdateLearningPath: NextPage<{
  learningDetail: ILearningPathDetail;
  siteConfig: PageSiteConfig;
  courseList: ILearningCourseList[];
}> = ({ siteConfig, learningDetail, courseList }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [currentState, setCurrentState] = useState<StateType>(StateType.DRAFT);
  const router = useRouter();
  const onUpdate = (state: StateType, courses: ILearningCourseList[], file?: File) => {
    if (courses.length < 2) {
      messageApi.warning(`Learning path must have atleast 2 courses`);
      return;
    }
    setLoading(true);
    const data = {
      title: form.getFieldsValue().title,
      courses:
        courses.length > 0
          ? courses.map((l, i) => {
              return {
                courseId: l.courseId,
                learningPathId: Number(router.query.pathId),
                sequenceId: i + 1,
              };
            })
          : [],
      pathId: Number(router.query.pathId),
      state: state,
      description: form.getFieldsValue().description,
      banner: learningDetail.banner,
    };

    const formData = new FormData();
    formData.append("learingPath", JSON.stringify(data));
    file && formData.append("file", file);
    learningPathSerivices.update(
      formData,
      (result) => {
        messageApi.success(result.message);
        form.setFieldsValue({
          title: result.body?.title,
          description: result.body?.description,
          slug: result.body?.slug,
          banner: result.body?.banner,
        });
        result.body?.state && setCurrentState(result.body.state);
        setLoading(false);
      },
      (error) => {
        messageApi.error(error);
        setLoading(false);
      }
    );
  };
  return (
    <AppLayout siteConfig={siteConfig}>
      {contextHolder}
      <LearningPathForm
        loading={loading}
        onSubmit={onUpdate}
        form={form}
        pathId={Number(router.query.pathId)}
        courseList={courseList}
        currentState={currentState}
        title="Update Learning Path"
        initialValue={{
          title: learningDetail.title,
          description: learningDetail.description,
          courses: learningDetail?.learningPathCourses || [],
          banner: learningDetail.banner,
        }}
      />{" "}
    </AppLayout>
  );
};
export default UpdateLearningPath;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query, req } = ctx;
  const siteConfig = getSiteConfig();
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const { site } = siteConfig;
  const getCoursesList = await learningPath.getCoursesList();
  const getDetailResponse = await learningPath.getLearningDetail(Number(query.pathId), user?.role, user?.id);
  if (getDetailResponse && getDetailResponse.success && getDetailResponse.body) {
    return {
      props: {
        siteConfig: site,
        courseList: getCoursesList.body || [],

        learningDetail: getDetailResponse.body,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/academy",
      },
    };
  }
};

import learningPath from "@/actions/learningPath";
import LearningPathForm from "@/components/Admin/LearningPath/LearningPathForm";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import learningPathSerivices from "@/services/learningPath/LearningPathSerivices";
import { PageSiteConfig } from "@/services/siteConstant";
import { ILearningCourseList } from "@/types/learingPath";
import { StateType } from "@prisma/client";
import { Form, message } from "antd";

import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const AddLearningPath: NextPage<{ courseList: ILearningCourseList[]; siteConfig: PageSiteConfig }> = ({
  siteConfig,
  courseList,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [currentState, setCurrentState] = useState<StateType>(StateType.DRAFT);
  const router = useRouter();

  const onSubmit = (state: StateType, courses: ILearningCourseList[], file?: File) => {
    if (!file) {
      messageApi.warning(`Learning path must have a banner`);
      return;
    }
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
                learningPathId: 0,
                sequenceId: i + 1,
              };
            })
          : [],
      state: state,
      description: form.getFieldsValue().description,
    };
    const formData = new FormData();
    formData.append("learingPath", JSON.stringify(data));
    file && formData.append("file", file);
    learningPathSerivices.create(
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

        router.push(`/academy`);
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
        onSubmit={onSubmit}
        form={form}
        courseList={courseList}
        currentState={currentState}
        title="New Learning Path"
      />{" "}
    </AppLayout>
  );
};
export default AddLearningPath;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  const courseList = await learningPath.getCoursesList();
  return {
    props: {
      siteConfig: site,
      courseList: courseList.body || [],
    },
  };
};

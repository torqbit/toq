import BlogForm from "@/components/Admin/Content/BlogForm";

import { GetServerSidePropsContext } from "next";
import prisma from "@/lib/prisma";
import { FC } from "react";
import { StateType } from "@prisma/client";
import AppLayout from "@/components/Layouts/AppLayout";
interface IProps {
  htmlData: string;
  bannerImage: string;
  title: string;
  state: StateType;
  contentType: string;
}

const BlogFormPage: FC<IProps> = ({ htmlData, bannerImage, title, state, contentType }) => {
  return (
    <>
      <AppLayout>
        <BlogForm contentType={contentType} htmlData={htmlData} bannerImage={bannerImage} title={title} state={state} />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const params = ctx?.params;

  const contentData = await prisma.blog.findUnique({
    where: {
      id: String(params?.blogId),
    },
    select: {
      banner: true,
      state: true,
      content: true,
      title: true,
      contentType: true,
    },
  });
  if (contentData) {
    return {
      props: {
        htmlData: contentData?.content,
        bannerImage: contentData?.banner,
        title: contentData?.title,
        state: contentData.state,
        contentType: contentData.contentType,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,

        destination: "/admin/content",
      },
    };
  }
};

export default BlogFormPage;

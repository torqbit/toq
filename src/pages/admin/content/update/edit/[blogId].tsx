import { GetServerSidePropsContext } from "next";
import prisma from "@/lib/prisma";
import { FC } from "react";
import { StateType } from "@prisma/client";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import ContentForm from "@/components/Admin/Content/ContentForm";
interface IProps {
  htmlData: string;
  bannerImage: string;
  title: string;
  state: StateType;
  contentType: string;
  siteConfig: PageSiteConfig;
}

const BlogFormPage: FC<IProps> = ({ htmlData, bannerImage, title, state, contentType, siteConfig }) => {
  return (
    <>
      <AppLayout siteConfig={siteConfig}>
        <ContentForm
          contentType={contentType}
          htmlData={htmlData}
          bannerImage={bannerImage}
          title={title}
          state={state}
        />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const params = ctx?.params;

  const { site } = getSiteConfig();

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
        siteConfig: site,
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

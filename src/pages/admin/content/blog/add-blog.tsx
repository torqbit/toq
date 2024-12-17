import BlogForm from "@/components/Admin/Content/BlogForm";
import { GetServerSidePropsContext } from "next";
import prisma from "@/lib/prisma";

import { FC } from "react";
import { StateType } from "@prisma/client";
import AppLayout from "@/components/Layouts/AppLayout";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";
interface IProps {
  siteConfig: PageSiteConfig;
}

const AddBlog: FC<IProps> = ({ siteConfig }) => {
  return (
    <>
      <AppLayout siteConfig={siteConfig}>
        <BlogForm contentType={"BLOG"} htmlData={""} bannerImage={""} title={""} state={StateType.DRAFT} />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { site } = getSiteConfig();

  return {
    props: {
      siteConfig: site,
    },
  };
};

export default AddBlog;

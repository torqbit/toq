import { GetServerSidePropsContext } from "next";

import { FC } from "react";
import { StateType } from "@prisma/client";
import AppLayout from "@/components/Layouts/AppLayout";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";
import ContentForm from "@/components/Admin/Content/ContentForm";
interface IProps {
  siteConfig: PageSiteConfig;
}

const AddBlog: FC<IProps> = ({ siteConfig }) => {
  return (
    <>
      <AppLayout siteConfig={siteConfig}>
        <ContentForm contentType={"BLOG"} htmlData={""} bannerImage={""} title={""} state={StateType.DRAFT} />
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

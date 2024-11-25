import { GetServerSidePropsContext, NextPage } from "next";
import { EnrolledCourseList } from "./content";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

const CoursesPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return (
    <AppLayout siteConfig={siteConfig}>
      <div style={{ padding: "20px 40px 0px 40px" }}>
        <h3>Courses</h3>
        <EnrolledCourseList
          allCourses={[]}
          handleCourseDelete={() => {}}
          handleCourseStatusUpdate={() => {}}
          loading={false}
        />
      </div>
    </AppLayout>
  );
};

export default CoursesPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};

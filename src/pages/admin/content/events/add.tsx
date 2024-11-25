import EventForm from "@/components/Events/EventForm";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { GetServerSidePropsContext, NextPage } from "next";

const EventFormPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  return (
    <>
      <AppLayout siteConfig={siteConfig}>
        <EventForm />
      </AppLayout>
    </>
  );
};

export default EventFormPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};

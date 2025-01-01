import { GetServerSidePropsContext, NextPage } from "next";
import prisma from "@/lib/prisma";

import { FC } from "react";
import { Events, StateType } from "@prisma/client";
import EventForm from "@/components/Events/EventForm";
import AppLayout from "@/components/Layouts/AppLayout";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";

interface IProps {
  eventDetails: Events;
  siteConfig: PageSiteConfig;
}
const EventFormPage: FC<IProps> = ({ eventDetails, siteConfig }) => {
  return (
    <>
      <AppLayout siteConfig={siteConfig}>
        <EventForm details={eventDetails} />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const params = ctx?.params;
  const { site } = getSiteConfig();
  const eventDetails = await prisma.events.findUnique({
    where: {
      id: Number(params?.eventId),
    },
    select: {
      id: true,
      title: true,
      banner: true,
      slug: true,
      description: true,
      startTime: true,
      endTime: true,
      eventType: true,
      price: true,
      eventInstructions: true,
      eventLink: true,
      location: true,
      eventMode: true,
      state: true,
      certificate: true,
      certificateTemplate: true,
      registrationEndDate: true,
    },
  });
  if (eventDetails) {
    return {
      props: {
        eventDetails: {
          ...eventDetails,
          startTime: String(eventDetails.startTime),
          endTime: String(eventDetails.endTime),
          registrationEndDate: String(eventDetails.registrationEndDate),
        },
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
export default EventFormPage;

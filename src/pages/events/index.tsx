import { checkDateExpired, convertToDayMonthTime, getCookieName } from "@/lib/utils";
import { StateType, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { FC } from "react";
import prisma from "@/lib/prisma";
import { IEventList } from "@/services/EventService";
import styles from "@/styles/Marketing/Events/Event.module.scss";
import Events from "@/components/Events/Events";
import DefaulttHero from "@/components/Marketing/DefaultHero/DefaultHero";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";
import AppLayout from "@/components/Layouts/AppLayout";

const EventsPage: FC<{
  user: User;
  eventList: IEventList[];
  totalEventsLength: number;
  siteConfig: PageSiteConfig;
}> = ({ user, eventList, totalEventsLength, siteConfig }) => {
  return (
    <>
      {!user ? (
        <MarketingLayout
          siteConfig={siteConfig}
          user={user}
          heroSection={<DefaulttHero title="Events" description="Connect, Learn, and Thrive Together!" />}
        >
          <div className={styles.events_wrapper}>
            <Events user={user} eventList={eventList} totalEventsLength={totalEventsLength} eventLink="events" />;
          </div>
        </MarketingLayout>
      ) : (
        <AppLayout siteConfig={siteConfig}>
          <div className={styles.events_list_wrapper}>
            <div className={styles.event_header}>
              <h3>Events</h3>
            </div>
            <Events user={user} eventList={eventList} totalEventsLength={totalEventsLength} eventLink="events" />
          </div>
        </AppLayout>
      )}
    </>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const { site } = getSiteConfig();
  const siteConfig = site;
  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  const eventList = await prisma.events.findMany({
    where: {
      state: StateType.ACTIVE,

      startTime: {
        gte: new Date(),
      },
    },
    select: {
      id: true,
      title: true,
      startTime: true,
      banner: true,
      eventMode: true,
      eventType: true,
      location: true,
      slug: true,
      registrationEndDate: true,
      attendees: {
        where: {
          email: String(user?.email),
        },
        select: {
          attended: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(eventList, "this is list");

  if (eventList.length > 0) {
    return {
      props: {
        user,
        eventList: eventList.map((event) => {
          return {
            ...event,
            startTime: event.startTime ? convertToDayMonthTime(event?.startTime) : "",
            attended: event.attendees.length > 0,
            registrationEndDate: event.registrationEndDate ? convertToDayMonthTime(event.registrationEndDate) : "",
            registrationExpired: event.registrationEndDate && checkDateExpired(event.registrationEndDate),
          };
        }),

        totalEventsLength: await prisma.events.count({ where: { state: StateType.ACTIVE } }),
        siteConfig,
      },
    };
  } else {
    return {
      props: {
        user,
        eventList: [],
        siteConfig,
      },
    };
  }
};

export default EventsPage;

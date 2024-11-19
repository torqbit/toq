import { checkDateExpired, convertToDayMonthTime, getCookieName } from "@/lib/utils";
import { StateType, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { FC } from "react";
import prisma from "@/lib/prisma";
import { IEventList } from "@/services/EventService";
import styles from "@/styles/Marketing/Events/Event.module.scss";
import Events from "@/components/Events/Events";
import DefaulttHero from "@/components/Marketing/Blog/DefaultHero";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";
import { PageThemeConfig } from "@/services/themeConstant";

const EventsPage: FC<{
  user: User;
  eventList: IEventList[];
  totalEventsLength: number;
  themeConfig: PageThemeConfig;
}> = ({ user, eventList, totalEventsLength, themeConfig }) => {
  return (
    <MarketingLayout
      themeConfig={themeConfig}
      user={user}
      heroSection={<DefaulttHero title="Events" description="Connect, Learn, and Thrive Together!" />}
    >
      <div className={styles.events_wrapper}>
        <Events user={user} eventList={eventList} totalEventsLength={totalEventsLength} eventLink="events" />;
      </div>
    </MarketingLayout>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const themeConfig = useThemeConfig();
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
        themeConfig: {
          ...themeConfig,
          navBar: {
            ...themeConfig.navBar,
            component: themeConfig.navBar?.component?.name as any,
          },
        },
      },
    };
  } else {
    return {
      props: {
        user,
        eventList: [],
        themeConfig: {
          ...themeConfig,
          navBar: {
            ...themeConfig.navBar,
            component: themeConfig.navBar?.component?.name as any,
          },
        },
      },
    };
  }
};

export default EventsPage;

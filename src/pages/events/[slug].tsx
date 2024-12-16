import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { checkDateExpired, convertToDayMonthTime, getCookieName } from "@/lib/utils";
import { StateType, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { FC } from "react";
import prisma from "@/lib/prisma";
import { IEventInfo } from "@/services/EventService";
import styles from "@/styles/Marketing/Events/Event.module.scss";
import EventInfo from "@/components/Events/EventInfo";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";
import { truncateString } from "@/services/helper";
import { Breadcrumb } from "antd";
import AppLayout from "@/components/Layouts/AppLayout";

const EventInfoPage: FC<{
  user: User;
  eventInfo: IEventInfo;
  registrationExpired: boolean;
  siteConfig: PageSiteConfig;
}> = ({ user, eventInfo, registrationExpired, siteConfig }) => {
  return (
    <>
      {!user ? (
        <>
          <MarketingLayout
            siteConfig={siteConfig}
            user={user}
            heroSection={
              <div className={styles.banner_Wrapper}>
                <img src={eventInfo?.banner} alt="banner" />
              </div>
            }
          >
            <EventInfo
              user={user}
              eventInfo={eventInfo}
              registrationExpired={registrationExpired}
              eventListLink="events"
            />
          </MarketingLayout>
        </>
      ) : (
        <AppLayout siteConfig={siteConfig}>
          <div className={styles.event_list_info_wrapper}>
            <Breadcrumb
              className={styles.breadcrumb}
              items={[
                {
                  title: <a href="/events"> Events</a>,
                },
                {
                  title: `${truncateString(eventInfo.title, 25)}`,
                  className: styles.courseName,
                },
              ]}
            />
            <div className={styles.events_banner}>
              <img src={eventInfo?.banner} alt="banner" />
            </div>
            <EventInfo
              user={user}
              eventInfo={eventInfo}
              registrationExpired={registrationExpired}
              eventListLink="events"
              classNames="events_content_wrapper"
            />
          </div>
        </AppLayout>
      )}
    </>
  );
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  const { site } = getSiteConfig();
  const siteConfig = site;
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
  const eventInfo = await prisma.events.findUnique({
    where: {
      state: StateType.ACTIVE,
      slug: String(params?.slug),
    },
    select: {
      id: true,
      title: true,
      startTime: true,
      endTime: true,
      banner: true,
      eventMode: true,
      eventType: true,
      location: true,
      eventLink: true,
      price: true,
      slug: true,
      eventInstructions: true,
      description: true,
      registrationEndDate: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (eventInfo) {
    let registrationExpired = eventInfo.registrationEndDate && checkDateExpired(eventInfo.registrationEndDate);
    return {
      props: {
        user,
        eventInfo: {
          ...eventInfo,
          startTime: eventInfo?.startTime ? convertToDayMonthTime(eventInfo?.startTime) : "",
          endTime: eventInfo?.endTime ? convertToDayMonthTime(eventInfo?.endTime) : "",
          registrationEndDate: eventInfo?.registrationEndDate
            ? convertToDayMonthTime(eventInfo?.registrationEndDate)
            : "",
        },
        registrationExpired,
        siteConfig,
      },
    };
  } else {
    return {
      props: {
        user,
        siteConfig,
      },
    };
  }
};
export default EventInfoPage;

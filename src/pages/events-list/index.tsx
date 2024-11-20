import { checkDateExpired, convertToDayMonthTime, generateYearAndDayName, getCookieName } from "@/lib/utils";

import { StateType, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { FC, useEffect } from "react";

import prisma from "@/lib/prisma";
import { IEventList } from "@/services/EventService";
import styles from "@/styles/Marketing/Events/Event.module.scss";

import Events from "@/components/Events/Events";
import Layout2 from "@/components/Layouts/Layout2";

const EventsList: FC<{ user: User; eventList: IEventList[]; totalEventsLength: number }> = ({
  user,
  eventList,
  totalEventsLength,
}) => {
  return (
    <Layout2>
      <div className={styles.events_list_wrapper}>
        <div className={styles.event_header}>
          <h3>Events</h3>
        </div>
        <Events user={user} eventList={eventList} totalEventsLength={totalEventsLength} eventLink="events-list" />
      </div>
    </Layout2>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

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
      },
    };
  } else {
    return {
      props: {
        user,
        eventList: [],
      },
    };
  }
};

export default EventsList;

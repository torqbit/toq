import { useAppContext } from "@/components/ContextApi/AppContext";
import { capsToPascalCase } from "@/lib/utils";
import { EventType, User } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import EventService, { IEventList } from "@/services/EventService";
import EventCard from "@/components/Events/EventCard";
import styles from "@/styles/Marketing/Events/Event.module.scss";
import { Button, Flex, message, Skeleton, Tabs, TabsProps } from "antd";
import { EmptyEvents } from "../SvgIcons";
import { getIconTheme } from "@/services/darkThemeConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { Theme } from "@/types/theme";
import { getDummyArray } from "@/lib/dummyData";
import NoContentFound from "../NoContentFound";

const Events: FC<{
  user: User;
  eventList: IEventList[];
  eventLink: string;
  siteConfig: PageSiteConfig;
}> = ({ user, eventList, eventLink, siteConfig }) => {
  const [eventData, setEventData] = useState<IEventList[]>(eventList);
  const [eventfetchLength, setEventFetchLength] = useState<number>(5);
  const [totalEvents, setTotalEvents] = useState<number>(eventList.length);

  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { dispatch, globalState } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const getEventList = () => {
    setLoading(true);
    EventService.getEvents(
      eventfetchLength,
      eventData.length,
      (result) => {
        let newData = eventData.concat(result.eventList);

        setTimeout(() => {
          setEventData(newData);
          setLoading(false);
        }, 500);
        onChange(selectedTab);

        setEventFetchLength(eventfetchLength + result.eventList.length);
        setTotalEvents(result.totalEventsLength);
      },
      (error) => {
        messageApi.error(error);
        setLoading(false);
      }
    );
  };

  const onChange = (key: string) => {
    setSelectedTab(key);

    switch (key) {
      case EventType.WORKSHOP:
        return setEventData(eventList.filter((ev) => ev.eventType === EventType.WORKSHOP));
      case EventType.TALK:
        return setEventData(eventList.filter((ev) => ev.eventType === EventType.TALK));

      default:
        return setEventData(eventList);
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "all",
      label: "All",
      children: (
        <>
          {eventData.length > 0 ? (
            <Flex vertical gap={20}>
              {eventData.map((event, i) => {
                return (
                  <EventCard
                    eventDetail={event}
                    key={i}
                    eventLink={eventLink}
                    isRegister={event.attended}
                    registrationExpired={event.registrationExpired}
                  />
                );
              })}
              {totalEvents > eventData.length && eventData.length >= 5 && (
                <Flex justify="center" align="center">
                  <Button loading={loading} onClick={getEventList}>
                    Load more
                  </Button>
                </Flex>
              )}
            </Flex>
          ) : (
            <NoContentFound
              content="There are no Events currently.Visit here later again."
              isMobile={isMobile}
              icon={
                <EmptyEvents
                  size={isMobile ? "200px" : "300px"}
                  {...getIconTheme(globalState.theme || "light", siteConfig.brand)}
                />
              }
            />
          )}
        </>
      ),
    },
    {
      key: EventType.WORKSHOP,
      label: capsToPascalCase(EventType.WORKSHOP),
      children: (
        <>
          {eventData.length > 0 ? (
            <Flex vertical gap={20}>
              {eventData.map((event, i) => {
                return (
                  <EventCard
                    eventDetail={event}
                    key={i}
                    eventLink={eventLink}
                    isRegister={event.attended}
                    registrationExpired={event.registrationExpired}
                  />
                );
              })}
              {totalEvents > eventData.length && eventData.length >= 5 && (
                <Flex justify="center" align="center">
                  <Button loading={loading} onClick={getEventList}>
                    Load more
                  </Button>
                </Flex>
              )}
            </Flex>
          ) : (
            <NoContentFound
              content="There are no workshop events currently.Visit here later again."
              isMobile={isMobile}
              icon={
                <EmptyEvents
                  size={isMobile ? "200px" : "300px"}
                  {...getIconTheme(globalState.theme || "light", siteConfig.brand)}
                />
              }
            />
          )}
        </>
      ),
    },
    {
      key: EventType.TALK,
      label: capsToPascalCase(EventType.TALK),
      children: (
        <>
          {eventData.length > 0 ? (
            <Flex vertical gap={20}>
              {eventData.map((event, i) => {
                return (
                  <EventCard
                    eventDetail={event}
                    key={i}
                    eventLink={eventLink}
                    isRegister={event.attended}
                    registrationExpired={event.registrationExpired}
                  />
                );
              })}
              {totalEvents > eventData.length && eventData.length >= 5 && (
                <Flex justify="center" align="center">
                  <Button loading={loading} onClick={getEventList}>
                    Load more
                  </Button>
                </Flex>
              )}
            </Flex>
          ) : (
            <NoContentFound
              content="There are no talk events currently.Visit here later again."
              isMobile={isMobile}
              icon={
                <EmptyEvents
                  size={isMobile ? "200px" : "300px"}
                  {...getIconTheme(globalState.theme || "light", siteConfig.brand)}
                />
              }
            />
          )}
        </>
      ),
    },
  ];
  return (
    <>
      {contextHolder}
      <div className={styles.event_list_wrapper}>
        {eventData.length > 0 && <Tabs items={items} onChange={onChange} />}
        {eventData.length == 0 && (
          <NoContentFound
            content="There are no Events currently.Visit here later again."
            isMobile={isMobile}
            icon={
              <EmptyEvents
                size={isMobile ? "200px" : "300px"}
                {...getIconTheme(globalState.theme || "light", siteConfig.brand)}
              />
            }
          />
        )}
      </div>
    </>
  );
};

export default Events;

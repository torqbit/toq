import { useAppContext } from "@/components/ContextApi/AppContext";
import { capsToPascalCase } from "@/lib/utils";
import { EventType, User } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import EventService, { IEventList } from "@/services/EventService";
import EventCard from "@/components/Events/EventCard";
import styles from "@/styles/Marketing/Events/Event.module.scss";
import { Button, Flex, message, Tabs, TabsProps } from "antd";
import { Theme } from "@/types/theme";

const Events: FC<{ user: User; eventList: IEventList[]; totalEventsLength: number; eventLink: string }> = ({
  user,
  eventList,
  totalEventsLength,
  eventLink,
}) => {
  const [eventData, setEventData] = useState<IEventList[]>(eventList);
  const [eventfetchLength, setEventFetchLength] = useState<number>(5);
  const [totalEvents, setTotalEvents] = useState<number>(totalEventsLength);

  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { dispatch, globalState } = useAppContext();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const noEventExist = (
    <div
      style={{
        height: 400,
        marginBottom: "20px ",
        textAlign: "center",
        borderRadius: 8,
        display: "flex",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: globalState.theme === "dark" ? "#283040" : "#fff",
        color: globalState.theme === "dark" ? "#fff" : "#000",
      }}
    >
      <p
        style={{
          maxWidth: isMobile ? 300 : 400,
          lineHeight: 1.5,
        }}
      >
        There are no events currently. Visit here later again
      </p>
    </div>
  );

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

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
            noEventExist
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
            noEventExist
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
            noEventExist
          )}
        </>
      ),
    },
  ];
  return (
    <>
      {contextHolder}
      <div className={styles.event_list_wrapper}>
        <Tabs items={items} onChange={onChange} />
      </div>
    </>
  );
};

export default Events;

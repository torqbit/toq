import { useAppContext } from "@/components/ContextApi/AppContext";
import appConstant from "@/services/appConstant";
import { User } from "@prisma/client";
import { FC, useEffect } from "react";
import { IEventInfo } from "@/services/EventService";
import styles from "@/styles/Marketing/Events/Event.module.scss";
import { Flex, Space } from "antd";
import Link from "next/link";
import SvgIcons from "@/components/SvgIcons";
import EventTitleCard from "@/components/Events/EventTitleCard";
import PurifyContent from "@/components/PurifyContent/PurifyContent";
import EventRegistrationCard from "@/components/Events/EventRegistrationCard";

const EventInfo: FC<{
  user: User;
  eventInfo: IEventInfo;
  classNames?: string;
  registrationExpired: boolean;
  eventListLink: string;
}> = ({ user, eventInfo, classNames, registrationExpired, eventListLink }) => {
  const {
    globalState: { siteConfig },
  } = useAppContext();
  return (
    <div className={`${styles.event_info_wrapper} ${classNames} `}>
      <Space direction='vertical' className={styles.event_info_space} size={20}>
        <Link href={`/${eventListLink}`}>
          <Flex align='center' gap={10}>
            <i>{SvgIcons.arrowLeft}</i>
            Back to all Events
          </Flex>
        </Link>
        <div className={styles.event_info_content}>
          <Flex vertical gap={20}>
            <EventTitleCard
              title={eventInfo.title}
              organiser={`${siteConfig.brand?.name}`}
              eventType={eventInfo.eventType}
              eventMode={eventInfo.eventMode}
            />

            <h3>Instructions</h3>
            <PurifyContent content={eventInfo.eventInstructions} className={styles.description_content} />

            <h3>Description</h3>
            <PurifyContent content={eventInfo.description} className={styles.description_content} />
          </Flex>

          <Flex vertical gap={20}>
            <EventRegistrationCard
              location={eventInfo.location}
              eventMode={eventInfo.eventMode}
              startTime={eventInfo.startTime}
              endTime={eventInfo.endTime}
              eventId={eventInfo.id}
              registrationExpired={registrationExpired}
              registrationEndDate={eventInfo.registrationEndDate}
              eventLink={eventInfo.eventLink}
              price={eventInfo.price}
            />
          </Flex>
        </div>
      </Space>
    </div>
  );
};

export default EventInfo;

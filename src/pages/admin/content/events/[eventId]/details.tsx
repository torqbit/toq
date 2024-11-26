import React, { FC, useEffect, useState } from "react";
import styles from "@/styles/Dashboard.module.scss";
import { Breadcrumb, Form, Tabs, TabsProps, message } from "antd";

import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import AttendeesList from "@/components/Events/AttendeesList";
import EventService, { IAccessInfo, IAttendessInfo, IEventCertificateInfo } from "@/services/EventService";
import Link from "next/link";
import { getCookieName } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { EventAccess, Role } from "@prisma/client";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

const EventDetailPage: FC<{ eventName: string; siteConfig: PageSiteConfig }> = ({ eventName, siteConfig }) => {
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [activeTab, setActiveTab] = useState<string>("registered");
  const [attendeesList, setAttendessList] = useState<IAttendessInfo[]>([]);
  const [accessLoading, setAccessLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onChange = (key: string) => {
    switch (key) {
      case "attendees":
        return getAttendeesDetails(Number(router.query.eventId));

      default:
        getRegistrationDetails(Number(router.query.eventId));

        return setActiveTab("registered");
    }
  };

  const onMarkAttended = (eventId: number, email: string) => {
    let data = {
      eventId,
      email,
    };
    EventService.markAttended(
      data,
      (result) => {
        messageApi.success(result.message);
        getRegistrationDetails(eventId);
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const handlePermission = (accessInfo: IAccessInfo) => {
    setAccessLoading(true);
    EventService.grantAccess(
      accessInfo,
      (result) => {
        if (result.status === EventAccess.ACCEPTED) {
          messageApi.success(result.message);
        } else {
          messageApi.error(result.message);
        }
        getRegistrationDetails(accessInfo.eventId);
        setOpen(false);
        setAccessLoading(false);
        form.resetFields();
      },
      (error) => {
        messageApi.error(error);
        setOpen(false);
        setAccessLoading(false);
        form.resetFields();
      }
    );
  };

  const generateCertificate = (certificateInfo: IEventCertificateInfo) => {
    setAttendessList((list) =>
      list.map((l) => {
        if (l.email === certificateInfo.email) {
          return {
            ...l,
            certificate: "Generating",
          };
        } else {
          return l;
        }
      })
    );
    EventService.generateEventCertificate(
      certificateInfo,
      (result) => {
        messageApi.success(result.message);
        setAttendessList((list) =>
          list.map((l) => {
            if (l.email === certificateInfo.email) {
              return {
                ...l,
                certificate: "Yes",
              };
            } else {
              return l;
            }
          })
        );
      },
      (error) => {
        messageApi.error(error);
        setAttendessList((list) =>
          list.map((l) => {
            if (l.email === certificateInfo.email) {
              return {
                ...l,
                certificate: "No",
              };
            } else {
              return l;
            }
          })
        );
      }
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "registered",
      label: "Registered",
      children: (
        <AttendeesList
          loading={loading}
          attendeesList={attendeesList}
          onMarkAttended={onMarkAttended}
          generateCertificate={generateCertificate}
          accessLoading={accessLoading}
          openModal={open}
          setOpen={setOpen}
          handlePermission={handlePermission}
          form={form}
        />
      ),
    },
    {
      key: "attendees",
      label: "Attendees",
      children: (
        <AttendeesList
          loading={loading}
          attendeesList={attendeesList}
          generateCertificate={generateCertificate}
          openModal={open}
          setOpen={setOpen}
          accessLoading={accessLoading}
          handlePermission={handlePermission}
          form={form}
        />
      ),
    },
  ];

  const getRegistrationDetails = (eventId: number) => {
    setLoading(true);
    EventService.registrationList(
      eventId,
      (result) => {
        setAttendessList(result.registrationListInfo);
        setLoading(false);
      },
      (error) => {
        messageApi.error(error);
        setLoading(false);
      }
    );
  };

  const getAttendeesDetails = (eventId: number) => {
    setLoading(true);
    EventService.eventAttendeesList(
      eventId,
      (result) => {
        setAttendessList(result.registrationListInfo);
        setActiveTab("attendees");

        setLoading(false);
      },
      (error) => {
        messageApi.error(error);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (router.query.eventId) {
      activeTab !== "attendees" && getRegistrationDetails(Number(router.query.eventId));
    }
  }, [router.query.eventId]);

  return (
    <AppLayout siteConfig={siteConfig}>
      {contextMessageHolder}
      <section className={styles.dashboard_content}>
        <Breadcrumb
          items={[
            {
              title: <Link href={`/admin/content`}>content</Link>,
            },
            {
              title: "Events",
            },
            {
              title: `${eventName}`,
            },
          ]}
        />
        <Tabs
          activeKey={activeTab}
          items={items}
          onChange={(key) => {
            onChange(key);
          }}
        />
      </section>
    </AppLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const { req } = ctx;
    const params = ctx?.params;
    const { site } = getSiteConfig();
    if (params?.eventId && isNaN(Number(params?.eventId))) {
      return {
        props: {
          eventName: "Not found",
        },
      };
    }

    let cookieName = getCookieName();
    const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });
    const eventInfo = await prisma.events.findUnique({
      where: {
        id: Number(params?.eventId),
      },
      select: {
        title: true,
        authorId: true,
      },
    });

    if (eventInfo && (user?.id === eventInfo?.authorId || user?.role === Role.ADMIN)) {
      return {
        props: {
          eventName: eventInfo?.title,
          siteConfig: site,
        },
      };
    } else {
      return {
        redirect: {
          permanent: false,

          destination: "/unauthorized",
        },
      };
    }
  } catch (error) {
    return {
      props: {
        eventName: "Not found",
      },
    };
  }
};

export default EventDetailPage;

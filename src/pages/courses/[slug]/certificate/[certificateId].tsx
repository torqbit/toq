import SvgIcons from "@/components/SvgIcons";
import { getCookieName } from "@/lib/utils";
import { Breadcrumb, Button, Flex, Space } from "antd";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import styles from "@/styles/Certificate.module.scss";
import prisma from "@/lib/prisma";
import AppLayout from "@/components/Layouts/AppLayout";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";

const ShowCertificate: FC<{ siteConfig: PageSiteConfig; courseName: string; userName: string }> = ({
  siteConfig,
  courseName,
  userName,
}) => {
  const router = useRouter();

  return (
    <AppLayout siteConfig={siteConfig}>
      <Space direction="vertical" size={"middle"} className={styles.certificate_page}>
        <div>
          <Breadcrumb
            items={[
              {
                title: <Link href={`/courses`}>Courses</Link>,
              },
              {
                title: `${courseName}`,
              },
              {
                title: "Certificate",
              },
            ]}
          />
        </div>
        <p className={styles.about_description}>
          Torqbit certifies the successful completion of <span>{courseName}</span> by <span>{userName} </span>
        </p>
        <div className={styles.certificate_image}>
          <img src={`/static/course/certificate/${router.query.certificateId}`} alt={userName ?? "Certificate"} />{" "}
          <Button
            onClick={() => {
              router.push(`/courses/${router.query.slug}/certificate/download/${String(router.query.certificateId)}`);
            }}
            type="primary"
            target="_blank"
          >
            <div> Download Certificate </div>
            <i style={{ fontSize: 18, lineHeight: 0 }}> {SvgIcons.arrowRight}</i>
          </Button>
        </div>
      </Space>
    </AppLayout>
  );
};

export default ShowCertificate;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  const { site } = getSiteConfig();
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  if (user && params?.slug && typeof params.slug === "string") {
    const findCourse = await prisma.course.findUnique({
      where: {
        slug: params.slug,
      },
      select: {
        courseId: true,
        name: true,
      },
    });
    if (findCourse) {
      const isCompleted = await prisma?.courseRegistration.findFirst({
        where: {
          studentId: user.id,

          order: {
            productId: Number(findCourse?.courseId),
          },
        },
        select: {
          courseState: true,
        },
      });

      if (isCompleted?.courseState !== "COMPLETED") {
        return {
          redirect: {
            permanent: false,
            message: "you are not enrolled in this course",
            destination: "/unauthorized",
          },
        };
      } else {
        return {
          props: {
            siteConfig: site,
            courseName: findCourse?.name,
            userName: user.name,
          },
        };
      }
    } else {
      return {
        props: {
          siteConfig: site,
        },
      };
    }
  }
  return {
    props: {
      siteConfig: site,
    },
  };
};

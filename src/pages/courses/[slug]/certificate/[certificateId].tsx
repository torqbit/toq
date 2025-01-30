import SvgIcons from "@/components/SvgIcons";
import { getCookieName } from "@/lib/utils";
import { Breadcrumb, Button, Flex, Space, Spin } from "antd";
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
import { getCourseAccessRole } from "@/actions/getCourseAccessRole";
import { Role, User } from "@prisma/client";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { useSession } from "next-auth/react";

const PreviewCertificate: FC<{ courseName: string; userName: string; userRole: Role }> = ({
  userName,
  courseName,
  userRole,
}) => {
  const router = useRouter();
  return (
    <Flex vertical align={userRole == Role.STUDENT ? "center" : undefined} className={styles.certificate_page}>
      <Flex vertical gap={20}>
        <div style={{ justifySelf: "flex-start" }}>
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
          <img src={`/static/course/certificate/${router.query.certificateId}`} alt={userName ?? "Certificate"} />
          {/* <Spin
            spinning={true}
            indicator={<LoadingOutlined spin />}
            style={{ position: "absolute", top: "calc(50% - 40px)", left: "50%" }}
            size="large"
          /> */}
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
      </Flex>
    </Flex>
  );
};

const ShowCertificate: FC<{ siteConfig: PageSiteConfig; courseName: string; userName: string; userRole: Role }> = ({
  siteConfig,
  courseName,
  userName,
  userRole,
}) => {
  const { data: user } = useSession();

  return (
    <>
      {userRole == Role.STUDENT ? (
        <MarketingLayout
          mobileHeroMinHeight={60}
          user={
            userRole
              ? ({
                  id: user?.id,
                  name: user?.user?.name || "",
                  email: user?.user?.email || "",
                  phone: user?.phone || "",
                  role: userRole,
                } as User)
              : undefined
          }
          siteConfig={siteConfig}
        >
          <PreviewCertificate userRole={userRole} courseName={courseName} userName={userName} />
        </MarketingLayout>
      ) : (
        <AppLayout siteConfig={siteConfig}>
          <PreviewCertificate userRole={userRole} courseName={courseName} userName={userName} />
        </AppLayout>
      )}
    </>
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
    const hasAccess = await getCourseAccessRole(user?.role, user?.id, params?.slug, true);
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
      let pId = hasAccess.pathId ? hasAccess.pathId : Number(findCourse.courseId);

      const isCompleted = await prisma?.courseRegistration.findFirst({
        where: {
          studentId: user.id,

          order: {
            productId: pId,
          },
        },
        select: {
          courseState: true,
          certificate: {
            select: {
              productId: true,
            },
          },
        },
      });

      if (!isCompleted?.certificate.find((c) => c.productId === findCourse.courseId)) {
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
            userRole: user.role,
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

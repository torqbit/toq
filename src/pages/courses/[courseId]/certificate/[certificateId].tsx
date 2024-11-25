import SvgIcons from "@/components/SvgIcons";
import { getCookieName } from "@/lib/utils";
import ProgramService from "@/services/ProgramService";
import { Breadcrumb, Button, Flex, Space } from "antd";
import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/Certificate.module.scss";
import prisma from "@/lib/prisma";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import AppLayout from "@/components/Layouts/AppLayout";

const ShowCertificate = () => {
  const [certificateData, setCertificateData] = useState<{ pdfPath: string; imgPath: string; courseName: string }>();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>();
  const [courseName, setCourseName] = useState<string>();
  const router = useRouter();
  const getCertificateImgUrl = () => {};
  useEffect(() => {
    setLoading(true);
    ProgramService.getCertificate(
      String(router.query.certificateId),
      (result) => {
        setCertificateData(result.certificateDetail);
        setCourseName(result.certificateDetail.courseName);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      }
    );
  }, [router.query.courseId]);

  return (
    <AppLayout>
      {loading ? (
        <SpinLoader />
      ) : (
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
            Torqbit certifies the successful completion of <span>{courseName}</span> by{" "}
            <span>{session?.user?.name} </span>
          </p>
          <div className={styles.certificate_image}>
            <img src={String(certificateData?.imgPath)} alt={session?.user?.name ?? "Certificate"} />

            <Button
              type="primary"
              onClick={() => {
                router.push(
                  `/courses/${router.query.courseId}/certificate/download/${String(router.query.certificateId)}`
                );
              }}
            >
              <div> Download Certificate </div>
              <i>{SvgIcons.arrowRight}</i>
            </Button>
          </div>
        </Space>
      )}
    </AppLayout>
  );
};

export default ShowCertificate;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const params = ctx?.params;
  let cookieName = getCookieName();
  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  if (user && params) {
    const isCompleted = await prisma?.courseRegistration.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: Number(params.courseId),
        },
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
    }
  }
  return { props: {} };
};

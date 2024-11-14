import MarketingLayout from "@/components/Layouts/MarketingLayout";
import OfflineHero from "@/components/Marketing/OfflineCourse/OffilineHero";
import { getCookieName } from "@/lib/utils";
import appConstant from "@/services/appConstant";
import { Theme, User } from "@prisma/client";
import { GetServerSidePropsContext, NextPage } from "next";
import { getToken } from "next-auth/jwt";
import { FC, useEffect } from "react";
import AOS from "aos";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { Flex, Space } from "antd";
import Image from "next/image";
import ProgramTitle from "@/components/Marketing/OfflineCourse/ProgramTitle";
import OfflineCoursePreview from "@/components/Marketing/OfflineCourse/OfflineCoursePreview";
import styles from "@/styles/Marketing/OfflineCourse/OfflineCourse.module.scss";
import AboutTrainer from "@/components/Marketing/OfflineCourse/AboutTrainer";
import { IProgramDetails, IstudentStories } from "@/types/courses/offline";
import StudentStories from "@/components/Marketing/OfflineCourse/StudentStories";

const FullStackDevelopmentPage: FC<{ user: User }> = ({ user }) => {
  const { dispatch } = useAppContext();

  const programDetails: IProgramDetails[] = [
    {
      icon: "/img/offline-course/frontend.png",
      title: "Frontend development",
      description:
        "Frontend Development Training Program offers participants a blend of theoretical instruction and hands-on projects, learners will explore core technologies such as HTML, CSS, and JavaScript, along with popular frameworks like React.",
      duration: "3 - 4 months",
      price: 12999,
      courseDetail: [
        {
          banner: "/img/offline-course/html-css.jpeg",
          title: "Build Static Websites",
          description: "Learn to build portfolio websites for creators, educators and professionals.",
          duration: "2 weeks",
        },
        {
          banner: "/img/offline-course/git-github.jpeg",
          title: "Master Git & Github",
          description: "Learn to track changes to a project, work with teams, and contribute to open source.",
          duration: "2 weeks",
        },
        {
          banner: "/img/offline-course/programming-with-js.jpeg",
          title: "Program with Javascript",
          description: "Learn to add interactivity into a website and transform into a dynamic website.",
          duration: "4 weeks",
        },
        {
          banner: "/img/offline-course/react.jpeg",
          title: "ReactJS - UI Framework",
          description: "Learn to create reusable components and build complex UI for enterprises.",
          duration: "4 weeks",
        },
      ],
    },
    {
      icon: "/img/offline-course/backend.png",

      title: "Backend development",
      description:
        "Backend Development Training Program focuses on equipping participants with the skills needed to build robust server-side applications using Node.js, Next.js, and PostgreSQL. This hands-on program covers essential topics such as RESTful API design, database management, authentication, and deployment strategies. ",
      duration: "3 - 4 months",
      price: 12999,
      courseDetail: [
        {
          banner: "/img/offline-course/nodejs.png",
          title: "Build CLI Apps with Node",
          description: "Learn to build command line applications using different Nodejs modules.",
          duration: "3 weeks",
        },
        {
          banner: "/img/offline-course/nextjs.png",
          title: "Build APIs with Next.JS",
          description: "Learn to build RESTful APIs and integrate with ReactJS UI components.",
          duration: "3 weeks",
        },
        {
          banner: "/img/offline-course/postgres.png",
          title: "Store Data in RDBMS",
          description: "Learn to store/fetch data from PostgresDB using SQL, transactions and many more.",
          duration: "4 weeks",
        },
        {
          banner: "/img/offline-course/next-auth.jpeg",
          title: "Secure APIs with NextAuth",
          description: "Learn to add authentication with Google, FB, Github and many more using NextAuth. ",
          duration: "2 weeks",
        },
      ],
    },
    {
      icon: "/img/offline-course/devops.png",

      title: "DevOps & Cloud infrastructure",
      description:
        "In this training program, students will learn to build, deploy, and manage containerized applications in a cloud environment. The curriculum covers essential topics such as container orchestration with Kubernetes, cloud service models, and best practices for scalability and security in AWS.",
      duration: "3 months",
      price: 12999,
      courseDetail: [
        {
          banner: "/img/offline-course/docker-k8s.jpeg",
          title: "Containerize web services",
          description: "Learn to build, deploy, and manage containerized services with Docker and K8s",
          duration: "5 weeks",
        },
        {
          banner: "/img/offline-course/aws-ec2.jpeg",
          title: "Host Services on AWS",
          description: "Learn to host web services on AWS using EC2, RDS, Route53 and many more",
          duration: "7 weeks",
        },
      ],
    },
  ];

  const storiesDetail: IstudentStories[] = [
    {
      name: "Jhone Doe",
      previousImage: "https://placehold.co/60x60",
      transformedImage: "https://placehold.co/60x60",
      qualification: "BCA student",
      placement: "Software engineer",
      qualificationLocation: "NSIT, KOLKATA",
      placementLocation: "HPE, UK",
    },
    {
      name: "Jhone Doe",
      previousImage: "https://placehold.co/60x60",
      transformedImage: "https://placehold.co/60x60",
      qualification: "BCA student",
      placement: "Software engineer",
      qualificationLocation: "NSIT, KOLKATA",
      placementLocation: "HPE, UK",
    },
    {
      name: "Jhone Doe",
      previousImage: "https://placehold.co/60x60",
      transformedImage: "https://placehold.co/60x60",
      qualification: "BCA student",
      placement: "Software engineer",
      qualificationLocation: "NSIT, KOLKATA",
      placementLocation: "HPE, UK",
    },
  ];

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };

  const onCheckTheme = () => {
    const currentTheme = localStorage.getItem("theme");
    if (!currentTheme || currentTheme === "dark") {
      localStorage.setItem("theme", "dark");
    } else if (currentTheme === "light") {
      localStorage.setItem("theme", "light");
    }
    setGlobalTheme(localStorage.getItem("theme") as Theme);

    dispatch({
      type: "SET_LOADER",
      payload: false,
    });
  };

  useEffect(() => {
    AOS.init();
    onCheckTheme();
  }, []);
  return (
    <section className={styles.landing_page_wrapper}>
      <MarketingLayout user={user} heroSection={<OfflineHero />}>
        <section className={styles.fullstack_development_wrapper}>
          <ProgramTitle
            title="Our Classroom Programs"
            description={`Over the course of the program,
                learners will engage in project-based activities,
                 collaborating with peers and instructors to tackle real-world challenges.`}
            icon="/img/offline-course/flower.png"
          />
          <Space direction="vertical" size={10}>
            {programDetails.map((detail, i) => {
              return (
                <OfflineCoursePreview
                  icon={detail.icon}
                  title={detail.title}
                  description={detail.description}
                  duration={detail.duration}
                  price={detail.price}
                  courseDetails={detail.courseDetail}
                  key={i}
                />
              );
            })}
          </Space>
        </section>
        {/* <StudentStories storiesDetail={storiesDetail} /> */}

        <AboutTrainer />
      </MarketingLayout>
    </section>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  let cookieName = getCookieName();

  const user = await getToken({ req, secret: process.env.NEXT_PUBLIC_SECRET, cookieName });

  return { props: { user } };
};
export default FullStackDevelopmentPage;

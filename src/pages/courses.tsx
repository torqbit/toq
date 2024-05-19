import type { GetServerSidePropsContext, NextPage } from "next";
import styles from "@/styles/Dashboard.module.scss";

import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { Course } from "@prisma/client";
import Courses from "@/components/Courses/Courses";
import { getAllCourses } from "@/actions/getCourseById";
import { Spin, message } from "antd";
import Layout2 from "@/components/Layouts/Layout2";
import ProgramService from "@/services/ProgramService";

const CoursesPage: NextPage = () => {
  const [allCourses, setAllCourses] = useState<Course[] | undefined>([]);
  const [messageApi, contextMessageHolder] = message.useMessage();

  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    ProgramService.getCoursesByAuthor(
      (res) => {
        setAllCourses(res.courses);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        messageApi.error(`Unable to get the courses due to ${err}`);
      }
    );
  }, []);
  return (
    <Layout2 className={styles.container}>
      {contextMessageHolder}
      {!loading ? (
        <>
          {allCourses && allCourses.filter((c) => c.state === "ACTIVE").length > 0 ? (
            <Courses allCourses={allCourses.filter((c) => c.state === "ACTIVE")} />
          ) : (
            <>
              <div className={styles.no_course_found}>
                <img src="/img/common/empty.svg" alt="" />
                <h2>No Courses were found</h2>
                <p>Contact support team for more information.</p>
              </div>
            </>
          )}
        </>
      ) : (
        <Spin fullscreen tip="courses loading" />
      )}
    </Layout2>
  );
};

export default CoursesPage;

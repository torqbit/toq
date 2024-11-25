import type { NextPage } from "next";
import styles from "@/styles/Dashboard.module.scss";
import React, { useEffect, useState } from "react";
import { Course } from "@prisma/client";
import Courses from "@/components/Courses/Courses";
import { Spin, message } from "antd";

import ProgramService from "@/services/ProgramService";
import { LoadingOutlined } from "@ant-design/icons";
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import AppLayout from "@/components/Layouts/AppLayout";

const CoursesPage: NextPage = () => {
  const [allCourses, setAllCourses] = useState<Course[] | undefined>([]);
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    ProgramService.getCoursesByAuthor(
      true,
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
    <AppLayout>
      {contextMessageHolder}
      <section>
        <div className={styles.courseContainer}>
          <h3>Courses</h3>
        </div>
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
          <SpinLoader className="course__spinner" />
        )}
      </section>
    </AppLayout>
  );
};

export default CoursesPage;

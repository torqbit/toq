import { NextPage } from "next";
import { EnrolledCourseList } from "./content";
import AppLayoutfrom "@/components/Layouts/Layout2";

const CoursesPage: NextPage = () => {
  return (
    <Layout2>
      <div style={{ padding: "20px 40px 0px 40px" }}>
        <h3>Courses</h3>
        <EnrolledCourseList
          allCourses={[]}
          handleCourseDelete={() => {}}
          handleCourseStatusUpdate={() => {}}
          loading={false}
        />
      </div>
    </Layout2>
  );
};

export default CoursesPage;

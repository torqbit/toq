import { FC } from "react";
import styles from "../Courses/Courses.module.scss";
import courseGrid from "@/components/Courses/CourseListView/CourseListView.module.scss";

import { StateType } from "@prisma/client";

import CourseSkeleton from "../Courses/CourseSkeleton";
import { LearnViewItem } from "@/components/Admin/LearningPath/LearnListView";
import { ILearningPathDetail } from "@/types/learingPath";
import { IBrandConfig } from "@/types/schema";

interface ILearningList {
  previewMode?: boolean;
  title: string;
  description: string;
  brand: IBrandConfig;
  learningList: ILearningPathDetail[];
}
const AcademyItemsList: FC<ILearningList> = ({ title, description, learningList, previewMode }) => {
  return (
    <>
      {learningList.length > 0 && (
        <section className={styles.courses__container}>
          <div>
            <h2>{title}</h2>
            <p style={{ marginBottom: 30 }}>{description}</p>

            {previewMode && learningList.length == 0 && (
              <>
                <CourseSkeleton size={3} />
              </>
            )}
            {learningList.length > 0 && (
              <div className={courseGrid.course__grid}>
                {learningList
                  .filter((c) => c.state === StateType.ACTIVE)
                  .map((c, index) => (
                    <LearnViewItem learning={c} key={index} previewMode={previewMode} />
                  ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default AcademyItemsList;

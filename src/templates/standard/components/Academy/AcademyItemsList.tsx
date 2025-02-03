import { FC } from "react";
import styles from "../Courses/Courses.module.scss";
import courseGrid from "@/components/Courses/CourseListView/CourseListView.module.scss";
import CourseSkeleton from "../Courses/CourseSkeleton";
import { LearnViewItem } from "@/components/Admin/LearningPath/LearnListView";
import { ILearningPathDetail } from "@/types/learingPath";
import { IBrandConfig } from "@/types/schema";
import { Button, Flex } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { useRouter } from "next/router";

interface ILearningList {
  previewMode?: boolean;
  title: string;
  description: string;
  brand: IBrandConfig;
  learningList: ILearningPathDetail[];
}
const AcademyItemsList: FC<ILearningList> = ({ title, description, learningList, previewMode }) => {
  const router = useRouter();
  return (
    <>
      {
        <section className={styles.courses__container}>
          <div>
            <Flex justify="space-between">
              <h2>{title}</h2>
              {learningList.length > 3 && (
                <Button onClick={() => !previewMode && router.push("/academy")} href="/academy" type="link">
                  <Flex align="center" gap={10}>
                    <span>View more</span>
                    <i style={{ fontSize: 18, lineHeight: 0 }}>{SvgIcons.arrowRight}</i>
                  </Flex>
                </Button>
              )}
            </Flex>
            <p className="landingPagePara" style={{ marginBottom: 30 }}>
              {description}
            </p>

            {previewMode && learningList.length == 0 && (
              <>
                <CourseSkeleton size={3} />
              </>
            )}

            {learningList.length > 0 && (
              <div className={courseGrid.course__grid}>
                {learningList.slice(0, 3).map((c, index) => (
                  <LearnViewItem learning={c} key={index} previewMode={previewMode} />
                ))}
              </div>
            )}
          </div>
        </section>
      }
    </>
  );
};

export default AcademyItemsList;

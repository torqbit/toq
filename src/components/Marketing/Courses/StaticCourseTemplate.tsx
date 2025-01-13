import SvgIcons from "@/components/SvgIcons";
import { convertSecToHourandMin } from "@/pages/admin/content";
import styles from "@/styles/Marketing/CoursePreview/CoursePreview.module.scss";
import { Button, Collapse, Divider, Flex, Space, Tag } from "antd";
import { FC, ReactNode, useState } from "react";
import MarketingSvgIcons from "../MarketingSvgIcons";
import { $Enums } from "@prisma/client";
import Image from "next/image";
import { IStaticCourseTemplate } from "@/types/courses/Course";

const LessonItem: FC<{
  title: string;
  time: string;
  keyValue: string;
  resourceId?: number;
  isCompleted?: boolean;
  icon: ReactNode;
}> = ({ title, time, keyValue, icon, isCompleted, resourceId }) => {
  return (
    <div className={styles.labelContainer}>
      <Flex justify="space-between" align="center">
        <div>
          <Flex gap={10} align="center">
            <i style={{ lineHeight: 0, fontSize: 18, color: "var(--font-secondary)" }}>
              {" "}
              {isCompleted ? SvgIcons.check : icon}{" "}
            </i>
            <div>{title}</div>
          </Flex>
        </div>
        <div>
          <Tag className={styles.time_tag}>{time}</Tag>
        </div>
      </Flex>
    </div>
  );
};
const StaticCourseTemplate: FC<{ details: IStaticCourseTemplate }> = ({ details }) => {
  const chapterListDetail = {
    chapters:
      details.chapters &&
      details.chapters.map((chapter) => {
        return {
          chapterSeq: chapter.chapterSeq,
          chapterName: chapter.chapterName,

          lessons: chapter.lessons.map((r) => {
            return {
              title: r.title,
              videoDuration: r.videoDuration,
              lessonId: r.lessonId,
              contentType: r.contentType,
            };
          }),
        };
      }),
  };

  const items = chapterListDetail.chapters.map((content, i) => {
    let totalTime = 0;
    content.lessons.forEach((data) => {
      totalTime = totalTime + data.videoDuration;
    });
    const duration = convertSecToHourandMin(totalTime);
    return {
      key: `${i + 1}`,
      label: <LessonItem title={content.chapterName} icon={SvgIcons.folder} time={duration} keyValue={`${i + 1}`} />,
      children: content.lessons.map((res: any, i: any) => {
        const duration = convertSecToHourandMin(res.videoDuration);
        return (
          <div className={styles.resContainer}>
            <LessonItem
              title={res.title}
              icon={res.contentType === $Enums.ResourceContentType.Video ? SvgIcons.playBtn : SvgIcons.file}
              time={duration}
              isCompleted={res.isWatched}
              resourceId={res.videoId}
              keyValue={`${i + 1}`}
            />
          </div>
        );
      }),
      showArrow: false,
    };
  });
  const [activeCollapseKey, setActiveCollapseKey] = useState<string[]>(items ? items.map((item, i) => `${i + 1}`) : []);

  const courseFeatures = [
    {
      icon: MarketingSvgIcons.info,
      label: "Launching soon ",
    },
    {
      icon: MarketingSvgIcons.courseLevel,
      label: details.difficultyLevel,
    },
    {
      icon: MarketingSvgIcons.megaPhone,
      label: "English",
    },

    {
      icon: MarketingSvgIcons.clock,
      label: "N/A",
    },
    {
      icon: MarketingSvgIcons.certificate,
      label: "Certificate on course completion",
    },
  ];

  const onChange = (key: string | string[]) => {
    setActiveCollapseKey(key as string[]);
  };

  return (
    <section className={styles.coursePreview}>
      <div className={styles.coursePreviewContainer}>
        <div className={styles.courseInfoWrapper}>
          <Space direction="vertical">
            <div>
              <div className={styles.descriptionWrapper}>
                <h2>Description</h2>
                <p>{details.description}</p>
              </div>
            </div>
            {details.chapters.length > 0 && (
              <div className={styles.chapter_list}>
                <h1>Chapters</h1>

                <Collapse
                  onChange={onChange}
                  activeKey={activeCollapseKey}
                  size="small"
                  defaultActiveKey={activeCollapseKey}
                  accordion={false}
                  items={
                    items &&
                    items.map((item) => {
                      return {
                        key: item.key,
                        label: item.label,
                        children: item.children,
                        showArrow: false,
                      };
                    })
                  }
                />
              </div>
            )}
          </Space>

          <div>
            <div className={styles.courseEnrollmentCard}>
              <div className={styles.cardWrapper}>
                <Image src={details.thumbnail} height={375} width={375} alt="" loading="lazy" />
                <div className={styles.cardDetail}>
                  <div>
                    <Flex align="center" justify="space-between">
                      <span>Details</span>

                      <Flex align="center" gap={5}>
                        {SvgIcons.rupees} <span>{details.coursePrice}</span>
                      </Flex>
                    </Flex>
                  </div>
                  <div>
                    {courseFeatures.map((c, i) => {
                      return (
                        <Flex key={i} align="center" gap={10}>
                          <i>{c.icon}</i>
                          <div>{c.label}</div>
                        </Flex>
                      );
                    })}
                  </div>
                </div>
                <Divider />

                <div className={styles.buttonWrapper}>
                  <Button type="primary">Contact Us</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaticCourseTemplate;

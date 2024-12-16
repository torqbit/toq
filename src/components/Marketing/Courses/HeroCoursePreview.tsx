import { Flex, Space } from "antd";
import { FC } from "react";
import styles from "@/styles/Marketing/CoursePreview/CoursePreview.module.scss";
import { UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import { IHeroCoursePreview } from "@/types/courses/Course";

const HeroCoursePreview: FC<IHeroCoursePreview> = ({
  courseName,
  courseTrailer,
  authorName,
  authorImage,
  userRole,
}) => {
  return (
    <div className={`${styles.contentWrapper} ${userRole ? styles.logged__in__content : styles.logged__out__content}`}>
      <div>
        <Flex vertical gap={20} style={{ width: "100%" }}>
          <h1>{courseName}</h1>
          <Flex align="flex-start" gap={10} className={styles.authorInfo}>
            {authorImage ? (
              <Image src={authorImage} alt="" height={50} width={50} loading="lazy" />
            ) : (
              <div className={styles.userOutlineContainer}>
                <UserOutlined height={50} width={50} />
              </div>
            )}
            <Space direction="vertical" size={"small"}>
              <span>A Course by</span>
              <div>{authorName}</div>
            </Space>
          </Flex>
          <div className={styles.videoContainer}>
            {
              <iframe
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  outline: "none",
                  border: "none",
                  borderRadius: "8px",
                }}
                allowFullScreen={true}
                src={String(courseTrailer)}
              ></iframe>
            }
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeroCoursePreview;

import SpinLoader from "@/components/SpinLoader/SpinLoader";
import SvgIcons from "@/components/SvgIcons";

import { convertSecToHourandMin } from "@/pages/admin/content";
import ProgramService from "@/services/ProgramService";
import styles from "@/styles/Preview.module.scss";
import { CourseLessonAPIResponse, ICourseDetailView, VideoLesson } from "@/types/courses/Course";
import { UserOutlined } from "@ant-design/icons";
import { $Enums, CourseState, CourseType, orderStatus, ResourceContentType, Role } from "@prisma/client";
import { Avatar, Breadcrumb, Button, Collapse, Flex, Space, Tag } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

import { FC, ReactNode, useState } from "react";

const Label: FC<{
  title: string;
  time: string;
  keyValue: string;
  resourceId?: number;
  isCompleted?: boolean;
  icon: ReactNode;
  contentType: ResourceContentType;
}> = ({ title, time, keyValue, icon, isCompleted, resourceId, contentType }) => {
  return (
    <div className={styles.labelContainer}>
      <Flex justify="space-between" align="center">
        <div>
          <Flex gap={10} align="center">
            <i>{isCompleted ? SvgIcons.check : icon}</i>
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

const Preview: FC<{
  courseDetail: ICourseDetailView;
  addContentPreview?: boolean;
  videoUrl?: string;

}> = ({
  addContentPreview,
  videoUrl,
  courseDetail,

}) => {
    const router = useRouter();

    return (
      <section className={addContentPreview ? styles.add_preview_container : styles.preview_container}>
        <h4>{courseDetail.name}</h4>
        <p>A course by {courseDetail.author.name}, {courseDetail.author.designation}</p>
        <Flex align="flex-start" justify="flex-start" gap={20}>
          <div>
            <div className={styles.video_container}>
              <Flex className={styles.spin_wrapper} align="center" justify="center">
                <SpinLoader className="preview_loader" />
              </Flex>
              {
                <iframe
                  allowFullScreen
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    outline: "none",
                    border: "none",
                  }}
                  src={videoUrl}
                ></iframe>
              }
            </div>
          </div>
          <div className={styles.course__offerings}>
            {/* component for price display */}
            <div className={styles.item__price} >
              {courseDetail.pricing.amount == 0 && (<><h2>FREE</h2>
                <Button type="primary" style={{ width: 200 }}>Enroll for free</Button>
              </>)}
              {courseDetail.pricing.amount > 0 && (
                <>
                  <Flex gap={15} align="center" justify="center">
                    <div className={styles.pricing__currency}>{courseDetail.pricing.currency}</div>
                    <h2>{courseDetail.pricing.amount}</h2>
                  </Flex>
                  <Button type="primary" size="large" style={{ width: 200 }}>Buy Now</Button>
                </>
              )}
            </div>

            <div className={styles.offering__highlights}>
              <p><b>This course includes</b></p>
              <Flex gap={10}>
                <i>{SvgIcons.playFilled}</i>
                <p>{courseDetail.contentDurationInHrs} hours of content</p>
              </Flex>
              <Flex gap={10}>
                <i>{SvgIcons.bookOpenFilled}</i>
                <p>{courseDetail.assignmentsCount} assignments</p>
              </Flex>
              <Flex gap={10}>
                <i>{SvgIcons.clockFilled}</i>
                <p>{courseDetail.expiryInDays} days of access</p>
              </Flex>
              <Flex gap={10}>
                <i>{SvgIcons.checkBadgeFilled}</i>
                <p>Certificate on completion</p>
              </Flex>
              <Flex gap={10}>
                <i>{SvgIcons.calendarDaysFilled}</i>
                <p>Free access to workshops</p>
              </Flex>
              <Flex gap={10}>
                <i>{SvgIcons.chatBubbleFilled}</i>
                <p>Access to Discussion</p>
              </Flex>
            </div>

            <div className={styles.course__author}>
              <p><b>About Instructor</b></p>
              <Flex gap={10}>
                <Avatar size={60} src={courseDetail.author.imageUrl} icon={<UserOutlined />} alt="Profile" />
                <div>
                  <h4>{courseDetail.author.name}</h4>
                  <p>{courseDetail.author.designation}</p>
                </div>
              </Flex>
            </div>
          </div>
        </Flex>

      </section>
    );
  };

export default Preview;

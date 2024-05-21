import React, { FC, useEffect, useState } from "react";
import styles from "../../../styles/Dashboard.module.scss";
import { Button, Dropdown, Modal, Space, Table, Tabs, TabsProps, Tag, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { useAppContext } from "../../../components/ContextApi/AppContext";
import Layout2 from "@/components/Layouts/Layout2";
import { useSession } from "next-auth/react";
import ProgramService from "@/services/ProgramService";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Course } from "@prisma/client";

export const convertSecToHourandMin = (seconds: number) => {
  // Calculate hours and minutes
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  // Construct the result string
  let result = "";
  if (hours > 0) {
    result += hours + " hr";
    if (hours !== 1) result += "s";
    result += " ";
  }
  if (minutes > 0 || hours === 0) {
    result += minutes + " min";
    if (minutes > 1) result += "s";
  }
  return result;
};

const EnrolledCourseList: FC<{
  allCourses: any[] | undefined;
  handleCourseStatusUpdate: (courseId: number, newState: string) => void;
  handleCourseDelete: (courseId: number) => void;
}> = ({ allCourses, handleCourseStatusUpdate, handleCourseDelete }) => {
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();

  const columns: any = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "AUTHOR",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "STATE",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "DIFFICULTY LEVEL",
      align: "center",

      dataIndex: "difficulty",
      key: "difficulty",
    },

    {
      title: "CONTENT DURATION",
      align: "center",
      dataIndex: "contentDuration",
      key: "key",
    },
    {
      title: "ACTIONS",
      align: "center",
      dataIndex: "actions",
      render: (_: any, courseInfo: any) => (
        <>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit",
                  onClick: () => {
                    router.push(`/admin/content/course/${courseInfo?.key}/edit`);
                  },
                },
                {
                  key: "2",
                  label: courseInfo.state == "DRAFT" ? "Publish" : "Move to Draft",
                  onClick: () => {
                    handleCourseStatusUpdate(Number(courseInfo.key), courseInfo.state == "DRAFT" ? "ACTIVE" : "DRAFT");
                  },
                },
                {
                  key: "3",
                  label: "View Analytics",
                  onClick: () => {
                    router.push(`/admin/content/courses/${courseInfo.key}/analytics`);
                  },
                },
                {
                  key: "4",
                  label: "Delete",
                  onClick: () => {
                    modal.confirm({
                      title: "Are you sure you want to delete the course?",
                      okText: "Yes",
                      cancelText: "No",
                      onOk: () => {
                        handleCourseDelete(Number(courseInfo.key));
                      },
                    });
                  },
                },
              ],
            }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            {SvgIcons.threeDots}
          </Dropdown>
        </>
      ),
      key: "key",
    },
  ];

  const data = allCourses?.map((course) => {
    let totalDuration = 0;
    course.chapters?.forEach((chap: any) => {
      chap.resource?.forEach((r: any) => {
        totalDuration = totalDuration + r.video?.videoDuration;
      });
    });

    let contentDuration = convertSecToHourandMin(totalDuration);

    return {
      key: course.courseId,
      name: course.name,
      author: course.user?.name,
      state: course.state,
      contentDuration: contentDuration,
      difficulty: course.difficultyLevel,
    };
  });

  return (
    <div>
      <Table size="small" className="users_table" columns={columns} dataSource={data} />
      {contextHolder}
    </div>
  );
};

const Content: NextPage = () => {
  const { data: user } = useSession();
  const [modal, contextWrapper] = Modal.useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextMessageHolder] = message.useMessage();

  const [coursesAuthored, setCoursesAuthored] = useState<{
    fetchCourses: boolean;
    courses: Course[] | undefined;
    refresh: boolean;
  }>({
    fetchCourses: false,
    courses: [],
    refresh: false,
  });
  const router = useRouter();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onChange = (key: string) => {};
  const onCourseDelete = (courseId: number) => {
    ProgramService.deleteCourse(
      courseId,
      (res) => {
        if (res.success) {
          setCoursesAuthored({ ...coursesAuthored, fetchCourses: true, refresh: !coursesAuthored.refresh });
          messageApi.success("Course has been deleted");
        } else {
          messageApi.error(`Course deletion failed due to ${res.error}`);
        }
      },
      (err) => {
        messageApi.error(err);
      }
    );
  };

  useEffect(() => {
    ProgramService.getCoursesByAuthor(
      (res) => {
        console.log(res, "result");
        setCoursesAuthored({
          ...coursesAuthored,
          fetchCourses: false,
          courses: res.courses,
        });
      },
      (err) => {
        setCoursesAuthored({ ...coursesAuthored, fetchCourses: false, refresh: !coursesAuthored.refresh });
        messageApi.error(`Unable to get the courses due to ${err}`);
      }
    );
  }, [coursesAuthored.refresh]);

  const onCourseUpdate = (courseId: number, newState: string) => {
    const currCourse = coursesAuthored.courses?.find((c) => c.courseId === courseId);
    if (currCourse && currCourse?.totalResources >= 2 && newState === "ACTIVE") {
      ProgramService.updateCourseState(
        courseId,
        newState,
        (res) => {
          if (res.success) {
            messageApi.success(`Course status has been updated`);
            setCoursesAuthored({ ...coursesAuthored, fetchCourses: true, refresh: !coursesAuthored.refresh });
          } else {
            messageApi.error(`Course status update failed due to ${res.error}`);
          }
        },
        (err) => {
          messageApi.error(`Course status update failed due to ${err}`);
        }
      );
    } else if (currCourse && newState === "DRAFT") {
      ProgramService.updateCourseState(
        courseId,
        newState,
        (res) => {
          if (res.success) {
            messageApi.success(`Course status has been updated`);
            setCoursesAuthored({ ...coursesAuthored, fetchCourses: true, refresh: !coursesAuthored.refresh });
          } else {
            messageApi.error(`Course status update failed due to ${res.error}`);
          }
        },
        (err) => {
          messageApi.error(`Course status update failed due to ${err}`);
        }
      );
    } else {
      messageApi.error("Minimum two published lessons are required to publish the course");
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Courses",
      children: (
        <EnrolledCourseList
          allCourses={coursesAuthored.courses}
          handleCourseDelete={onCourseDelete}
          handleCourseStatusUpdate={onCourseUpdate}
        />
      ),
    },
  ];

  const previousDraft = (id: number) => {
    router.push(`/admin/content/course/${id}/edit`);
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);

    ProgramService.createDraftCourses(
      undefined,
      (result) => {
        router.push(`/admin/content/course/${result.getCourse.courseId}/edit`);
      },
      (error) => {}
    );
  };

  const onCreateDraftCourse = () => {
    showModal();
    if (router.query.id) {
      router.push(`/admin/content/course/${router.query.id}/edit`);
    } else {
      ProgramService.getLatesDraftCourse(
        (result) => {
          if (result.getCourse) {
            modal.confirm({
              title: "Choose from the below options?",
              content: (
                <>
                  <p>You currently have unsaved changes that you had made while creating the course.</p>
                </>
              ),
              footer: (
                <Space>
                  <Button type="primary" onClick={() => previousDraft(result.getCourse.courseId)}>
                    Previous draft course
                  </Button>
                  or
                  <Button onClick={handleOk}>Create a new course</Button>
                </Space>
              ),
            });
          } else {
            handleOk();
          }
        },
        (error) => {}
      );
    }
  };

  return (
    <Layout2>
      {contextMessageHolder}

      <section className={styles.dashboard_content}>
        <h2>Hello {user?.user?.name}</h2>
        <h3>Content</h3>
        <Tabs
          tabBarGutter={60}
          tabBarStyle={{
            borderColor: "gray",
          }}
          tabBarExtraContent={
            <Button
              type="primary"
              onClick={() => {
                onCreateDraftCourse();
              }}
              className={styles.add_user_btn}
            >
              <span>Add Course</span>
              {SvgIcons.arrowRight}
            </Button>
          }
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
        {contextWrapper}
      </section>
    </Layout2>
  );
};

export default Content;

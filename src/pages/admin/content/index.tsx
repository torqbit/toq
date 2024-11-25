import React, { FC, useEffect, useState } from "react";
import styles from "../../../styles/Dashboard.module.scss";
import { Button, Dropdown, Modal, Space, Table, Tabs, TabsProps, Tag, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import Layout2 from "@/components/Layouts/Layout2";
import { useSession } from "next-auth/react";
import ProgramService from "@/services/ProgramService";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { Course } from "@prisma/client";
import BlogList from "@/components/Admin/Content/BlogList";
import BlogService from "@/services/BlogService";
import SubmissionList from "@/components/Assignment/Submissions/SubmissionList";
import EventList from "@/components/Events/EventList";
import EventService from "@/services/EventService";
import { IContentTabType } from "@/types/courses/Course";

export const convertSecToHourandMin = (seconds: number) => {
  let result = "";

  // Calculate hours and minutes
  if (seconds > 0 && seconds < 60) {
    let secondInMin = seconds / 60;
    result = secondInMin.toFixed(1) + " min";
  } else if (seconds > 60) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    // Construct the result string
    if (hours > 0) {
      result += hours + " hr";
      if (hours !== 1) result += "s";
      result += " ";
    }
    if (minutes > 0 || hours === 0) {
      result += minutes + " min";
      if (minutes > 1) result += "s";
    }
  } else {
    result = "0 sec";
  }
  return result;
};

export const EnrolledCourseList: FC<{
  allCourses: any[] | undefined;
  handleCourseStatusUpdate: (courseId: number, newState: string) => void;
  handleCourseDelete: (courseId: number) => void;
  loading?: boolean;
}> = ({ allCourses, handleCourseStatusUpdate, handleCourseDelete, loading }) => {
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
        if (r.video) {
          totalDuration = totalDuration + r.video?.videoDuration;
        } else if (r.assignment) {
          totalDuration = totalDuration + Number(r.assignment?.estimatedDuration) * 60;
        }
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
      <Table size="small" className="users_table" columns={columns} dataSource={data} loading={loading} />
      {contextHolder}
    </div>
  );
};

const Content: NextPage = () => {
  const { data: user } = useSession();
  const [modal, contextWrapper] = Modal.useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Add Course");

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
  const onChange = (key: IContentTabType) => {
    switch (key) {
      case "BLOGS":
        return setActiveTab("Add Blog");
      case "UPDATES":
        return setActiveTab("Add Updates");

      case "SUBMISSIONS":
        return setActiveTab("Submission");
      case "EVENTS":
        return setActiveTab("Add Event");

      default:
        return setActiveTab("Add Course");
    }
  };
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
    setLoading(true);

    ProgramService.getCoursesByAuthor(
      false,
      (res) => {
        setCoursesAuthored({
          ...coursesAuthored,
          fetchCourses: false,
          courses: res.courses,
        });
        setLoading(false);
      },
      (err) => {
        setCoursesAuthored({ ...coursesAuthored, fetchCourses: false });
        messageApi.error(`Unable to get the courses due to ${err}`);
        setLoading(false);
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
      key: "COURSES" as IContentTabType,
      label: "Courses",
      children: (
        <EnrolledCourseList
          allCourses={coursesAuthored.courses}
          handleCourseDelete={onCourseDelete}
          handleCourseStatusUpdate={onCourseUpdate}
          loading={loading}
        />
      ),
    },
    {
      key: "BLOGS" as IContentTabType,
      label: "Blogs",
      children: <BlogList contentType="BLOG" />,
    },
    {
      key: "UPDATES" as IContentTabType,
      label: "Updates",
      children: <BlogList contentType="UPDATE" />,
    },
    {
      key: "SUBMISSIONS" as IContentTabType,
      label: "Submissions",
      children: <SubmissionList />,
    },
    {
      key: "EVENTS" as IContentTabType,
      label: "Events",
      children: <EventList />,
    },
  ];

  const previousDraft = (id: number) => {
    router.push(`/admin/content/course/${id}/edit`);
    setIsModalOpen(false);
  };

  const previousDraftBlog = (id: string) => {
    router.push(`/admin/content/blog/${id}`);
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

  const handleBlogOk = (contentType: string) => {
    setIsModalOpen(false);

    BlogService.createBlog(
      contentType,
      (result) => {
        router.push(`/admin/content/blog/${result.blog.id}`);
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

  const onCreateDraftBlog = (contentType: string) => {
    showModal();
    if (router.query.blogId) {
      router.push(`/admin/content/blog/${router.query.blogId}`);
    } else {
      BlogService.getLatestDraftBlog(
        contentType,
        (result) => {
          if (result.blog) {
            modal.confirm({
              title: "Choose from the below options?",
              content: (
                <>
                  <p>
                    You currently have unsaved changes that you had made while creating the {contentType.toLowerCase()}.
                  </p>
                </>
              ),
              footer: (
                <Space>
                  <Button type="primary" onClick={() => previousDraftBlog(result.blog.id)}>
                    Previous draft {contentType.toLowerCase()}
                  </Button>
                  or
                  <Button onClick={() => handleBlogOk(contentType)}>Create a new {contentType.toLowerCase()}</Button>
                </Space>
              ),
            });
          } else {
            handleBlogOk(contentType);
          }
        },
        (error) => {}
      );
    }
  };

  const handleActionButton = () => {
    switch (activeTab) {
      case "Add Course":
        return onCreateDraftCourse();

      case "Add Blog":
        return onCreateDraftBlog("BLOG");
      case "Add Updates":
        return onCreateDraftBlog("UPDATE");
      case "Add Event":
        return router.push(`/admin/content/events/add`);
    }
  };

  return (
    <Layout2>
      {contextMessageHolder}
      <section className={styles.dashboard_content}>
        <h3>Content</h3>
        <Tabs
          tabBarGutter={60}
          tabBarStyle={{
            borderColor: "gray",
          }}
          tabBarExtraContent={
            <>
              {activeTab !== "Submission" && (
                <Button type="primary" onClick={handleActionButton} className={styles.add_user_btn}>
                  <span>{activeTab}</span>
                  {SvgIcons.arrowRight}
                </Button>
              )}
            </>
          }
          defaultActiveKey={"COURSES" as IContentTabType}
          items={items}
          onChange={(key) => {
            onChange(key as IContentTabType);
          }}
        />
        {contextWrapper}
      </section>
    </Layout2>
  );
};

export default Content;

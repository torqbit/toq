import React, { FC, useEffect, useState } from "react";
import { Button, Dropdown, Flex, Modal, Space, Table, message } from "antd";
import SvgIcons from "@/components/SvgIcons";

import { useRouter } from "next/router";
import BlogService, { latestBlogs } from "@/services/BlogService";
import appConstant from "@/services/appConstant";
import { StateType } from "@prisma/client";

import { getCreatedDate } from "@/services/helper";
import Link from "next/link";

const ContentList: FC<{ contentType: string }> = ({ contentType }) => {
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();
  const [blogData, setBlogData] = useState<latestBlogs[]>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, messageHolder] = message.useMessage();

  const handleBlogStatusUpdate = (id: string, state: StateType) => {
    setLoading(true);
    const data = {
      state,
      blogId: id,
    };
    BlogService.updateState(
      data,
      (result) => {
        messageApi.success(result.message);
        setRefresh(!refresh);
        setLoading(false);
      },
      (error) => {
        messageApi.error(error);

        setLoading(false);
      }
    );
  };
  const handleBlogDelete = (id: string) => {
    setLoading(true);
    BlogService.deleteBlog(
      id,
      (result) => {
        messageApi.success(result.message);
        setRefresh(!refresh);
        setLoading(false);
      },
      (error) => {}
    );
  };
  const columns: any = [
    {
      title: "TITLE",
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
      title: "DATE",
      dataIndex: "date",
      key: "date",
    },

    {
      title: "ACTIONS",
      align: "center",
      dataIndex: "actions",
      render: (_: any, blogInfo: any) => (
        <>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit",
                  onClick: () => {
                    contentType === "BLOG"
                      ? router.push(`/admin/site/content/blogs/edit/${blogInfo?.id}`)
                      : router.push(`/admin/site/content/updates/edit/${blogInfo?.id}`);
                  },
                },
                {
                  key: "2",
                  label: blogInfo.state == "DRAFT" ? "Publish" : "Move to Draft",
                  onClick: () => {
                    if (blogInfo.name === "Untitled") {
                      messageApi.warning(`${contentType === "BLOG" ? "Blog" : "Update"} is not ready to publish`);
                    } else {
                      handleBlogStatusUpdate(String(blogInfo.id), blogInfo.state == "DRAFT" ? "ACTIVE" : "DRAFT");
                    }
                  },
                },

                {
                  key: "3",
                  label: "Delete",
                  onClick: () => {
                    modal.confirm({
                      title: `Are you sure you want to delete the ${contentType.toLowerCase()}?`,
                      okText: "Yes",
                      cancelText: "No",
                      onOk: () => {
                        handleBlogDelete(String(blogInfo.id));
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

  useEffect(() => {
    setLoading(true);

    BlogService.getLatestBlogs(
      contentType,
      5,
      appConstant.defaultPageSize,
      false,
      (result) => {
        setBlogData(result.latestBlogs);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      }
    );
  }, [contentType, refresh]);

  const data = blogData?.map((blog, i) => {
    return {
      key: i + 1,
      name: blog.title,
      author: blog.user?.name,
      state: blog.state,
      id: blog.id,
      date: getCreatedDate(new Date(blog.createdAt).getTime()),
    };
  });

  return (
    <div style={{ width: 1000 }}>
      {messageHolder}
      {contextHolder}

      <Flex align="center" justify="space-between" style={{ marginBottom: "20px" }}>
        <h4 style={{ margin: "0px" }}>{contentType === "BLOG" ? "Blogs list" : "Updates list"} </h4>
        <Link href={`/admin/site/content/${contentType === "BLOG" ? "blogs" : "updates"}/add`}>
          <Button type="primary">
            <Flex align="center" gap={5}>
              Add {contentType === "BLOG" ? "blogs" : "updates"}
              <i style={{ lineHeight: 0, fontSize: 18 }}>{SvgIcons.arrowRight}</i>
            </Flex>
          </Button>
        </Link>
      </Flex>
      <Table size="small" className="users_table" columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default ContentList;

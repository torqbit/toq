import { Button, Flex, message } from "antd";
import { FC, useEffect, useState } from "react";
import ContentList from "../Admin/Content/ContentList";
import ContentForm from "../Admin/Content/ContentForm";
import { useRouter } from "next/router";
import BlogService, { IContentData } from "@/services/BlogService";
import SpinLoader from "../SpinLoader/SpinLoader";
import { StateType } from "@prisma/client";
import SvgIcons from "../SvgIcons";
import Link from "next/link";

const SiteContent: FC<{ activeMenu: string; contentId?: string }> = ({ activeMenu, contentId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [contentData, setContentData] = useState<IContentData>();
  const router = useRouter();
  const getContentData = (id: string) => {
    setLoading(true);
    BlogService.getContentInfo(
      id,
      (result) => {
        setContentData(result.contentData);
        setLoading(false);
      },
      (error) => {
        setLoading(false);

        messageApi.error(error);
      }
    );
  };

  useEffect(() => {
    contentId && getContentData(contentId);
  }, [contentId]);

  return (
    <>
      {contextHolder}
      {loading ? (
        <SpinLoader />
      ) : (
        <Flex vertical gap={10}>
          {!contentId && !router.pathname.endsWith("/add") && (
            <Flex style={{ paddingTop: 5 }} align="center" justify="space-between">
              <h4 style={{ paddingBottom: 5 }}>{activeMenu === "updates" ? "Updates" : "Blogs"}</h4>
              <Link href={`/admin/site/content/${activeMenu}/add`}>
                <Button type="primary">
                  <Flex align="center" gap={5}>
                    Add {activeMenu === "updates" ? "Update" : "Blog"}
                    <i style={{ lineHeight: 0, fontSize: 18, color: "var(--font-primary)" }}>{SvgIcons.arrowRight}</i>
                  </Flex>
                </Button>
              </Link>
            </Flex>
          )}

          {contentId ? (
            <>
              {contentData ? (
                <ContentForm
                  contentType={activeMenu === "updates" ? "UPDATE" : "BLOG"}
                  htmlData={contentData?.htmlData}
                  bannerImage={contentData?.bannerImage}
                  title={contentData?.title}
                  state={contentData?.state}
                  contentId={contentId}
                />
              ) : (
                <div style={{ width: 300, margin: " 100px auto", textAlign: "center" }}>
                  <img src="/img/common/empty.svg" alt="" />
                  <h4>No {activeMenu} were found</h4>
                </div>
              )}
              <></>
            </>
          ) : (
            <>
              {router.pathname.endsWith("/add") ? (
                <ContentForm
                  contentType={activeMenu === "updates" ? "UPDATE" : "BLOG"}
                  htmlData={""}
                  bannerImage={""}
                  title={""}
                  state={StateType.DRAFT}
                  contentId={contentId}
                />
              ) : (
                <ContentList contentType={activeMenu === "updates" ? "UPDATE" : "BLOG"} />
              )}
            </>
          )}
        </Flex>
      )}
    </>
  );
};

export default SiteContent;

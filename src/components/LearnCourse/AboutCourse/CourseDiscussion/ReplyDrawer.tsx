import { Avatar, Drawer, Flex, Skeleton, Space, message } from "antd";
import styles from "@/styles/LearnLecture.module.scss";
import React, { FC, useState, useRef, useEffect } from "react";
import { IComment, IReplyDrawer } from "./CourseDiscussion";
import CommentBox from "./CommentBox";
import QAForm from "./DiscussionForm";
import { UserOutlined } from "@ant-design/icons";
import { useMediaPredicate } from "react-media-hook";
import { Element, scroller } from "react-scroll";
import DiscussionsService from "@/services/DiscussionsService";
import { getDummyArray } from "@/lib/dummyData";
import { useRouter } from "next/router";

const ReplyDrawer: FC<{
  replyDrawer: IReplyDrawer;
  onCloseDrawer: () => void;
  resourceId: number;
  comments: IComment[];
  onUpdateReplyCount: (id: number, method: string) => void;
}> = ({ replyDrawer, onCloseDrawer, resourceId, comments, onUpdateReplyCount }) => {
  const router = useRouter();
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [sltComment, setSltComment] = useState<IComment>();
  const [queryReplies, setQueryReplies] = useState<IComment[]>([]);
  const isMax415Width = useMediaPredicate("(max-width: 435px)");
  const scrollRef = useRef<any>(null);

  const onScollReply = () => {
    if (scrollRef.current) {
      scroller.scrollTo("reply_cmt_drawer", {
        smooth: true,
        containerId: "reply_cmt_list",
        offset: scrollRef.current.scrollHeight,
      });
    }
  };

  useEffect(() => {
    onScollReply();
  }, [listLoading]);

  const getCommentById = async (id: number) => {
    try {
      DiscussionsService.getComment(
        id,
        (result) => {
          setSltComment(result.comment);
        },
        (error) => {
          message.error(error);
        }
      );
    } catch (err) {}
  };

  const getAllReplies = async (cmtId: number) => {
    setListLoading(true);
    DiscussionsService.getAllReplies(
      cmtId,
      (result) => {
        setQueryReplies(result.queryReplies);
        setListLoading(false);
      },
      (error) => {
        message.error(error);
        setListLoading(false);
      }
    );
  };
  const fetchAllReplyComment = () => {
    if (replyDrawer.sltCommentId) {
      getAllReplies(replyDrawer.sltCommentId);
      getCommentById(replyDrawer.sltCommentId);
    }
  };

  const onPostReply = async (
    comment: string,
    setCommentText: (value: string) => void,
    setLoading: (value: boolean) => void
  ) => {
    try {
      setLoading(true);
      DiscussionsService.postReply(
        resourceId,
        String(router.query.slug),
        comment.replace(/(<p><br><\/p>)+$/, ""),
        Number(sltComment?.id),
        (result) => {
          message.success(result.message);

          setQueryReplies([...queryReplies, result.comment]);
          onUpdateReplyCount(Number(sltComment?.id), "");

          setCommentText("");
          setLoading(false);
          onScollReply();
        },
        (error) => {
          message.error(error);
          setLoading(false);
        }
      );
    } catch (error) {}
  };

  React.useEffect(() => {
    fetchAllReplyComment();
  }, [replyDrawer.sltCommentId]);

  useEffect(() => {
    if (router.query.threadId) {
      replyDrawer.isOpen = true;
      replyDrawer.sltCommentId = Number(router.query.threadId);
      setSltComment(comments.find((cm) => cm.id === Number(router.query.threadId)));
    }
  }, [router.query.threadId]);
  return (
    <Element name="reply_cmt_drawer">
      <Drawer
        title={
          <Skeleton avatar title={false} loading={listLoading} active>
            <Space align="center">
              <Avatar
                size={40}
                src={sltComment?.user?.image}
                icon={<UserOutlined rev={undefined} />}
                className={styles.user_icon}
                alt="Profile"
              />
              <h3 style={{ marginBottom: 0 }}>{sltComment?.user?.name}</h3>
            </Space>
          </Skeleton>
        }
        width={isMax415Width ? "100%" : 500}
        className={styles.reply_drawer}
        classNames={{ header: styles.headerWrapper, body: styles.bodyWrapper, footer: styles.footerWrapper }}
        placement="right"
        onClose={onCloseDrawer}
        open={replyDrawer.isOpen}
        footer={
          <QAForm placeholder="Reply" reply={true} editorBorderRadius={8} loadingPage={false} onPost={onPostReply} />
        }
      >
        <div id="reply_cmt_list" ref={scrollRef}>
          <section className={styles.list_reply_cmt} id="list_reply_cmt">
            {listLoading ? (
              <Flex vertical gap={10} className={styles.comment_box}>
                {getDummyArray(8).map((n) => {
                  return <Skeleton avatar title={false} loading={true} active></Skeleton>;
                })}
              </Flex>
            ) : (
              queryReplies.map((comment, i) => {
                return (
                  <CommentBox
                    listLoading={listLoading}
                    replyList={true}
                    showReplyDrawer={() => {}}
                    resourceId={resourceId}
                    comment={comment}
                    parentCommentId={replyDrawer.sltCommentId}
                    key={i}
                    comments={queryReplies}
                    setAllComment={setQueryReplies}
                    onUpdateReplyCount={onUpdateReplyCount}
                  />
                );
              })
            )}
          </section>
        </div>
      </Drawer>
    </Element>
  );
};

export default ReplyDrawer;

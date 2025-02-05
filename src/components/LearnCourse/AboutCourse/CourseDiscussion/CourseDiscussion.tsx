import React, { FC, useState } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import { Button, Divider, Flex, message, Spin } from "antd";
import { Discussion } from "@prisma/client";
import QAForm from "./DiscussionForm";
import CommentBox from "./CommentBox";
import ReplyDrawer from "./ReplyDrawer";
import { useRouter } from "next/router";
import DiscussionsService from "@/services/DiscussionsService";
import appConstant from "@/services/appConstant";

import { LoadingOutlined } from "@ant-design/icons";

export interface IComment extends Discussion {
  comment: string;
  user: {
    email: string;
    name: string;
    image: string;
  };
  id: number;
  createdAt: Date;
  replyCount: number;
}

export interface IReplyDrawer {
  isOpen: boolean;
  sltCommentId?: number;
}

const QADiscssionTab: FC<{ resourceId?: number; loading: boolean }> = ({
  resourceId,

  loading,
}) => {
  const router = useRouter();
  const query = router.query;
  const [comments, setComments] = useState<IComment[]>([]);
  const [pageSize, setPageSize] = useState<number>(appConstant.defaultPageSize);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [replyDrawer, setReplyDrawer] = useState<IReplyDrawer>({
    isOpen: false,
  });

  const showReplyDrawer = (comment: IComment) => {
    setReplyDrawer({
      isOpen: true,
      sltCommentId: comment.id,
    });
  };

  const onCloseDrawer = () => {
    setReplyDrawer({ isOpen: false, sltCommentId: undefined });
  };
  const getDiscussion = () => {
    setListLoading(true);
    DiscussionsService.getComment(
      Number(router.query.queryId),
      (result) => {
        setComments([result.comment]);
        setCommentCount(1);
        setListLoading(false);
      },
      (error) => {
        message.error(error);
        setListLoading(false);
      }
    );
  };

  const getDiscussions = async (pageSize: number) => {
    setListLoading(true);

    DiscussionsService.getCommentsList(
      Number(resourceId),
      pageSize,
      (result) => {
        setComments(result.comments);
        setCommentCount(result.total);
        setTimeout(() => {
          setListLoading(false);
        }, 500);
      },
      (error) => {
        message.error(error);
      }
    );
  };

  const fetchAllDiscussion = () => {
    if (resourceId) {
      if (router.query.queryId && router.query.tab) {
        getDiscussion();
      } else {
        getDiscussions(pageSize);
      }
    }
  };

  const onUpdateReplyCount = (id: number, method: string) => {
    const newReplyCount = comments.map((cm) => {
      if (cm.id === id) {
        return {
          ...cm,
          replyCount: method === "delete" ? cm.replyCount - 1 : cm.replyCount + 1,
        };
      } else {
        return cm;
      }
    });
    setComments(newReplyCount);
  };

  React.useEffect(() => {
    if (resourceId) {
      setPageSize(appConstant.defaultPageSize);
      fetchAllDiscussion();
    }
  }, [resourceId]);

  React.useEffect(() => {
    if (query.comment) {
      setReplyDrawer({
        sltCommentId: Number(query.comment),
        isOpen: true,
      });
    }
  }, [query.notifi, query.comment]);

  const onClickMore = () => {
    if (commentCount > pageSize) {
      const newPageSize = pageSize + appConstant.defaultPageSize;
      setPageSize(newPageSize);
      getDiscussions(newPageSize);
    }
  };
  const onQueryPost = async (
    comment: string,
    setCommentText: (value: string) => void,
    setLoading: (value: boolean) => void
  ) => {
    try {
      setLoading(true);
      DiscussionsService.postQuery(
        Number(resourceId),
        String(router.query.slug),
        comment.replace(/(<p><br><\/p>)+$/, ""),
        (result) => {
          message.success(result.message);
          let data = result.comment;
          let newComment = {
            ...data,
            comment: data.comment,
            id: data.id,
            user: data.user,
            createdAt: data.createdAt,
            replyCount: 0,
          };
          setComments([newComment, ...comments]);
          setCommentCount(commentCount + 1);
          setCommentText("");
          setLoading(false);
        },
        (error) => {
          message.error(error);
          setLoading(false);
        }
      );
    } catch (error) {}
  };

  return (
    <section className={styles.qa_discussion_tab}>
      <QAForm loadingPage={loading} editorBorderRadius={8} placeholder="Ask a Question" onPost={onQueryPost} />

      <Spin spinning={listLoading} indicator={<LoadingOutlined spin />} size="small">
        {comments.map((comment, i) => {
          return (
            <CommentBox
              resourceId={Number(resourceId)}
              showReplyDrawer={showReplyDrawer}
              comment={comment}
              key={i}
              listLoading={listLoading}
              replyList={false}
              comments={comments}
              setAllComment={setComments}
              onUpdateReplyCount={onUpdateReplyCount}
              setCommentCount={setCommentCount}
              commentCount={commentCount}
            />
          );
        })}
      </Spin>

      {router.query.queryId && (
        <Flex align="center" justify="flex-end">
          <Button
            type="primary"
            loading={listLoading}
            onClick={() => {
              setPageSize(3);
              getDiscussions(pageSize);
              router.push(`/courses/${router.query.slug}/lesson/${router.query.lessonId}`);
            }}
          >
            Load all
          </Button>
        </Flex>
      )}

      <ReplyDrawer
        replyDrawer={replyDrawer}
        resourceId={Number(resourceId)}
        onCloseDrawer={onCloseDrawer}
        comments={comments}
        onUpdateReplyCount={onUpdateReplyCount}
      />
      {commentCount !== comments.length && comments.length > 0 && commentCount > 5 && !listLoading && (
        <Divider>
          <Button type="text" loading={listLoading} className={styles.load_more_comment} onClick={onClickMore}>
            Load More
          </Button>
        </Divider>
      )}
    </section>
  );
};

export default QADiscssionTab;

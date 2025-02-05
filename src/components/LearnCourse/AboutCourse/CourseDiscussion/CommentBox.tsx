import React, { FC, useState } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Flex,
  Input,
  Modal,
  Space,
  Spin,
  Tooltip,
  Upload,
  UploadProps,
  message,
} from "antd";
import { UserOutlined, CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import moment from "moment";
import { IComment } from "./CourseDiscussion";
import { customFromNow } from "@/services/momentConfig";
import DiscussionsService from "@/services/DiscussionsService";
import NotificationService from "@/services/NotificationService";
import SvgIcons from "@/components/SvgIcons";
import { countAlphabets, getBase64, replaceEmptyParagraphs } from "@/lib/utils";
import PurifyContent from "@/components/PurifyContent/PurifyContent";
import TextEditor from "@/components/Editor/Quilljs/Editor";

moment.locale("en", { ...customFromNow });

const CommentBox: FC<{
  resourceId: number;
  parentCommentId?: number;
  comment: IComment;
  replyList: boolean;
  showReplyDrawer: (cmt: IComment) => void;
  reFreshReplyCommnet?: boolean;
  comments?: IComment[];
  setAllComment: (comments: IComment[]) => void;
  onUpdateReplyCount: (id: number, method: string) => void;
  setCommentCount?: (count: number) => void;
  commentCount?: number;
  listLoading: boolean;
}> = ({
  comment,
  listLoading,
  replyList,
  resourceId,
  parentCommentId,
  showReplyDrawer,
  comments,
  setAllComment,
  onUpdateReplyCount,
  setCommentCount,
  commentCount,
}) => {
  const { data: session } = useSession();
  const [isEdited, setEdited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isReply, setReply] = useState<{ open: boolean; id: number }>({ open: false, id: 0 });
  const [editComment, setEditComment] = useState<string>("");
  const [activeModal, setModal] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [activeHover, setActiveHover] = useState<string>("");

  const onDeleteComment = async (commentId: number) => {
    DiscussionsService.deleteComment(
      commentId,
      (result) => {
        message.success(result.message);
        const commentLeft = comments?.filter((c) => c.id !== commentId);
        commentLeft && setAllComment(commentLeft);
        const parentCommentId = comments?.find((c) => c.id === commentId)?.parentCommentId;
        replyList && onUpdateReplyCount(Number(parentCommentId), "delete");
        !replyList && commentCount && setCommentCount && setCommentCount(commentCount - 1);
        setModal(false);
      },
      (error) => {
        message.error(error);
      }
    );
  };

  const onUpdateMultipleNotificatons = () => {
    session?.id &&
      NotificationService.updateMultipleNotification(
        comment.id,
        (result) => {},
        (error) => {}
      );
  };

  const onEditComment = async () => {
    if (!editComment || comment.comment.trim() == editComment.trim()) {
      setEdited(false);
      return;
    }
    setLoading(true);
    DiscussionsService.updateComment(
      comment.id,
      editComment,
      (result) => {
        comment.comment = editComment;
        message.success(result.message);
        setEditComment(result.comment.comment);
        setEdited(false);
      },
      (error) => {
        message.error(error);
      }
    );

    setLoading(false);
  };

  const handleChange: UploadProps["onChange"] = async (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      let fileSizeInMb = (Number(info.file.size) / (1024 * 1024)).toFixed(2);
      if (Number(fileSizeInMb) > 1) {
        messageApi.warning("Image should not exceed 1mb");
      } else {
        const file = info.file.originFileObj;
        const base64string = await getBase64(file);

        setEditComment(editComment + `<img src="${base64string}" alt="Base64 Image"/>`);
      }
    }
  };

  const insertCodeBlock = () => {
    const codeBlock = `<pre><code></code></pre>`;

    const updatedHtml = `${editComment}${codeBlock}`;
    setEditComment(updatedHtml);
  };

  return (
    <>
      {contextHolder}
      <div className={styles.comment_box} key={comment.id} id={`comment_${comment.id}`}>
        <Avatar
          size={40}
          src={comment.user?.image}
          icon={<UserOutlined />}
          className={styles.user_icon}
          alt="Profile"
        />

        <div className={styles.comment}>
          <Flex align="center" gap={5} className={styles.user_info}>
            <h4>{comment.user.name}</h4>
            <p className="dot">•</p>
            <h5 className={styles.comment_time}>
              {moment(new Date(comment.createdAt), "YYYY-MM-DDThh:mm:ss").fromNow()}
            </h5>
          </Flex>

          <div
            className={isEdited ? `${replyList ? styles.reply_comment_wrapper : styles.editted_comment_wrapper}` : ""}
          >
            <div className={`${styles.comment_body} comment-card-body`}>
              {session?.user?.email === comment.user.email && (
                <>
                  {isEdited ? (
                    <CloseOutlined
                      className={isEdited ? styles.editActionDropdown : styles.actionDropdown}
                      onClick={() => setEdited(false)}
                    />
                  ) : (
                    <Dropdown
                      trigger={["click"]}
                      className={styles.actionDropdown}
                      menu={{
                        items: [
                          {
                            key: "1",
                            label: "Edit",
                            onClick: () => {
                              setEdited(true);
                              setEditComment(comment.comment);
                            },
                          },
                          {
                            key: "2",

                            label: <div onClick={() => setModal(true)}>Delete</div>,
                          },
                        ],
                      }}
                      placement="bottomRight"
                      arrow={{ pointAtCenter: true }}
                    >
                      {SvgIcons.threeDots}
                    </Dropdown>
                  )}
                </>
              )}
              <div className={`${styles.comment_content} `}>
                {isEdited ? (
                  <div className={`${styles.qa_form_input} "text_editor_wrapper"`}>
                    <Spin spinning={loading} indicator={<LoadingOutlined spin />}>
                      <TextEditor
                        defaultValue={editComment}
                        handleDefaultValue={setEditComment}
                        readOnly={false}
                        borderRadius={8}
                        theme="bubble"
                        placeholder={"Edit Post"}
                      />
                    </Spin>
                  </div>
                ) : (
                  <div className={styles.comment_text_wrapper}>
                    <PurifyContent className="comment_viewer" content={comment.comment} />
                  </div>
                )}
              </div>
            </div>
            {!replyList && (
              <div className={styles.comment_footer}>
                <div className={styles.reply_btn}>
                  {isEdited ? (
                    <Flex align="center" justify="flex-end">
                      <Flex align="center" gap={5} className={styles.editorActionWrapper}>
                        <Tooltip title="Upload Image">
                          <Upload
                            name="avatar"
                            listType="text"
                            className="upload_editor_image"
                            showUploadList={false}
                            onChange={handleChange}
                          >
                            <i onMouseOver={() => setActiveHover("image")} onMouseLeave={() => setActiveHover("")}>
                              {" "}
                              {activeHover === "image" ? SvgIcons.camera : SvgIcons.cameraOutlined}
                            </i>
                          </Upload>
                        </Tooltip>
                        <Tooltip title="Add Code">
                          <span className={styles.code_btn} onClick={insertCodeBlock}>
                            <i onMouseOver={() => setActiveHover("code")} onMouseLeave={() => setActiveHover("")}>
                              {" "}
                              {activeHover === "code" ? SvgIcons.code : SvgIcons.CodeOutlined}
                            </i>
                          </span>
                        </Tooltip>
                      </Flex>
                      <Divider type="vertical" className={styles.action_divider} />
                      <Tooltip title="Save">
                        <i
                          onMouseOver={() => setActiveHover("send")}
                          onMouseLeave={() => setActiveHover("")}
                          onClick={onEditComment}
                        >
                          {activeHover === "send" ? SvgIcons.send : SvgIcons.sendOutlined}
                        </i>
                      </Tooltip>
                    </Flex>
                  ) : (
                    <Space align="center">
                      {
                        <span
                          onClick={() => {
                            onUpdateMultipleNotificatons();
                            showReplyDrawer(comment);
                          }}
                        >
                          {comment.replyCount === 0 && "Reply"}
                          {isReply.open ? (
                            "Cancel"
                          ) : (
                            <span>
                              {comment.replyCount > 0 && (
                                <span>
                                  {" "}
                                  {comment.replyCount === 1
                                    ? `${comment.replyCount} Reply`
                                    : `${comment.replyCount} Replies`}
                                </span>
                              )}
                            </span>
                          )}
                        </span>
                      }
                    </Space>
                  )}
                </div>
              </div>
            )}
            {replyList && isEdited && (
              <div className={styles.reply_edit_container}>
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={5} className={styles.editorActionWrapper}>
                    <Tooltip title="Upload Image">
                      <Upload
                        className="upload_editor_image"
                        name="avatar"
                        listType="text"
                        showUploadList={false}
                        onChange={handleChange}
                      >
                        <i onMouseOver={() => setActiveHover("image")} onMouseLeave={() => setActiveHover("")}>
                          {" "}
                          {activeHover === "image" ? SvgIcons.camera : SvgIcons.cameraOutlined}
                        </i>
                      </Upload>
                    </Tooltip>
                    <Tooltip title="Add Code" className={styles.code_icon}>
                      <span className={styles.code_btn} onClick={insertCodeBlock}>
                        <i onMouseOver={() => setActiveHover("code")} onMouseLeave={() => setActiveHover("")}>
                          {" "}
                          {activeHover === "code" ? SvgIcons.code : SvgIcons.CodeOutlined}
                        </i>
                      </span>
                    </Tooltip>
                  </Flex>
                  <Divider type="vertical" className={styles.action_divider} />

                  <Tooltip title="Save">
                    <i
                      style={{ height: 18 }}
                      onMouseOver={() => setActiveHover("send")}
                      onMouseLeave={() => setActiveHover("")}
                      onClick={onEditComment}
                    >
                      {activeHover === "send" ? SvgIcons.send : SvgIcons.sendOutlined}
                    </i>
                  </Tooltip>
                </Flex>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        okType="danger"
        okText={replyList ? "Delete Reply" : "Delete Post"}
        destroyOnClose
        onOk={() => onDeleteComment(comment.id)}
        onCancel={() => setModal(false)}
        open={activeModal}
        title={`Delete the ${replyList ? "Reply" : "Post"}`}
      >
        <p>Are you sure you want to delete this {replyList ? "reply" : "post"}?</p>
      </Modal>
    </>
  );
};

export default CommentBox;

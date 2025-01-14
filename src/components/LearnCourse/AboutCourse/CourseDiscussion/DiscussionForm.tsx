import { Button, Divider, Flex, Skeleton, Spin, Tooltip, Upload, UploadProps } from "antd";
import React, { FC, useState } from "react";
import styles from "@/styles/LearnLecture.module.scss";
import { message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import { countAlphabets, getBase64, replaceEmptyParagraphs } from "@/lib/utils";
import TextEditor from "@/components/Editor/Quilljs/Editor";

import { LoadingOutlined } from "@ant-design/icons";

const QAForm: FC<{
  loadingPage: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  reply?: boolean;
  editorBorderRadius?: number;

  onPost: (comment: string, setCommentText: (value: string) => void, setLoading: (value: boolean) => void) => void;
}> = ({ loadingPage, placeholder = "Ask a Question", reply, style, editorBorderRadius, onPost }) => {
  const [commentText, setCommentText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [activeHover, setActiveHover] = useState<string>("");

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

        setCommentText(commentText + `<img src="${base64string}" alt="Base64 Image"/>`);
      }
    }
  };

  const insertCodeBlock = () => {
    const codeBlock = `<pre><code></code></pre>`;

    const updatedHtml = `${commentText}${codeBlock}`;
    setCommentText(updatedHtml);
  };

  return (
    <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
      <Flex
        align="flex-end"
        wrap="wrap"
        gap={0}
        justify="flex-end"
        className={`${styles.qa_form} text_editor_wrapper`}
        style={style}
      >
        {contextHolder}

        {loadingPage ? (
          <Skeleton.Input style={{ height: 80, width: 890 }} />
        ) : (
          <div className={styles.qa_form_input}>
            <TextEditor
              defaultValue={commentText}
              handleDefaultValue={setCommentText}
              readOnly={false}
              theme="bubble"
              borderRadius={editorBorderRadius}
              placeholder={placeholder}
            />
          </div>
        )}
        <div style={{ height: 43 }}>
          {loadingPage ? (
            <Skeleton.Input style={{ width: 890 }} />
          ) : (
            <div className={`${styles.actionButtonWrapper} action_button_wrappper`}>
              <Flex align="center" gap={5} style={{ height: 18 }}>
                <Tooltip title="Upload Image">
                  <Upload
                    name="avatar"
                    listType="text"
                    className="upload_editor_image"
                    showUploadList={false}
                    onChange={handleChange}
                  >
                    <i
                      style={{ fontSize: 18 }}
                      onMouseOver={() => setActiveHover("image")}
                      onMouseLeave={() => setActiveHover("")}
                    >
                      {activeHover === "image" ? SvgIcons.camera : SvgIcons.cameraOutlined}
                    </i>
                  </Upload>
                </Tooltip>
                <Tooltip title="Add Code">
                  <i
                    style={{ fontSize: 18 }}
                    onClick={insertCodeBlock}
                    onMouseOver={() => setActiveHover("code")}
                    onMouseLeave={() => setActiveHover("")}
                  >
                    {activeHover === "code" ? SvgIcons.code : SvgIcons.CodeOutlined}
                  </i>
                </Tooltip>
              </Flex>
              <Flex align="center" gap={0}>
                <Divider type="vertical" className={styles.action_divider} />
                <Tooltip title={placeholder === "Reply" ? "Reply" : "Post"}>
                  <i
                    style={{ fontSize: 18 }}
                    onMouseOver={() => setActiveHover("send")}
                    onMouseLeave={() => setActiveHover("")}
                    onClick={() => {
                      countAlphabets(replaceEmptyParagraphs(commentText)) === 0
                        ? message.warning("add a comment first")
                        : onPost(commentText, setCommentText, setLoading);
                    }}
                    title="Post"
                  >
                    {activeHover === "send" ? SvgIcons.send : SvgIcons.sendOutlined}
                  </i>
                </Tooltip>
              </Flex>
            </div>
          )}
        </div>
      </Flex>
    </Spin>
  );
};

export default QAForm;

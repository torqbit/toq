import { FC, useState } from "react";
import styles from "@/styles/Marketing/Blog/Blog.module.scss";
import { Button, Dropdown, Flex, Form, Input, Popconfirm, Tooltip, Upload, UploadProps, message } from "antd";
import ImgCrop from "antd-img-crop";
import { LoadingOutlined } from "@ant-design/icons";
import SvgIcons from "@/components/SvgIcons";
import { createSlug, getBase64 } from "@/lib/utils";

import BlogService from "@/services/BlogService";
import { useRouter } from "next/router";
import { StateType } from "@prisma/client";
import TextEditor from "@/components/Editor/Quilljs/Editor";
import DOMPurify from "isomorphic-dompurify";
const BlogForm: FC<{
  htmlData: string;
  bannerImage: string;
  title: string;
  state: StateType;
  contentType: string;
}> = ({ htmlData, title, bannerImage, state, contentType }) => {
  const [blogBanner, setBlogBanner] = useState<string>(bannerImage);
  const [blogTitle, setBlogTitle] = useState<string>(title);
  const [editorValue, setEditorValue] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const [file, setFile] = useState<File>();
  const [form] = Form.useForm();

  const router = useRouter();
  const [currentState, setCurrentState] = useState<StateType>(state);

  const [blogBannerUploading, setBlogBannerUploading] = useState<boolean>(false);
  const [loader, setLoader] = useState<{ discard: boolean; publish: boolean }>({
    discard: false,
    publish: false,
  });

  const handleEditorValue = (value: string) => {
    setEditorValue(value);
  };

  const uploadFile = async (file: any, title: string) => {
    if (file) {
      setBlogBannerUploading(true);
      const base64 = await getBase64(file);
      setBlogBanner(base64 as string);
      setFile(file);
      setBlogBannerUploading(false);
    }
  };
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      // setLoading(false);
    }
  };

  const onPostBlog = (state: StateType, exit?: boolean) => {
    if (blogTitle === "Untitled") {
      messageApi.warning("Title is missing");
      return;
    }
    setLoader({ ...loader, publish: true });
    const data = {
      title: blogTitle,
      content: DOMPurify.sanitize(editorValue),
      state,
      banner: bannerImage,
      contentType,
      blogId: String(router.query.blogId),
    };
    const formData = new FormData();
    formData.append("blog", JSON.stringify(data));
    file && formData.append("file", file);
    BlogService.updateBlog(
      formData,
      (result) => {
        messageApi.success(result.message);
        setCurrentState(result.blog.state);
        setLoader({ ...loader, publish: false });
        if (exit) {
          router.push("/admin/content");
        }
      },
      (error) => {
        messageApi.error(error);
        setLoader({ ...loader, publish: false });
      }
    );
  };

  const onDelete = () => {
    setLoader({ ...loader, discard: true });

    BlogService.deleteBlog(
      String(router.query.blogId),
      (result) => {
        messageApi.success(result.message);
        router.push("/admin/content");
        setLoader({ ...loader, discard: false });
      },
      (error) => {
        messageApi.error(error);
        setLoader({ ...loader, discard: false });
      }
    );
  };

  return (
    <section className={styles.blogFormConatiner}>
      <Form form={form}>
        {contextHolder}

        <Flex className={styles.publishBtn} align="center" gap={10}>
          <Popconfirm
            title={`Delete the ${contentType.toLowerCase()}`}
            description={`Are you sure to delete this ${contentType.toLowerCase()}?`}
            onConfirm={() => onDelete()}
            okText="Yes"
            cancelText="No"
          >
            <Button loading={loader.discard}>Discard</Button>
          </Popconfirm>

          <Dropdown.Button
            loading={loader.publish}
            type="primary"
            onClick={() => {
              currentState === "DRAFT" ? onPostBlog("ACTIVE") : onPostBlog("DRAFT");
            }}
            icon={SvgIcons.chevronDown}
            menu={{
              items: [
                {
                  key: 1,

                  label: currentState === "DRAFT" ? "Save and exit" : "Publish ",
                  onClick: () => {
                    currentState === "DRAFT" ? onPostBlog("DRAFT", true) : onPostBlog("ACTIVE", true);
                  },
                },
              ],
            }}
          >
            {currentState === "DRAFT" ? "  Publish " : "Save as Draft"}
          </Dropdown.Button>
        </Flex>
        <div className={styles.formContainer}>
          <Form.Item name="title">
            <Input
              onChange={(e) => setBlogTitle(e.target.value)}
              defaultValue={blogTitle}
              placeholder={`Set the title of the ${contentType}`}
            />
          </Form.Item>
          <div className={styles.video_container}>
            <ImgCrop rotationSlider aspect={16 / 9}>
              <Upload
                name="avatar"
                listType="picture-card"
                className={styles.upload__thumbnail}
                showUploadList={false}
                style={{ width: 800, height: 400 }}
                beforeUpload={(file) => {
                  const bannerName = createSlug(title);
                  uploadFile(file, `${bannerName}_blog_banner`);
                }}
                onChange={handleChange}
              >
                {blogBanner ? (
                  <>
                    <img style={{ borderRadius: 4, objectFit: "cover" }} src={blogBanner} />
                    <Tooltip title={`Upload ${contentType.toLowerCase()} banner`}>
                      <div className={styles.camera_btn_img}>
                        {blogBannerUploading && blogBanner ? <LoadingOutlined /> : SvgIcons.camera}
                      </div>
                    </Tooltip>
                    <div className={styles.bannerStatus}>{blogBannerUploading && "Uploading"}</div>
                  </>
                ) : (
                  <button
                    className={styles.upload_img_button}
                    style={{ border: 0, background: "none", width: 800, height: 400 }}
                    type="button"
                  >
                    {blogBannerUploading ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                    {!blogBannerUploading ? (
                      <div style={{ marginTop: 8 }}>Upload banner</div>
                    ) : (
                      <div style={{ color: "#000" }}>{blogBannerUploading && "Uploading"}</div>
                    )}
                  </button>
                )}
              </Upload>
            </ImgCrop>
          </div>
        </div>
        <div className={styles.editorContainer}>
          <TextEditor
            defaultValue={editorValue ? editorValue : htmlData}
            handleDefaultValue={handleEditorValue}
            readOnly={false}
            width={800}
            height={400}
            theme="snow"
            placeholder={`Start writing your ${contentType.toLowerCase()}`}
          />
        </div>
      </Form>
    </section>
  );
};

export default BlogForm;

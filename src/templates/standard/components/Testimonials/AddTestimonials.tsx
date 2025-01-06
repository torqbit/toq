import SvgIcons from "@/components/SvgIcons";
import { ITestimonialItems } from "@/types/landing/testimonial";
import { Button, Flex, Form, Input, message } from "antd";
import { FC, useState } from "react";
import styles from "./Testimonials.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import TestimonialsForm from "./TetimonialsForm";
import TestimonialList from "./TestimonialsList";
import { postWithFile } from "@/services/request";

import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import ConfigForm from "@/components/Configuration/ConfigForm";

const AddTestimonial: FC<{ siteConfig: PageSiteConfig; setConfig: (value: PageSiteConfig) => void }> = ({
  siteConfig,
  setConfig,
}) => {
  const [testimonialList, setTestimonialList] = useState<ITestimonialItems[]>(
    siteConfig.sections?.testimonials?.items || []
  );
  const [messageApi, contentHolder] = message.useMessage();
  const [addMore, setAddMore] = useState<boolean>();
  const [isEdit, setEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [basicForm] = Form.useForm();

  const updateSiteConfig = (testimonialItems: ITestimonialItems[]) => {
    siteConfig.sections?.testimonials &&
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          testimonials: {
            ...siteConfig.sections?.testimonials,
            items: testimonialItems,
          },
        },
      });
  };

  const onSave = async () => {
    const image = await beforeUpload(form.getFieldsValue().profile, form.getFieldsValue().name);
    if (testimonialList.length > 0) {
      setTestimonialList([
        ...testimonialList,
        {
          description: form.getFieldsValue().description,
          author: {
            name: form.getFieldsValue().name,
            img: image ? image : form.getFieldsValue().profile,

            designation: form.getFieldsValue().designation,
          },
        },
      ]);

      updateSiteConfig([
        ...testimonialList,
        {
          description: form.getFieldsValue().description,
          author: {
            name: form.getFieldsValue().name,
            img: image ? image : form.getFieldsValue().profile,

            designation: form.getFieldsValue().designation,
          },
        },
      ]);
    } else {
      setTestimonialList([
        {
          description: form.getFieldsValue().description,
          author: {
            name: form.getFieldsValue().name,
            img: image ? image : form.getFieldsValue().profile,

            designation: form.getFieldsValue().designation,
          },
        },
      ]);

      updateSiteConfig([
        {
          description: form.getFieldsValue().description,
          author: {
            name: form.getFieldsValue().name,
            img: image ? image : form.getFieldsValue().profile,
            designation: form.getFieldsValue().designation,
          },
        },
      ]);
    }

    form.resetFields();
    setAddMore(false);
  };

  const beforeUpload = async (base64: string, authorName: string): Promise<string | undefined> => {
    try {
      if (base64) {
        const imgName = `testimonial-${authorName}.png`;
        const formData = new FormData();
        formData.append("imgName", imgName);
        formData.append("previousPath", "");
        formData.append("imageType", "profile");
        formData.append("base64Img", base64);

        const postRes = await postWithFile(formData, `/api/v1/admin/site/image/save`);
        if (!postRes.ok) {
          throw new Error("Failed to upload file");
        }
        const res = await postRes.json();
        if (res.success) {
          return `/static/${res.imgName}`;
        }
      }
    } catch (error) {
      message.error(`Error uploading file: `);
    }
  };

  const onUpdate = async (
    description: string,
    designation: string,
    authorName: string,
    authorImage: string,
    index: number
  ) => {
    const imgPath = authorImage.includes("base64") ? await beforeUpload(authorImage, authorName) : authorImage;
    setTestimonialList((prevItems) => {
      const updatedItems = [...prevItems];
      if (index >= 0 && index < updatedItems.length) {
        updatedItems[index] = {
          description,
          author: { name: authorName, img: imgPath || authorImage, designation },
        };
      }
      updateSiteConfig(updatedItems);

      return updatedItems;
    });
  };

  const onDelete = (index: number) => {
    setTestimonialList((prevItems) => {
      let updatedList = prevItems.filter((_, i) => i !== index);
      updateSiteConfig(updatedList);
      return updatedList;
    });
  };

  const onSaveBasicInfo = () => {
    siteConfig.sections?.testimonials &&
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          testimonials: {
            ...siteConfig.sections?.testimonials,
            title: basicForm.getFieldsValue().title,
            description: basicForm.getFieldsValue().description,
          },
        },
      });
    messageApi.success("Basic info has been updated");
  };

  return (
    <section className={styles.add__testimonial}>
      {contentHolder}
      <ConfigFormLayout
        isCollapsible
        formTitle="Basic info"
        extraContent={
          <Button onClick={() => basicForm.submit()} type="primary">
            {!basicForm.getFieldsValue().title || !basicForm.getFieldsValue().description ? "Save" : "Update"}
          </Button>
        }
      >
        <Form
          form={basicForm}
          initialValues={{
            title: siteConfig.sections?.testimonials?.title,
            description: siteConfig.sections?.testimonials?.description,
          }}
          onFinish={onSaveBasicInfo}
        >
          <Flex vertical gap={10}>
            <ConfigForm
              input={
                <Form.Item
                  style={{ width: 300 }}
                  name={"title"}
                  rules={[{ required: true, message: "Title is required" }]}
                >
                  <Input placeholder="Title for the testimonials" />
                </Form.Item>
              }
              title={"Title"}
              description={"Add a title for the testimonials "}
              divider={true}
            />
            <ConfigForm
              layout="vertical"
              input={
                <Form.Item name={"description"} rules={[{ required: true, message: "Description is required" }]}>
                  <Input.TextArea rows={3} placeholder="Description for the testimonials" />
                </Form.Item>
              }
              title={"Description"}
              description={"Add a description for the testimonials "}
              divider={false}
            />
          </Flex>
        </Form>
      </ConfigFormLayout>

      {testimonialList.length > 0 && (
        <Flex vertical>
          <TestimonialList
            onUpdate={onUpdate}
            onDelete={onDelete}
            testimonialList={testimonialList}
            isEdit={isEdit}
            setEdit={setEdit}
          />
          {!addMore && (
            <Button
              onClick={() => setAddMore(true)}
              className={styles.add__more__btn}
              style={{ width: "fit-content", marginTop: 5 }}
              type="link"
            >
              <Flex align="center">
                <i>{SvgIcons.plusBtn}</i>
                Add more
              </Flex>
            </Button>
          )}
        </Flex>
      )}
      {(addMore || testimonialList.length === 0) && (
        <div>
          <ConfigFormLayout
            extraContent={
              <Flex align="center" gap={10}>
                {testimonialList.length > 0 && (
                  <Button
                    onClick={() => {
                      setAddMore(false);
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={() => {
                    form.submit();
                  }}
                  type="primary"
                >
                  save
                </Button>
              </Flex>
            }
            formTitle={"Add Testimonial"}
          >
            <TestimonialsForm handleTestimonial={onSave} form={form} />
          </ConfigFormLayout>
        </div>
      )}
    </section>
  );
};

export default AddTestimonial;

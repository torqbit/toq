import ConfigForm from "@/components/Configuration/ConfigForm";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import { Button, Flex, Form, Input, Tooltip, Upload } from "antd";
import { FC, useEffect, useState } from "react";
import styles from "./Testimonials.module.scss";

import { ITestimonialForm } from "@/types/landing/testimonial";
import { RcFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64, getExtension } from "@/lib/utils";

const TestimonialsForm: FC<ITestimonialForm> = ({ handleTestimonial, form, index, edit }) => {
  const [profile, setProfile] = useState<string>(form.getFieldsValue().profile);

  const onUpload = async (file: RcFile) => {
    if (file) {
      const base64 = await getBase64(file);
      setProfile(base64 as string);
      form.setFieldValue("profile", base64);
    }
  };

  useEffect(() => {
    edit && setProfile(form.getFieldsValue().profile);
  }, [edit]);
  return (
    <section className={styles.tesimoinal__form__container}>
      <Form key={index} onFinish={handleTestimonial} form={form} requiredMark={false}>
        <Flex vertical gap={15}>
          <ConfigForm
            input={
              <Form.Item name={"profile"} rules={[{ required: true, message: "Profile is required" }]}>
                <Tooltip title="Upload profile">
                  <Upload showUploadList={false} maxCount={1} beforeUpload={(file: RcFile) => onUpload(file)}>
                    {!profile ? (
                      <Button icon={<UploadOutlined />} style={{ width: 100, height: 100 }}></Button>
                    ) : (
                      <img
                        src={`${profile}`}
                        height={100}
                        width={100}
                        alt="image"
                        style={{ cursor: "pointer", border: "1px solid var(--border-color)" }}
                      />
                    )}
                  </Upload>
                </Tooltip>
              </Form.Item>
            }
            title={"Profile"}
            description={"Upload profile "}
            divider={true}
          />
          <div>
            <ConfigForm
              input={
                <Form.Item name={"name"} rules={[{ required: true, message: "Name is required" }]}>
                  {<Input style={{ width: 350 }} placeholder={"Enter author name"} />}
                </Form.Item>
              }
              title={"Name"}
              description={"Enter author  name "}
              divider={true}
            />
          </div>
          <div>
            <ConfigForm
              input={
                <Form.Item name={"designation"} rules={[{ required: true, message: "Designation is required" }]}>
                  {<Input style={{ width: 350 }} placeholder={"Enter your designation"} />}
                </Form.Item>
              }
              title={"Designation"}
              description={"Add your designation "}
              divider={true}
            />
          </div>
          <ConfigForm
            layout="vertical"
            input={
              <Form.Item
                noStyle
                style={{ width: "100%" }}
                name={"description"}
                rules={[{ required: true, message: "Description is required" }]}
              >
                <Input.TextArea maxLength={200} rows={3} placeholder="Description for the testimonials" />
              </Form.Item>
            }
            title={"Description"}
            description={"Describe fot the testimonials "}
            divider={false}
          />
        </Flex>
      </Form>
    </section>
  );
};

export default TestimonialsForm;

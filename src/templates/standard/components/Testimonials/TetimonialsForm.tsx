import ConfigForm from "@/components/Configuration/ConfigForm";

import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import { Button, Drawer, Flex, Form, Input, Tooltip, Upload } from "antd";

import { FC, useEffect, useState } from "react";
import styles from "./Testimonials.module.scss";

import { ITestimonialForm } from "@/types/landing/testimonial";
import { RcFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "@/lib/utils";

const TestimonialsForm: FC<ITestimonialForm> = ({ handleTestimonial, form, index, edit, onClose, open }) => {
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
    <Drawer
      open={open}
      width={600}
      closeIcon={true}
      onClose={onClose}
      title={edit ? "Update Testimonial" : "Add Testimonial"}
      classNames={{ header: styles.drawer__header, footer: styles.drawer__footer }}
      footer={
        <Flex align="center" gap={10}>
          <Button
            onClick={() => {
              form.submit();
            }}
            type="primary"
          >
            {edit ? "Update" : "Save"}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Flex>
      }
      children={
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
                    <Input.TextArea
                      showCount
                      maxLength={200}
                      rows={3}
                      placeholder="The course have really brought transformation ... "
                    />
                  </Form.Item>
                }
                title={"Write the testimonial"}
                description={"Description of your experience with our product or service."}
                divider={false}
              />
            </Flex>
          </Form>
        </section>
      }
    />
  );
};

export default TestimonialsForm;

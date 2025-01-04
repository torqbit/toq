import ConfigForm from "@/components/Configuration/ConfigForm";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import { Form, Input } from "antd";
import { FC } from "react";
import styles from "./Testimonials.module.scss";

import { ITestimonialForm } from "@/types/landing/testimonial";

const TestimonialsForm: FC<ITestimonialForm> = ({ handleTestimonial, extra, form, title }) => {
  return (
    <section className={styles.tesimoinal__form__container}>
      <ConfigFormLayout formTitle={title} extraContent={extra}>
        <Form onFinish={handleTestimonial} form={form} requiredMark={false}>
          <div style={{ margin: "10px 0px" }}>
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
                <Input.TextArea rows={3} placeholder="Description for the question" />
              </Form.Item>
            }
            title={"Description"}
            description={"Describe about the question asked by the students "}
            divider={false}
          />
        </Form>
      </ConfigFormLayout>
    </section>
  );
};

export default TestimonialsForm;

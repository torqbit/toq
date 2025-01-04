import SvgIcons from "@/components/SvgIcons";
import { Button, Collapse, Flex, Form, Input, Popconfirm } from "antd";
import { FC, useEffect, useState } from "react";
import styles from "./Testimonials.module.scss";
import { ITestimonialItems } from "@/types/landing/testimonial";
import TestimonialsForm from "./TetimonialsForm";
import ConfigForm from "@/components/Configuration/ConfigForm";

const TestimonialList: FC<{
  onUpdate: (description: string, designation: string, index: number) => void;
  onDelete: (index: number) => void;
  testimonialList: ITestimonialItems[];
  isEdit: boolean;
  setEdit: (value: boolean) => void;
}> = ({ onUpdate, onDelete, testimonialList, isEdit, setEdit }) => {
  const [activeIndex, setActiveIndex] = useState<number>();

  const [form] = Form.useForm();
  const handleTestimonial = () => {
    typeof activeIndex === "number" &&
      onUpdate(form.getFieldsValue().description, form.getFieldsValue().designation, activeIndex);
    form.resetFields();
    setEdit(false);
  };

  return (
    <section className={styles.testimonial__list__container}>
      <Collapse accordion style={{ borderRadius: 4 }} collapsible={"header"}>
        {testimonialList.map((testimonial, i) => {
          return (
            <Collapse.Panel
              header={
                isEdit && activeIndex === i ? (
                  <h4 style={{ margin: 0 }}>Update Testimonial</h4>
                ) : (
                  <Flex align="center" gap={10}>
                    <img src={testimonial.author.img} alt="author image" />
                    <div className={styles.edit__pipe}></div>
                    <p>{testimonial.author.designation}</p>
                  </Flex>
                )
              }
              key={i}
              extra={
                isEdit && activeIndex === i ? (
                  <Flex align="center" gap={10}>
                    <i onClick={() => setEdit(false)}>{SvgIcons.xMark}</i>
                    <Button type="primary" onClick={() => form.submit()}>
                      Update
                    </Button>
                  </Flex>
                ) : (
                  <Flex align="center" gap={10}>
                    <Popconfirm
                      title={`Delete this testimonial`}
                      description={`Are you sure to delete this testimonial?`}
                      onConfirm={() => onDelete(i)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <i>{SvgIcons.delete}</i>
                    </Popconfirm>
                    <div className={styles.edit__pipe}></div>
                    <i
                      onClick={() => {
                        setEdit(true);
                        setActiveIndex(i);
                        form.setFieldValue("designation", testimonial.author.designation);
                        form.setFieldValue("description", testimonial.description);
                      }}
                    >
                      {SvgIcons.boxEdit}
                    </i>
                  </Flex>
                )
              }
              showArrow={false}
            >
              {isEdit && activeIndex === i ? (
                <Form onFinish={handleTestimonial} key={i} form={form} requiredMark={false}>
                  <div style={{ margin: "0px 0px 10px 0px" }}>
                    <ConfigForm
                      input={
                        <Form.Item
                          name={"designation"}
                          rules={[{ required: true, message: "Designation is required" }]}
                        >
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
                        <Input.TextArea style={{ marginTop: 10 }} rows={3} placeholder="Description for the question" />
                      </Form.Item>
                    }
                    title={"Description"}
                    description={"Describe about the question asked by the students "}
                    divider={false}
                  />
                </Form>
              ) : (
                <p>{testimonial.description}</p>
              )}
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </section>
  );
};

export default TestimonialList;

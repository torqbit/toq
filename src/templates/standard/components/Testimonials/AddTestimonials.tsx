import SvgIcons from "@/components/SvgIcons";
import { ITestimonialItems } from "@/types/landing/testimonial";
import { Button, Flex, Form } from "antd";
import { FC, useState } from "react";
import styles from "./Testimonials.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import { useSession } from "next-auth/react";
import TestimonialsForm from "./TetimonialsForm";
import TestimonialList from "./TestimonialsList";

const AddTestimonial: FC<{ siteConfig: PageSiteConfig; setConfig: (value: PageSiteConfig) => void }> = ({
  siteConfig,
  setConfig,
}) => {
  const [testimonialList, setTestimonialList] = useState<ITestimonialItems[]>(
    siteConfig.sections?.testimonials?.items || []
  );
  const [addMore, setAddMore] = useState<boolean>();
  const [isEdit, setEdit] = useState<boolean>(false);
  const { data: user } = useSession();
  const [form] = Form.useForm();
  const onSave = () => {
    if (testimonialList.length > 0) {
      setTestimonialList([
        ...testimonialList,
        {
          description: form.getFieldsValue().description,
          author: {
            name: String(user?.user?.name),
            img: String(user?.user?.image),
            designation: form.getFieldsValue().designation,
          },
        },
      ]);
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          testimonials: {
            ...siteConfig.sections?.testimonials,
            items: [
              ...testimonialList,
              {
                description: form.getFieldsValue().description,
                author: {
                  name: String(user?.user?.name),
                  img: String(user?.user?.image),
                  designation: form.getFieldsValue().designation,
                },
              },
            ],
          },
        },
      });
    } else {
      setTestimonialList([
        {
          description: form.getFieldsValue().description,
          author: {
            name: String(user?.user?.name),
            img: String(user?.user?.image),
            designation: form.getFieldsValue().designation,
          },
        },
      ]);
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          testimonials: {
            ...siteConfig.sections?.testimonials,
            items: [
              {
                description: form.getFieldsValue().description,
                author: {
                  name: String(user?.user?.name),
                  img: String(user?.user?.image),
                  designation: form.getFieldsValue().designation,
                },
              },
            ],
          },
        },
      });
    }

    form.resetFields();
    setAddMore(false);
  };

  const onUpdate = (description: string, designation: string, index: number) => {
    console.log(description, designation, index);
    setTestimonialList((prevItems) => {
      const updatedItems = [...prevItems];
      if (index >= 0 && index < updatedItems.length) {
        updatedItems[index] = {
          description,
          author: { name: String(user?.user?.name), img: String(user?.user?.image), designation },
        };
      }
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          testimonials: {
            ...siteConfig.sections?.testimonials,

            items: updatedItems,
          },
        },
      });
      return updatedItems;
    });
  };

  const onDelete = (index: number) => {
    setTestimonialList((prevItems) => {
      let updatedList = prevItems.filter((_, i) => i !== index);
      setConfig({
        ...siteConfig,
        sections: {
          ...siteConfig.sections,
          testimonials: {
            ...siteConfig.sections?.testimonials,

            items: updatedList,
          },
        },
      });
      return updatedList;
    });
  };

  return (
    <section className={styles.add__testimonial}>
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
          <TestimonialsForm
            handleTestimonial={onSave}
            extra={
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
            title={"Add Testimonial"}
            authorName={user?.user?.name || "user"}
            authorImg={user?.user?.image || ""}
            form={form}
          />
        </div>
      )}
    </section>
  );
};

export default AddTestimonial;

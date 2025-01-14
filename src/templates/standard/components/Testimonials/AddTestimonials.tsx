import SvgIcons from "@/components/SvgIcons";
import { ITestimonialItems } from "@/types/landing/testimonial";
import { Button, CollapseProps, Flex, Form, Input, message, Popconfirm } from "antd";
import { FC, useState } from "react";
import styles from "./Testimonials.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import TestimonialsForm from "./TetimonialsForm";
import { postWithFile } from "@/services/request";

import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import ConfigForm from "@/components/Configuration/ConfigForm";
import { createSlug } from "@/lib/utils";
import FAQList from "../FAQ/FAQList";
import UserInfo from "@/components/UserInfo/UserInfo";
import BasicInfoForm from "@/components/SiteBuilder/sections/BasicInfoForm/BasicInfoForm";

const AddTestimonial: FC<{ siteConfig: PageSiteConfig; setConfig: (value: PageSiteConfig) => void }> = ({
  siteConfig,
  setConfig,
}) => {
  const [testimonialList, setTestimonialList] = useState<ITestimonialItems[]>(
    siteConfig.sections?.testimonials?.items || []
  );
  const [messageApi, contentHolder] = message.useMessage();
  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [basicForm] = Form.useForm();
  const [activeIndex, setActiveIndex] = useState<number>();

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
    setOpen(false);
  };

  const beforeUpload = async (base64: string, authorName: string): Promise<string | undefined> => {
    try {
      if (base64) {
        const imgName = `testimonial-${createSlug(authorName)}.png`;
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

  const handleTestimonial = () => {
    typeof activeIndex === "number" &&
      onUpdate(
        form.getFieldsValue().description,
        form.getFieldsValue().designation,
        form.getFieldsValue().name,
        form.getFieldsValue().profile,
        activeIndex
      );
    form.resetFields();
    setOpen(false);
    setEdit(false);
  };

  const onDelete = (index: number) => {
    setTestimonialList((prevItems) => {
      let updatedList = prevItems.filter((_, i) => i !== index);
      updateSiteConfig(updatedList);
      return updatedList;
    });
  };

  const handleEdit = (index: number) => {
    setOpen(true);
    setEdit(true);
    setActiveIndex(index);
    form.setFieldsValue({
      designation: testimonialList[index].author.designation,
      description: testimonialList[index].description,
      profile: testimonialList[index].author.img,
      name: testimonialList[index].author.name,
    });
  };

  const items: CollapseProps["items"] = testimonialList.map((testimonial, i) => {
    return {
      key: i,
      label: (
        <UserInfo
          image={testimonial.author.img}
          name={testimonial.author.name}
          extraInfo={testimonial.author.designation}
        />
      ),
      showArrow: false,
      children: <p>{testimonial.description}</p>,
      extra: (
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
              handleEdit(i);
            }}
          >
            {SvgIcons.boxEdit}
          </i>
        </Flex>
      ),
    };
  });

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setEdit(false);
  };
  return (
    <section className={styles.add__testimonial}>
      {contentHolder}

      {testimonialList.length > 0 ? (
        <Flex vertical className={styles.testimonial__list__container}>
          <FAQList listItems={items} isEditable={true} />

          <Button
            onClick={() => {
              setEdit(false);
              setOpen(true);
            }}
            className={styles.add__more__btn}
            style={{ width: "fit-content", marginTop: 5 }}
            type="link"
          >
            <Flex align="center">
              <i style={{ fontSize: 18, lineHeight: 0 }}>{SvgIcons.plusBtn}</i>
              Add more
            </Flex>
          </Button>
        </Flex>
      ) : (
        <Flex vertical align="center" justify="center" gap={20} style={{ marginBottom: 20 }}>
          <img src="/img/common/empty.svg" alt="" />

          <h4>No testimonials exist </h4>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
              setEdit(false);
              form.resetFields();
            }}
          >
            Add Tesimonials
          </Button>
        </Flex>
      )}

      <TestimonialsForm
        open={open}
        handleTestimonial={() => {
          isEdit ? handleTestimonial() : onSave();
        }}
        form={form}
        edit={isEdit}
        onClose={onClose}
      />
    </section>
  );
};

export default AddTestimonial;

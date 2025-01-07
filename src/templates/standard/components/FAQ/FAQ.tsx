import { FC } from "react";
import styles from "./FAQ.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import FAQList from "./FAQList";
import { CollapseProps, Flex, Popconfirm, Skeleton } from "antd";
import { getDummyArray } from "@/lib/dummyData";

const FAQ: FC<{
  siteConfig: PageSiteConfig;
  previewMode?: boolean;
  faqList: { question: string; answer: string }[];
}> = ({ siteConfig, previewMode, faqList }) => {
  const items: CollapseProps["items"] =
    faqList && faqList.length > 0
      ? faqList.map((faq, i) => {
          return {
            key: i,

            label: <h4 style={{ margin: 0 }}> {faq.question}</h4>,
            children: <p>{faq.answer}</p>,
            showArrow: true,
          };
        })
      : getDummyArray(3).map((item, i) => {
          return {
            key: i,

            label: <Skeleton.Input size="small" style={{ width: "50vw" }} />,
            children: <Skeleton paragraph />,
            showArrow: true,
          };
        });

  return (
    <section id="faq">
      {((faqList && faqList.length > 0) || previewMode) && (
        <section className={styles.faq__container}>
          <h1>FAQ</h1>
          <p>Frequently asked questions by the students</p>

          <FAQList listItems={items} isEditable={false} expandIcon />
        </section>
      )}
    </section>
  );
};

export default FAQ;

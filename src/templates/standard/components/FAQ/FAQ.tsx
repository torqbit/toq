import { FC } from "react";
import styles from "./FAQ.module.scss";
import { PageSiteConfig } from "@/services/siteConstant";
import FAQList from "./FAQList";

const FAQ: FC<{ siteConfig: PageSiteConfig; faqList: { question: string; answer: string }[] }> = ({
  siteConfig,
  faqList,
}) => {
  return (
    <>
      {faqList.length > 0 && (
        <section className={styles.faq__container}>
          <h1>FAQ</h1>
          <p>Frequently asked questions by the students</p>
          <FAQList faqList={faqList} isEditable={false} onUpdate={() => {}} onDelete={() => {}} showIcon />
        </section>
      )}
    </>
  );
};

export default FAQ;

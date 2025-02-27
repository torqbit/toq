import { Collapse, CollapseProps } from "antd";
import React, { FC } from "react";

import styles from "./FAQ.module.scss";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

const FAQList: FC<{
  listItems: CollapseProps["items"];
  isEditable?: boolean;

  expandIcon?: boolean;
}> = ({ isEditable, listItems, expandIcon }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  return (
    <section className={isEditable ? styles.faq__form__container : styles.faq__list__container}>
      <Collapse
        accordion
        style={{ borderRadius: 4, width: isMobile ? "80vw" : 1000 }}
        collapsible={expandIcon ? "icon" : "header"}
        expandIconPosition="end"
        expandIcon={({ isActive }) =>
          isActive ? <MinusCircleOutlined style={{ fontSize: 20 }} /> : <PlusCircleOutlined style={{ fontSize: 20 }} />
        }
        items={listItems}
      />
    </section>
  );
};

export default FAQList;

import { Flex, Space } from "antd";
import styles from "@/styles/Marketing/LegalAgreement/LegalAgreement.module.scss";

import { FC, ReactNode } from "react";

interface IProps {
  content: { label?: string; title: string; description: string[] | ReactNode[]; id?: string }[];
  isMobile: boolean;
  titleDescription?: ReactNode;
}

const LegalAgreement: FC<IProps> = ({ content, titleDescription, isMobile }) => {
  return (
    <div className={titleDescription ? styles.privacyPolicyWrapper : styles.termAndCondionWrapper}>
      <div className={styles.termAndCondionContent}>
        {titleDescription && titleDescription}
        <div>
          {content.map((list, i) => {
            return (
              <Space key={i} direction="vertical" id={list.id}>
                <Flex align={isMobile ? "flex-start" : "flex-start"} gap={5} className={styles.titleWrapper}>
                  {i + 1}.<h1>{list.title}</h1>
                </Flex>
                <div className={styles.descriptionWrapper}>
                  {list.label !== "" && <p>{list.label}</p>}
                  {list.description.length > 0 && (
                    <ul>
                      {list.description.map((descrip, i) => {
                        return (
                          <li key={i}>
                            <p>{descrip}</p>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </Space>
            );
          })}
        </div>

        {titleDescription ? (
          ""
        ) : (
          <h3>YOU HAVE READ THESE TERMS OF USE AND AGREE TO ALL OF THE PROVISIONS CONTAINED ABOVE.</h3>
        )}
      </div>
    </div>
  );
};
export default LegalAgreement;

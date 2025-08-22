import React, { FC, useEffect, useState } from "react";
import { Card, Tag, Flex, Dropdown, Button, Space } from "antd";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import styles from "@/components/AIConversation/AIAgent.module.scss";
// Replace with your own
import FallBackImage from "@/templates/standard/components/FallBackImage/FallBackImage";

interface AIAgentCardProps {
  title: string;
  description: React.ReactNode;
  tag?: React.ReactNode;

  state?: string;
  coverImage?: string | null;
  useGradientBg?: boolean;
  gradientIndex?: number; // Optional: 0–9 index for gradient
  gradientArray?: string[];

  footer?: React.ReactNode;
  bodyHeight?: number;
}

const AIAgentCard: FC<AIAgentCardProps> = ({
  title,
  description,
  tag,
  state,
  bodyHeight,
  coverImage,
  footer,
  useGradientBg = false,
  gradientIndex,
  gradientArray = [],
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const [gradientBg, setGradientBg] = useState<string>("");

  useEffect(() => {
    if (useGradientBg && gradientArray.length) {
      const randomIndex = gradientIndex ?? Math.floor(Math.random() * gradientArray.length);
      setGradientBg(gradientArray[randomIndex]);
    }
  }, [useGradientBg, gradientArray, gradientIndex]);

  return (
    <Card
      className={styles.course__card}
      cover={
        useGradientBg ? (
          <div
            style={{
              width: isMobile ? "80vw" : "100%",
              height: 210,
              background: gradientBg,
            }}
          />
        ) : (
          <FallBackImage
            width={isMobile ? "80vw" : "380px"}
            height={214}
            imageSrc={coverImage}
            ariaLabel={`thumbnail of ${title}`}
          />
        )
      }
    >
      <Card.Meta
        className={styles.meta}
        style={{ height: bodyHeight }}
        title={
          <>
            <Flex align="center" justify="space-between" gap={5}>
              <Space wrap>
                {tag}
                {state && (
                  <Tag bordered={true} color="warning" style={{ fontWeight: "normal" }}>
                    {state}
                  </Tag>
                )}
              </Space>
            </Flex>
            <h4 style={{ marginTop: 5, marginBottom: 5 }}>{title}</h4>
          </>
        }
        description={description}
      />
      <div className={styles.card__footer}>{footer}</div>
    </Card>
  );
};

export default AIAgentCard;

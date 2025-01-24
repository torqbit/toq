import { Avatar, Flex } from "antd";
import React, { FC } from "react";
import { EmptyEvents } from "./SvgIcons";
import { getIconTheme } from "@/services/darkThemeConfig";
import { useAppContext } from "./ContextApi/AppContext";
import { IBrandConfig } from "@/types/schema";

const NoContentFound: FC<{
  content: string | React.ReactNode;
  isMobile: boolean;

  icon: React.ReactNode;
}> = ({ content, isMobile, icon }) => {
  return (
    <Flex align="center" justify="center" gap={10}>
      <div
        style={{
          height: 400,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-secondary)",
          color: "var(--font-primary)",
        }}
      >
        {" "}
        {icon}
        {typeof content == "string" ? (
          <p
            style={{
              maxWidth: isMobile ? 300 : 400,
              lineHeight: 1.5,
              fontSize: isMobile ? "1.2rem" : "1.5rem",
            }}
          >
            {content}
          </p>
        ) : (
          content
        )}
      </div>
    </Flex>
  );
};

export default NoContentFound;

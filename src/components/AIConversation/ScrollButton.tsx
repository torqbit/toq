import { Button } from "antd";
import React, { useEffect, useRef, useState } from "react";
import SvgIcons from "../SvgIcons";
import styles from "./AiChat.module.scss";

type Props = {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
};

const ScrollToBottomButton: React.FC<Props> = ({ scrollContainerRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
    setIsVisible(!isAtBottom);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    checkScroll(); // Initial check

    return () => {
      el.removeEventListener("scroll", checkScroll);
    };
  }, [scrollContainerRef]);

  const handleClick = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <Button
      type="default"
      shape="round"
      style={{
        width: 32,
        fontSize: 18,
      }}
      onClick={handleClick}
      icon={SvgIcons.arrowDown}
      className={styles.scroll__btn}
    ></Button>
  );
};

export default ScrollToBottomButton;

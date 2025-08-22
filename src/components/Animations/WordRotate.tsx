import { AnimatePresence, motion, MotionProps } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AIGradientLoader } from "../AIConversation/AIChatWidget";

interface WordRotateProps {
  words: string[];
  duration?: number;
  rotationTime?: number;
  motionProps?: MotionProps;
  className?: string;
}

export function WordRotate({
  words,
  duration = 2500,
  rotationTime = 250,
  motionProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        if (prevIndex === words.length - 1) {
          return prevIndex;
        } else {
          return (prevIndex + 1) % words.length;
        }
      });
    }, rotationTime);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [words, rotationTime]);

  return (
    <div
      className="overflow-hidden py-2  "
      style={{
        display: "grid",
        placeContent: "center",
        position: "fixed",
        minHeight: "100vh", // Add this to ensure full height
        width: "100%",
        top: 0,
      }}
    >
      <AIGradientLoader
        padding={"2rem"}
        style={{
          display: "initial",
          transition: "all 0.5s ease-in-out",
          scale: "1.8",
          position: "relative",
          zIndex: 100,
        }}
        height={"100%"}
        width={"100%"}
        pulseAnimation={false}
      />
      <AnimatePresence mode="wait">
        <motion.h4 key={words[index]} style={{ marginTop: 60 }} className={cn(className)} {...motionProps}>
          {words[index]}
        </motion.h4>
      </AnimatePresence>
    </div>
  );
}

import { Button, Space } from "antd";
import React from "react";
import style from "@/styles/LearnLecture.module.scss";
import { SelectedAnswersType } from "@/types/courses/assignment";
import { areAnswersEqualForKey } from "@/lib/utils";

interface MCQOptionProps {
  label: string;
  value: string | number;
  isSelected: boolean;
  correctOptionIndex: string[];
  selectedAnswer: string[];
  onClick: () => void;
}

const MCQOption: React.FC<MCQOptionProps> = ({
  label,
  value,
  isSelected,
  onClick,
  correctOptionIndex,
  selectedAnswer,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${style.mcq_option}
      ${correctOptionIndex.length === 0 ? style.mcq_option_hover : style.cursor_disabled}
       ${isSelected && correctOptionIndex?.length === 0 ? style.mcq_option_selected : ""}  ${
        !areAnswersEqualForKey(correctOptionIndex, selectedAnswer) &&
        selectedAnswer?.includes(value.toString()) &&
        style.mcq_option_wrong
      } ${correctOptionIndex?.includes(value.toString()) && style.mcq_option_correct}`}
    >
      <Space style={{ width: "100%" }} direction="horizontal" size="middle">
        <Button size="small" style={{ border: "none" }}>
          {value}
        </Button>
        <p style={{ marginBottom: 0 }}>{label}</p>
      </Space>
    </div>
  );
};

export default MCQOption;

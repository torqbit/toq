import { Button, Space } from "antd";
import React from "react";
import style from "@/styles/LearnLecture.module.scss";

interface MCQOptionProps {
  label: string;
  value: string | number;
  isSelected: boolean;
  onClick: () => void;
}

const MCQOption: React.FC<MCQOptionProps> = ({ label, value, isSelected, onClick }) => {
  return (
    <div onClick={onClick} className={`${style.mcq_option} ${isSelected ? style.mcq_option_selected : ""}`}>
      <Space style={{ width: "100%" }} direction="horizontal" size="middle">
        <Button size="small" style={{ border: "none" }}>
          {value}
        </Button>
        <span>{label}</span>
      </Space>
    </div>
  );
};

export default MCQOption;

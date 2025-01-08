import React, { useState } from "react";
import { Flex } from "antd";
import { MultipleChoiceQA } from "@/types/courses/assignment";
import MCQOption from "./MCQOptions";
import style from "@/styles/LearnLecture.module.scss";
import PurifyContent from "@/components/PurifyContent/PurifyContent";

interface QuestionCardProps {
  question: MultipleChoiceQA;
  selectedAnswer: any[];
  onAnswerSelect: (answer: string | number, id: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, selectedAnswer, onAnswerSelect }) => {
  return (
    <div style={{ marginBottom: 15 }}>
      <Flex gap={5}>
        <h3>{question?.id}.</h3>
        <h3 style={{ maxWidth: "525px" }}>{question.title}</h3>
      </Flex>
      <Flex gap={20} vertical={true}>
        {question.options.map((option) => (
          <MCQOption
            key={option.key}
            label={option.text}
            value={option.key}
            isSelected={selectedAnswer?.includes(option.key)}
            onClick={() => onAnswerSelect(option.key, question?.id)}
          />
        ))}
      </Flex>
      <div className={style.question_explanation}>
        <h5>Explanation</h5>
        <p>
          <PurifyContent content={question.description as string} />
        </p>
      </div>
    </div>
  );
};

export default QuestionCard;

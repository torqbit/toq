import React, { useState } from "react";
import { Flex } from "antd";
import { MultipleChoiceQA } from "@/types/courses/assignment";
import MCQOption from "./MCQOptions";
import style from "@/styles/LearnLecture.module.scss";
import PurifyContent from "@/components/PurifyContent/PurifyContent";

interface QuestionCardProps {
  question: MultipleChoiceQA;
  selectedAnswer: any[];
  isEvaluated: boolean;
  onAnswerSelect: (answer: string | number, id: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, selectedAnswer, onAnswerSelect, isEvaluated }) => {
  return (
    <div style={{ marginBottom: 15 }}>
      <Flex gap={5}>
        <h3>{question?.id}.</h3>
        <h3 style={{ maxWidth: "525px" }}>{question.title}</h3>
      </Flex>
      {question.description && <PurifyContent content={question.description as string} />}
      <Flex gap={20} vertical={true} style={{ marginTop: 20 }}>
        {question.options.map((option) => (
          <MCQOption
            key={option.key}
            label={option.text}
            value={option.key}
            correctOptionIndex={question.correctOptionIndex}
            selectedAnswer={selectedAnswer}
            isSelected={selectedAnswer?.includes(option.key)}
            onClick={() => onAnswerSelect(option.key, question?.id)}
          />
        ))}
      </Flex>
      {isEvaluated && question.answerExplanation && (
        <div className={style.question_explanation}>
          <h5>Explanation</h5>
          <p>{question.answerExplanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;

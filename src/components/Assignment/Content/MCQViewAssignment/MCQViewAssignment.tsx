import React, { useState, FC } from "react";
import QuestionViewCard from "./QuestionViewCard";
import { MultipleChoiceQA, SelectedAnswersType } from "@/types/courses/assignment";

const MCQViewAssignment: FC<{
  question: MultipleChoiceQA;
  selectedAnswers: SelectedAnswersType;
  handleSelectAnswer: (answer: string | number, id: string) => void;
}> = ({ question, selectedAnswers, handleSelectAnswer }) => {
  return (
    <div>
      <div style={{ marginBottom: 25 }} key={question?.id}>
        <QuestionViewCard
          question={question}
          selectedAnswer={selectedAnswers[Number(question?.id)] || null}
          onAnswerSelect={handleSelectAnswer}
        />
      </div>
    </div>
  );
};

export default MCQViewAssignment;

import React, { useState, FC } from "react";
import QuestionViewCard from "./QuestionViewCard";
import { MultipleChoiceQA, SelectedAnswersType } from "@/types/courses/assignment";

const MCQViewAssignment: FC<{
  question: MultipleChoiceQA;
  selectedAnswers: SelectedAnswersType;
  isEvaluated: boolean;
  handleSelectAnswer: (answer: string | number, id: string) => void;
}> = ({ question, selectedAnswers, handleSelectAnswer, isEvaluated }) => {
  return (
    <div>
      <div style={{ marginBottom: 25 }} key={question?.id}>
        <QuestionViewCard
          question={question}
          selectedAnswer={(selectedAnswers && selectedAnswers[Number(question?.id)]) || null}
          onAnswerSelect={handleSelectAnswer}
          isEvaluated={isEvaluated}
        />
      </div>
    </div>
  );
};

export default MCQViewAssignment;

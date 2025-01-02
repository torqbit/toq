import React from "react";
import { Card } from "antd";
import QuestionTitle from "./QuestionTitle";
import OptionsSection from "./OptionSection";
import { AnswerKeys } from "./AnswerKeys";
import QuestionExplanation from "./QuestionExplanation";
import { Question } from "./types";
import { DeleteFilled } from "@ant-design/icons";

interface QuestionCardProps {
  question: Question;
  onQuestionChange: (updatedQuestion: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onQuestionChange, onDeleteQuestion }) => {
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], text: value };
    onQuestionChange({ ...question, options: newOptions });
  };

  const handleAddOption = () => {
    const newKey = String.fromCharCode(65 + question.options.length);
    onQuestionChange({
      ...question,
      options: [...question.options, { key: newKey, text: "" }],
    });
  };

  const onDeleteOption = (index: number) => {
    const newOptions = [...question.options];
    newOptions.splice(index, 1);
    onQuestionChange({ ...question, options: newOptions });
  };

  return (
    <Card
      title={`Question ${question.id}`}
      style={{ marginBottom: 16 }}
      extra={<DeleteFilled onClick={() => onDeleteQuestion(question.id)} />}
    >
      <QuestionTitle
        title={question.title}
        description={question.description}
        onTitleChange={(value: string) => onQuestionChange({ ...question, title: value })}
        onDescriptionChange={(value: string) => onQuestionChange({ ...question, description: value })}
      />
      <OptionsSection
        options={question.options}
        onOptionChange={handleOptionChange}
        onAddOption={handleAddOption}
        deleteOption={onDeleteOption}
      />
      <AnswerKeys
        options={question.options}
        selectedAnswer={question.correctOptionIndex}
        onAnswerChange={(values: any) => onQuestionChange({ ...question, correctOptionIndex: values })}
      />
      <QuestionExplanation
        explanation={question.explanation || ""}
        onChange={(value: string) => onQuestionChange({ ...question, explanation: value })}
      />
    </Card>
  );
};

export default QuestionCard;

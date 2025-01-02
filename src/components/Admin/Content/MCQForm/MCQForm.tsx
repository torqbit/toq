import React, { useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import QuestionCard from "./QuestionCard";
import { Question } from "./types";

const createEmptyQuestion = (id: string): Question => ({
  id,
  title: "",
  description: "",
  options: [
    { key: "A", text: "" },
    { key: "B", text: "" },
  ],
  correctOptionIndex: [],
  explanation: "",
});

const MCQForm: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([createEmptyQuestion("1")]);

  const handleQuestionChange = (updatedQuestion: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)));
  };

  const handleAddQuestion = () => {
    const newId = String(questions.length + 1);
    setQuestions((prev) => [...prev, createEmptyQuestion(newId)]);
  };
  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  console.log(questions, "dd");

  return (
    <div style={{ padding: 5 }}>
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          onQuestionChange={handleQuestionChange}
          onDeleteQuestion={handleDeleteQuestion}
        />
      ))}
      <Button type="dashed" onClick={handleAddQuestion} icon={<PlusOutlined />} block style={{ marginTop: 16 }}>
        Add Question
      </Button>
    </div>
  );
};

export default MCQForm;

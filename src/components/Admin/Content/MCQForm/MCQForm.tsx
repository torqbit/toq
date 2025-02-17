import React, { useState } from "react";
import { Button, Popconfirm } from "antd";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import QuestionCard from "./QuestionCard";
import { createEmptyQuestion } from "../AddAssignment";
import { MultipleChoiceQA } from "@/types/courses/assignment";

import styles from "../../../Configuration/CMS/CMS.module.scss";
import { Collapse } from "antd";

const MCQForm: React.FC<{
  questions: MultipleChoiceQA[];
  setQuestions: React.Dispatch<React.SetStateAction<MultipleChoiceQA[]>>;
}> = ({ questions, setQuestions }) => {
  const [activePanel, setActivePanel] = useState<string[]>([]);
  const handleQuestionChange = (updatedQuestion: MultipleChoiceQA) => {
    setQuestions((prev) => prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)));
  };

  const handleAddQuestion = () => {
    const newId = String(questions.length + 1);
    setActivePanel([newId]);
    setQuestions((prev) => [...prev, createEmptyQuestion(newId)]);
  };
  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  return (
    <div style={{ padding: 5 }}>
      <section
        className={`${styles.cms__container} ${styles.question_card}`}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <Collapse
          style={{ borderRadius: 4 }}
          accordion
          activeKey={activePanel}
          onChange={setActivePanel}
          items={questions.map((question, i) => {
            return {
              key: question.id,
              label: <h4 style={{ margin: 0 }}>Question {i + 1}</h4>,
              headerClass: styles.collapse__header__wrapper,
              children: (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onQuestionChange={handleQuestionChange}
                  onDeleteQuestion={handleDeleteQuestion}
                />
              ),
              extra: (
                <Popconfirm
                  title="Delete the question"
                  description="Are you sure to delete this question?"
                  onConfirm={() => handleDeleteQuestion(question.id)}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteFilled />
                </Popconfirm>
              ),
              showArrow: true,
            };
          })}
        />
      </section>

      <Button type="dashed" onClick={handleAddQuestion} icon={<PlusOutlined />} block style={{ marginTop: 16 }}>
        Add Question
      </Button>
    </div>
  );
};

export default MCQForm;

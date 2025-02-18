import React, { FC, useEffect, useState } from "react";
import style from "@/styles/LearnLecture.module.scss";
import { Role, submissionStatus } from "@prisma/client";
import { useMediaQuery } from "react-responsive";
import AssignmentContentTab from "./Content/AssignmentContentTab";
import { useAppContext } from "../ContextApi/AppContext";

export type AssignmenTab = "view_assignment" | "submission" | "discussions";

const ViewAssignment: FC<{
  lessonId: number;
  discussionLoader: boolean;
  assignmentId: number;
  userRole: Role;
  ResponsiveLessonItemsList: JSX.Element;
  assignmentFiles: string[];
  onNextLesson: (chapterSeqId: number) => void;
  setLessonRefresh: () => void;
  updateAssignmentWatchedStatus: (chapterSeqId: number, lessonId: number) => void;
  chapterSeqId: number;
}> = ({ lessonId, onNextLesson, chapterSeqId, setLessonRefresh, userRole }) => {
  const isMax933Width = useMediaQuery({ query: "(max-width: 933px)" });
  const { globalState } = useAppContext();

  const getTabWidth = () => {
    if (globalState.collapsed && globalState.lessonCollapsed) {
      return "calc(100vw - 320px)";
    } else if (!globalState.collapsed && globalState.lessonCollapsed) {
      return "calc(100vw - 500px)";
    } else if (globalState.collapsed && !globalState.lessonCollapsed) {
      return "calc(100vw - 570px)";
    } else {
      return "calc(100vw - 750px)";
    }
  };

  return (
    <section className={style.view_submit_assignment}>
      <div style={{ width: isMax933Width ? "auto" : getTabWidth(), transition: "all .4s ease" }}>
        <AssignmentContentTab
          lessonId={lessonId}
          onNextLesson={() => onNextLesson(chapterSeqId)}
          setLessonRefresh={setLessonRefresh}
          userRole={userRole}
        />
      </div>
    </section>
  );
};

export default ViewAssignment;

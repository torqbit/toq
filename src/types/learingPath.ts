import { Role, StateType } from "@prisma/client";

export interface ILearningCourseList {
  courseId: number;
  name?: string;
}

export interface ILearningPathDetail {
  title: string;
  id: number;
  description: string;
  state: StateType;
  banner: string;

  slug: string;
  author: {
    name: string;
  };
  learningPathCourses: ILearningCourseList[];
}

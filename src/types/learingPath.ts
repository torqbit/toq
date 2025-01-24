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
  price: number;

  slug: string;
  author: {
    name: string;
  };
  learningPathCourses: ILearningCourseList[];
}

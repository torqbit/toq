import { Role, StateType } from "@prisma/client";

export interface ILearningCourseList {
  courseId: number;
  name?: string;
}
export interface ILearningPathCourseStatus {
  courseId: number;
  totalLessons: number;
  watchedLesson: number;
  slug: string;
  latestProgressDate: Date;
  latestLessonId: number;
  firstLessonId: number;
}
export interface ILearningPreviewDetail {
  title: string;
  id: number;
  description: string;
  banner?: string;
  price: number;
  slug: string;
  currency: string;
  role?: Role;
  contentDurationInHrs: number;
  assignmentsCount: number;
  instructors: string[];
  author: {
    name: string;
    designation: string;
  };
  learningPathCourses: ILearningCourseDetail[];
}

export interface ILearningPathDetail {
  title: string;
  id: number;
  description: string;
  state: StateType;
  banner: string;
  price: number;
  slug: string;
  product?: any;
  role: Role;
  author: {
    name: string;
  };
  learningPathCourses: ILearningCourseList[];
}

export interface ILearningCourseDetail {
  courseId: number;
  banner: string;
  slug: string;
  title: string;
  description: string;
}

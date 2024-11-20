import { courseDifficultyType, CourseType } from "@prisma/client";

export interface ICourseCard {
  title: string;
  img: string;
  duration: string;
  description: string;
  link: string;
  courseType: CourseType;
  coursePrice: number;
  difficulty: courseDifficultyType;
  cardClass?: string;
  courseListLength?: number;
}

export interface ICourseInfo {
  title: string;
  description: string;
  courseList: ICourseCard[];
}

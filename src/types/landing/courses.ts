import { courseDifficultyType, CourseType } from "@prisma/client";
export type CourseCardSize = "small" | "large";
export interface ICourseCard {
  title: string;
  thumbnail: string;
  duration: string;
  description: string;
  link: string;
  courseType: CourseType;
  price: number;
  size?: CourseCardSize;
  difficulty: courseDifficultyType;
  cardClass?: string;
  previewMode?: boolean;
}

export interface ICourseInfo {
  title: string;
  description: string;
  courseList: ICourseCard[];
  previewMode?: boolean;
}

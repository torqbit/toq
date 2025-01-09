import { courseDifficultyType, CourseType, Role } from "@prisma/client";
import { IBrandConfig } from "../schema";
import { ICourseListItem } from "../courses/Course";
export type CourseCardSize = "small" | "large";
export interface ICourseCard {
  title: string;
  tvThumbnail: string;
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
  courseList: ICourseListItem[];
  brand: IBrandConfig;

  previewMode?: boolean;
}

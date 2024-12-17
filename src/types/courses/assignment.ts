export interface IAssignmentData {
  open: boolean;
  assignmentId?: number;
  lessonId?: number;
}

export interface ITreeConfig {
  htmlFiles: string[];
  cssFiles: string[];
}

export interface AssignmentConfig {
  codeData: string[][];
  courseId: number;
  lessonId: number;
  userId: string;
  previewFileName: string;
}

export enum SubmissionType {
  PROGRAMMING_LANG = "PROGRAMMING_LANG",
  PROGRAMMING_PROJECT = "PROGRAMMING_PROJECT",
  TEXT = "TEXT",
  URL = "URL",
}

export interface IAssignmentSubmission {
  _type: SubmissionType;
}
export interface IProgrammingLangSubmission extends IAssignmentSubmission {
  initialCode: string;
  programmingLang: string;
}

export interface IProgrammingProjectSubmission extends IAssignmentSubmission {
  framework: "STATIC_WEB" | "REACTJS" | "NEXT_APP";
  url: string;
}

export interface ITextSubmissionContent extends IAssignmentSubmission {
  text: string;
}

export interface IUrlSubmission extends IAssignmentSubmission {
  service: string;
  url: string;
}

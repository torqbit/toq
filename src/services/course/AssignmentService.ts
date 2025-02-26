import { Assignment, AssignmentSubmission, submissionStatus } from "@prisma/client";
import { getDelete, getFetch, postFetch } from "../request";
import { IAssignmentDetail } from "@/types/courses/Course";
import {
  AssignmentCreateRequest,
  IAssignmentDetails,
  IAssignmentSubmissionDetail,
  IAssignmentSubmissionResponse,
  IEvaluationResult,
  ISubjectiveScores,
  QuestionScore,
} from "@/types/courses/assignment";
import { APIResponse } from "@/types/apis";

export interface ISubmissionTableInfo {
  key: number;
  courseName: string;
  assignmentName: string;
  student: string;
  submissionDate: string;
}

export interface ISubmissionList {
  subId: number;
  studentId: string;
  submissionDate: string; // ISO 8601 date-time format
  assignmentId: number;
  courseId: number;
  courseName: string;
  assignmentName: string;
  studentName: string;
  isEvaluated: boolean;
}

export interface IScoreSummary extends IAssignmentDetails {
  eachQuestionScore: ISubjectiveScores[] | QuestionScore[];
}
export interface ISubmissionDetail {
  content: IAssignmentDetails;
  assignContent?: IAssignmentDetails;
  assignmentId: number;
  isEvaluated: boolean;
  score?: number;
  maximumScore: number;
  passingScore: number;
  comment?: string;
  lessonId: number;
  assignmentName: string;
  scoreSummary: IScoreSummary;
}
export interface IAllSubmmissionsDetail {
  submissionId: number;

  content: Map<string, string> | [string, string][];
  comment: string;
  submittedDate: Date;
  evaluated: boolean;
  score: number | undefined;
}
export interface ILatestSubmissoinDetail {
  allSubmmissions: IAllSubmmissionsDetail[];
  isEvaluated: boolean;
  previousContent?: Map<string, string> | [string, string][];
  savedContent?: Map<string, string> | [string, string][];
  score: number;
  status?: submissionStatus;
  submitLimit?: number;
}

interface ApiResponse {
  success: boolean;
  error: string;
  message: string;
  preview: string;
  assignmentDetail: IAssignmentDetail;
  submissionContent: IAssignmentSubmissionDetail;
  evaluationResult: IEvaluationResult;
  allAssignmentData: Assignment[];
  codeDetail: Map<string, string>;
  totalSubmissions: number;
  submissionList: SubmissionsByCourseId;
  submissionDetail: ISubmissionDetail;
  isEvaluated: boolean;
  latestSubmissionDetail: ILatestSubmissoinDetail;
  courseCompleted: boolean;
  courseId: number;
  allSubmmissions: IAllSubmmissionsDetail[];
  latestSubmissionStatus: submissionStatus;
  score: number;
  maximumScore: number;
  submitLimit: number;
}

export interface SubmissionsByCourseId {
  [courseId: number]: ISubmissionList[];
}

type FailedApiResponse = {
  error: string;
};
class AssignmentSerivce {
  updateAssignment = (
    assignmentData: {
      lessonId: number;
      content?: string;
      title?: string;
      assignmentFiles?: string[];
    },
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(assignmentData, `/api/v1/resource/assignment/update`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };

  createAssignment = (
    assignmentData: AssignmentCreateRequest,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(assignmentData, `/api/v1/resource/assignment/save`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };
  getAssignment = (
    lessonId: number,
    isNoAnswer: boolean,
    onSuccess: (response: IAssignmentDetail) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/resource/assignment/get?lessonId=${lessonId}&isNoAnswer=${isNoAnswer}`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as APIResponse<IAssignmentDetail>;
          apiResponse.body && onSuccess(apiResponse.body);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };

  getSubmissionHistory = (
    lessonId: number,
    assignmentId: number,
    courseId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/course/${courseId}/assignment/${assignmentId}/${lessonId}/submission/history`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };

  getLatestSubmissionStatus = (
    lessonId: number,
    assignmentId: number,
    courseId: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/course/${courseId}/assignment/${assignmentId}/${lessonId}/submission/latestStatus`).then(
      (result) => {
        if (result.status == 200) {
          result.json().then((r) => {
            const apiResponse = r as ApiResponse;
            onSuccess(apiResponse);
          });
        } else {
          result.json().then((r) => {
            const failedResponse = r as FailedApiResponse;
            onFailure(failedResponse.error);
          });
        }
      }
    );
  };

  checkSubmissions = (
    assignmentId: number,
    lessonId: number,
    courseId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/course/${courseId}/assignment/${assignmentId}/${lessonId}/submission/list-submissions`).then(
      (result) => {
        if (result.status == 200) {
          result.json().then((r) => {
            const apiResponse = r as ApiResponse;
            onSuccess(apiResponse);
          });
        } else {
          result.json().then((r) => {
            const failedResponse = r as FailedApiResponse;
            onFailure(failedResponse.error);
          });
        }
      }
    );
  };

  getAllAssignment = (
    lessonId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/resource/assignment/get-all?lessonId=${lessonId}`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };

  deleteAssignment = (
    assignmentId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getDelete(`/api/v1/resource/assignment/delete?assignment=${assignmentId}`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };

  deleteAssignmentArchive = (
    archiveUrl: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getDelete(`/api/v1/resource/assignment/archive/delete?archiveUrl=${archiveUrl}`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };

  submitAssignment = (
    data: {
      content: any;
      courseId: number;
      lessonId: number;
      assignmentId: number;
    },
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(
      data,
      `/api/v1/course/${data.courseId}/assignment/${data.assignmentId}/${data.lessonId}/submission/submit`
    ).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };

  saveAssignment = (
    data: {
      content: any;
      courseId: string;
      lessonId: number;
      assignmentId: number;
    },
    onSuccess: (response: IAssignmentSubmissionResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(
      data,
      `/api/v1/course/${data.courseId}/assignment/${data.assignmentId}/${data.lessonId}/submission/save`
    ).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as APIResponse<IAssignmentSubmissionResponse>;
          apiResponse.body && onSuccess(apiResponse.body);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };

  previewAssignment = (
    codeData: string[][],
    courseId: number,
    assignmentId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch({ codeData }, `/api/v1/course/${courseId}/assignment/${assignmentId}/save`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };
  listSubmission = (
    courseId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/admin/submission/list?courseId=${courseId}`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };

  getSubmissionDetail = (
    id: number,
    onSuccess: (response: ISubmissionDetail) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/admin/submission/get?submissionId=${id}`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as APIResponse<ISubmissionDetail>;
          apiResponse.body && onSuccess(apiResponse.body);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };

  getSubmissionContent = (
    courseId: string,
    lessonId: number,
    assignmentId: number,
    onSuccess: (response: IAssignmentSubmissionDetail) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/course/${courseId}/assignment/${assignmentId}/${lessonId}/submission/get`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as APIResponse<IAssignmentSubmissionDetail>;
          apiResponse.body && onSuccess(apiResponse.body);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };
  getEvaluationResult = (
    courseId: string,
    lessonId: number,
    assignmentId: number,
    submissionId: number,
    onSuccess: (response: IEvaluationResult) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/course/${courseId}/assignment/${assignmentId}/${lessonId}/submission/${submissionId}/get`).then(
      (result) => {
        if (result.status == 200) {
          result.json().then((r) => {
            const apiResponse = r as APIResponse<IEvaluationResult>;
            apiResponse.body && onSuccess(apiResponse.body);
          });
        } else {
          result.json().then((r) => {
            const failedResponse = r as FailedApiResponse;
            onFailure(failedResponse.error);
          });
        }
      }
    );
  };

  completeSubmission = (
    courseId: string,
    assignmentId: number,
    lessonId: number,
    submissionId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void,
    subjectiveScore?: ISubjectiveScores
  ) => {
    postFetch(
      { subjectiveScore },
      `/api/v1/course/${courseId}/assignment/${assignmentId}/${lessonId}/submission/${submissionId}/evaluate`
    ).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };

  createEvaluation = (
    evaluateDetail: { assignmentId: number; submissionId: number; score: number; comment: string },
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(evaluateDetail, `/api/v1/admin/submission/evaluate`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      }
    });
  };
}

export default new AssignmentSerivce();

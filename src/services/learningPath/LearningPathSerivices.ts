import { AnalyticsDuration, AnalyticsType, IAnalyticResponse, IAnalyticStats } from "@/types/courses/analytics";

import { APIResponse } from "@/types/apis";
import { getDelete, getFetch, postFetch, postWithFile } from "../request";
import { ILearningCourseList, ILearningPathDetail } from "@/types/learingPath";
import { StateType } from "@prisma/client";

class LearningPathServices {
  create = (
    formData: FormData,
    onSuccess: (response: APIResponse<ILearningPathDetail>) => void,
    onFailure: (message: string) => void
  ) => {
    postWithFile(formData, `/api/v1/learningPath/create`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as APIResponse<ILearningPathDetail>;
        apiResponse.body ? onSuccess(apiResponse) : onFailure(`${apiResponse.error}`);
      });
    });
  };
  update = (
    formData: FormData,
    onSuccess: (response: APIResponse<ILearningPathDetail>) => void,
    onFailure: (message: string) => void
  ) => {
    postWithFile(formData, `/api/v1/learningPath/update`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as APIResponse<ILearningPathDetail>;
        apiResponse.body ? onSuccess(apiResponse) : onFailure(`${apiResponse.error}`);
      });
    });
  };
  listPath = (
    onSuccess: (response: APIResponse<ILearningPathDetail[]>) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/learningPath/list`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as APIResponse<ILearningPathDetail[]>;
        apiResponse.body ? onSuccess(apiResponse) : onFailure(`${apiResponse.error}`);
      });
    });
  };

  latestLesson = (pathId: number, onSuccess: (response: APIResponse<string>) => void) => {
    getFetch(`/api/v1/learningPath/${pathId}/getLatestLesson`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as APIResponse<string>;
        onSuccess(apiResponse);
      });
    });
  };

  delete = (
    pathId: number,
    onSuccess: (response: APIResponse<string>) => void,
    onFailure: (message: string) => void
  ) => {
    getDelete(`/api/v1/learningPath/${pathId}/delete`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as APIResponse<string>;
        apiResponse.success ? onSuccess(apiResponse) : onFailure(`${apiResponse.error}`);
      });
    });
  };
}

export default new LearningPathServices();

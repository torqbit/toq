import { Course } from "@prisma/client";

import { getFetch, postFetch } from "./request";
import { INotification } from "@/components/Header/Header";

export interface ICourseList extends Course {
  courseId: number;
  tags: string[];
  enrollCourses: string[];
}

export type ApiResponse = {
  success: boolean;
  error: string;
  message: string;
  isNew: boolean;
  notifications: INotification[];
  length: number;
};

type FailedApiResponse = {
  error: string;
};
class NotificationService {
  checkNotification = (
    toUserId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/notification/check/${toUserId}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  getNotification = (
    toUserId: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/notification/get/${toUserId}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  updateNotification = (
    id: number,
    userId: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/notification/update/${id}?userId=${userId}`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
  updateMultipleNotification = (
    tagCommentId: number,
    userId: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch({ tagCommentId: tagCommentId }, `/api/v1/notification/updateMany/update`).then((result) => {
      if (result.status == 400) {
        result.json().then((r) => {
          const failedResponse = r as FailedApiResponse;
          onFailure(failedResponse.error);
        });
      } else if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      }
    });
  };
}

export default new NotificationService();

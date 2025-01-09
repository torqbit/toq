import { IOverviewStats } from "@/types/courses/analytics";
import { getFetch } from "./request";
export type UserAnalyseData = {
  year: any;
  month: any;
  users: number;
};
export type ApiResponse = {
  success: boolean;
  error: string;
  message: string;
  overviewStats: IOverviewStats[];
  totalMembers: number;
  totalEnrolled: number;
  activeMembers: number;
  userData: UserAnalyseData[];
};

type FailedApiResponse = {
  error: string;
};
class AnalyticsSerivce {
  overAllMembers = (
    courseId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/admin/analytics/overall-members-stats?courseId=${courseId}`).then((result) => {
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
  monthlyMembers = (onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/admin/analytics/monthly-members`).then((result) => {
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

  monthlyActiveMembers = (
    courseId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/admin/analytics/monthly-active-members?courseId=${courseId}`).then((result) => {
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
  monthlyEnrolledMembers = (
    courseId: number,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`/api/v1/admin/analytics/monthly-enrolled-members?courseId=${courseId}`).then((result) => {
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

  overviewStats = (onSuccess: (response: ApiResponse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/admin/analytics/overview`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as ApiResponse;
        apiResponse.success ? onSuccess(apiResponse) : onFailure(apiResponse.error);
      });
    });
  };
}

export default new AnalyticsSerivce();

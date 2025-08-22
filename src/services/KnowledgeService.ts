import { KnowledgeSource, KnowledgeSourceType } from "@prisma/client";
import { getFetch, postFetch, postWithFile } from "./request";
import { APIResponse } from "@/types/apis";

export type ApiResponse = {
  success: boolean;
  error: string;
  message: string;
};

export interface IExtendedKnowledgeSource extends KnowledgeSource {
  totalLinks: number;
  sourceSize: number;
  addedLinks: number;
}

export interface IAddKnowledgeResponse {
  sourceId: string;
  urlsCount: number;
}

export interface IAddSources {
  sourceId: string;
  url: string;
}

export interface IAIChatSource {
  sourceList: IExtendedKnowledgeSource[];
  totalSourceList: number;
}

export interface IAddKnowledgeSource {
  sourceUrl: string;
  sourceType: KnowledgeSourceType;
}
type FailedApiResponse = {
  error: string;
};
class AIKnowledgeService {
  addKnowledgeSource = (
    data: IAddKnowledgeSource,
    onSuccess: (response: IAddKnowledgeResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(data, `/api/v1/admin/sources/crawl`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as APIResponse<IAddKnowledgeResponse>;
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

  addSingleSourceKnowlede = (
    sourceUrl: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch({ sourceUrl }, `/api/v1/ai-chat/add-single-url`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as APIResponse<ApiResponse>;
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

  addSources = (
    parentSourceId: string,
    data: IAddSources[],
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch({ urlSources: data, parentSourceId }, `/api/v1/admin/sources/add`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as APIResponse<ApiResponse>;
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
  discardDiscoveredSrouces = (
    sourceId: string,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch({ sourceId }, `/api/v1/admin/sources/discard`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as APIResponse<ApiResponse>;
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

  getChatSource = (
    page: number,
    limit: number,
    statusfilter: string,
    onSuccess: (response: IAIChatSource) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`api/v1/ai-chat/get-chat-source?page=${page}&limit=${limit}&statusfilter=${statusfilter}`).then(
      (result) => {
        if (result.status == 200) {
          result.json().then((r) => {
            const apiResponse = r as APIResponse<IAIChatSource>;
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

  getSourceById = (
    sourceId: string,
    pageSize: number,
    pageNumber: number,
    onSuccess: (response: KnowledgeSource[]) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch({ sourceId, pageNumber, pageSize }, `/api/v1/admin/sources/list`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as APIResponse<KnowledgeSource[]>;
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
  deleteKnowledgeSource = (
    sourceId: string,
    onSuccess: (response: IAIChatSource) => void,
    onFailure: (message: string) => void
  ) => {
    getFetch(`api/v1/ai-chat/${sourceId}/delete`).then((result) => {
      if (result.status == 200) {
        result.json().then((r) => {
          const apiResponse = r as APIResponse<IAIChatSource>;
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
}

export default new AIKnowledgeService();

import { AgentResonse } from "@/pages/ai-assistant/[agentId]";
import { ApiResponse } from "@/services/AnalyticsService";
import { getDelete, getFetch, postFetch, postWithFile } from "@/services/request";
import { IAiAgents } from "@/types/admin/agents";

import { APIResponse } from "@/types/apis";

export interface ISupportInfo {
  title: string;
  message: string;
}

class SupportClientService {
  createTicket = (
    data: {
      message: string;
      title: string;
    },
    onSuccess: (response: string) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(data, `/api/v1/support/add`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as APIResponse<any>;
        apiResponse.status == 200 ? onSuccess(apiResponse.message) : onFailure(`${apiResponse.error}`);
      });
    });
  };

  skipOnboarding = (onSuccess: (response: string) => void, onFailure: (message: string) => void) => {
    postFetch({}, `/api/v1/onboarding`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as APIResponse<any>;
        apiResponse.status == 200 ? onSuccess(apiResponse.message) : onFailure(`${apiResponse.error}`);
      });
    });
  };
  deleteTenant = (tenantId: string, onSuccess: (response: string) => void, onFailure: (message: string) => void) => {
    getDelete(`/api/v1/admin/tenants/delete/${tenantId}`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as APIResponse<any>;
        apiResponse.status == 200 ? onSuccess(apiResponse.message) : onFailure(`${apiResponse.error}`);
      });
    });
  };

  createPlanUsage = (onSuccess: (response: string) => void, onFailure: (message: string) => void) => {
    postFetch({}, `/api/v1/plans/usage/create`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as APIResponse<any>;
        apiResponse.status == 200 ? onSuccess(apiResponse.message) : onFailure(`${apiResponse.error}`);
      });
    });
  };
  updateAiAgent = (
    data: { agentId: string; name: string; agentPrompt: string; model: string; temperature: number },
    onSuccess: (response: string) => void,
    onFailure: (message: string) => void
  ) => {
    postFetch(data, `/api/v1/admin/tenants/agents/update`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as APIResponse<any>;
        apiResponse.status == 200 ? onSuccess(apiResponse.message) : onFailure(`${apiResponse.error}`);
      });
    });
  };
  listAiAgents = (onSuccess: (response: IAiAgents[]) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/admin/tenants/agents/list`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as APIResponse<any>;
        apiResponse.status == 200 ? onSuccess(apiResponse.body) : onFailure(`${apiResponse.error}`);
      });
    });
  };
  getAiAgents = (id: string, onSuccess: (response: AgentResonse) => void, onFailure: (message: string) => void) => {
    getFetch(`/api/v1/admin/tenants/agents/get/${id}`).then((result) => {
      result.json().then((r) => {
        const apiResponse = r as APIResponse<any>;
        apiResponse.status == 200 ? onSuccess(apiResponse.body) : onFailure(`${apiResponse.error}`);
      });
    });
  };
  validateUserSignIn = async (email: string) => {
    const res = await postFetch({ email, authType: "signin" }, "/api/v1/user/check");
    const result = (await res.json()) as APIResponse<any>;

    return result;
  };

  validateUserSignup = async (email: string) => {
    const res = await postFetch({ email, authType: "signup" }, "/api/v1/user/check");
    const result = (await res.json()) as APIResponse<any>;

    return result;
  };
  updateProfile = (
    formData: FormData,
    onSuccess: (response: ApiResponse) => void,
    onFailure: (message: string) => void
  ) => {
    postWithFile(formData, `/api/user/update`).then((result) => {
      if (result.status == 200 || result.status == 201) {
        result.json().then((r) => {
          const apiResponse = r as ApiResponse;
          onSuccess(apiResponse);
        });
      } else {
        result.json().then((r) => {
          const failedResponse = r as any;
          onFailure(failedResponse.error);
        });
      }
    });
  };
}

export default new SupportClientService();

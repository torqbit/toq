import { getFetch, postFetch } from "@/services/request";
import { APIResponse } from "@/types/apis";

class ChatService {
  getConversation = async (
    conversationId: string,
    sessionId: string,
    onSuccess: (result: any) => void,
    onFailure: (err: string) => void
  ) => {
    try {
      postFetch({ conversationId, sessionId }, `/api/v1/chat/fetch`).then((result) => {
        result.json().then((r) => {
          const apiResponse = r as APIResponse<any>;
          apiResponse.status == 200 ? onSuccess(apiResponse.body) : onFailure(`${apiResponse.error}`);
        });
      });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      return new APIResponse(false, 500, "Error fetching conversation", null);
    }
  };
  getChatHistory = async (limit: number, onSuccess: (result: any) => void, onFailure: (err: string) => void) => {
    try {
      getFetch(`/api/v1/chat/history?limit=${limit}`).then((result) => {
        result.json().then((r) => {
          const apiResponse = r as APIResponse<any>;
          apiResponse.status == 200 ? onSuccess(apiResponse.body) : onFailure(`${apiResponse.error}`);
        });
      });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      return new APIResponse(false, 500, "Error fetching conversation", null);
    }
  };
}

export default new ChatService();

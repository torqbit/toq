import { useAppContext } from "@/components/ContextApi/AppContext";
import ChatService from "@/services/client/ai/ChatService";
export const getChatHistoryList = async (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    ChatService.getChatHistory(
      5,
      (res) => {
        resolve(res);
      },
      (error) => {
        console.error("Error fetching chat history:", error);
        reject(error);
      }
    );
  });
};

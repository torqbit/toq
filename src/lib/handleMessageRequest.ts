//create a function that will take a message and a conversationId and return a promise that will resolve to the response

import { ChatContext } from "@/components/ContextApi/AppContext";
import fetch from "node-fetch";

export const handleMessageRequest = async (
  message: string,
  updateState: (chat: ChatContext) => void,
  onComplete: (content: string) => void,
  onError: (error: string) => void,
  conversationId?: string,
  sessionId?: string,
  agentId?: string
) => {
  const response = await fetch("/api/v1/chat/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, conversationId, sessionId, agentId }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  if (!reader) throw new Error("No readable stream");

  let done = false;
  let buffer = "";

  let completeContent = "";
  while (!done) {
    const { value, done: streamDone } = await reader.read();
    done = streamDone;
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

    // Parse chunks by line (depends on how OpenAI sends them)
    const lines = buffer.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        //console.log(`elapsed time: ${new Date().getTime() - startTime}ms, line: ${line}`);
        const data = line.replace("data: ", "").trim();
        if (data === "[DONE]") {
          onComplete(completeContent);
          return;
        }
        try {
          const json = JSON.parse(data);
          updateState(json);
          if (json.content) {
            completeContent += json.content;
          }
        } catch (err) {
          console.error("Failed to parse JSON", err, data);
        }
      }
      if (line.startsWith("error: ")) {
        const data = line.replace("error: ", "").trim();
        try {
          const json = JSON.parse(data);
          onError(json.userMessageContent);
        } catch (err) {
          console.error("Failed to parse JSON", err, data);
        }
      }
    }

    // Keep last partial line in buffer
    buffer = lines[lines.length - 1];
  }
};

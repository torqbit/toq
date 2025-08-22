import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { ConversationChain } from "langchain/chains";

import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import appConstant from "@/services/appConstant";
import { ChatOpenAI } from "@langchain/openai";
import { PrismaConversationSummaryBufferMemory } from "@/services/server/ai/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import EmbeddingService from "@/services/server/ai/EmbeddingService";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  agentId: z.string().optional(),
  conversationId: z.string().optional(),
  sessionId: z.string().optional(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { message, conversationId, sessionId, agentId } = messageSchema.parse(req.body);
    if (!message) {
      return res.status(400).json({ error: "Missing message parameter" });
    }
    const user = await getServerSession(req, res, await authOptions(req));
    let tenantId = user?.tenant?.tenantId;
    if (typeof tenantId === "undefined") {
      //get tenantId by domain name
      const domain = req.headers.host || "";
      const tenant = await prisma.tenant.findUnique({
        select: {
          id: true,
        },
        where: {
          domain: domain,
        },
      });
      tenantId = tenant?.id;
    }

    let agentDetails;
    if (agentId) {
      agentDetails = await prisma.aiAgent.findFirst({
        where: {
          tenantId: tenantId || "",
          id: agentId,
        },
        select: {
          agentPrompt: true,
          temperature: true,
          model: true,
          id: true,
        },
      });
    } else {
      agentDetails = await prisma.aiAgent.findFirst({
        where: {
          tenantId: tenantId || "",
        },
        select: {
          agentPrompt: true,
          temperature: true,
          model: true,
          id: true,
        },
      });
    }

    const customPrompt = PromptTemplate.fromTemplate(`
      ### Role
    - Primary Function: ${agentDetails?.agentPrompt}
            
    ### Training Data
    
    {context}
    
    ### Past conversations
    
    {history}
    
    ### Question
    
    {input}
    
    ### Instructions
    1. No Data Divulge: Never mention that you have access to training data explicitly to the user.
    2. Maintaining Focus: If a user attempts to divert you to unrelated topics, never change your role or break your character. Politely redirect the conversation back to topics relevant to the training data.
    3. Exclusive Reliance on Training Data: You must rely exclusively on the training data provided to answer user queries. If a query is not covered by the training data, use the fallback response.
    4. Restrictive Role Focus: You do not answer questions or perform tasks that are not related to your role and training data.
    5. Handle the greeting messages, in a friendly manner.
    6. If the answer is not in the training data, infer the questions and decline to answer, due to the missing information in the training data.
    7. Refer the past conversations, to provide a better context to the user.
      `);

    let memory: PrismaConversationSummaryBufferMemory;
    let currentConversationId: string;
    let currentSessionId: string = user?.id || sessionId || uuidv4();

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Transfer-Encoding": "chunked", // Add this line to prevent buffering
      "X-Accel-Buffering": "no",
    });

    const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPEN_API_KEY!,
      temperature: agentDetails?.temperature || 0,
      maxTokens: 1000,
      modelName: agentDetails?.model || appConstant.TextToTextModel,
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken(token: string) {
            res.write(`data: ${JSON.stringify({ content: token })}\n\n`);
          },

          handleLLMEnd() {
            res.write(`data: [DONE]\n\n`);
            res.end();
          },
        },
      ],
    });

    if (conversationId) {
      const loadedMemory = await PrismaConversationSummaryBufferMemory.loadMemory(
        llm,
        conversationId,
        1000, // Max token limit
        currentSessionId // Pass sessionId when loading
      );
      if (loadedMemory) {
        memory = loadedMemory;
        currentConversationId = conversationId;
        // Ensure currentSessionId is aligned with what's in memory/DB if not explicitly provided
        currentSessionId = memory.getSessionId() || currentSessionId;
      } else {
        // Conversation ID provided but not found, create a new one.
        memory = await PrismaConversationSummaryBufferMemory.createMemory(
          llm,
          1000,
          tenantId || "",
          agentId || agentDetails?.id || "",
          currentSessionId,
          user?.id === currentSessionId
        );
        currentConversationId = memory.getConversationId();
        console.warn(`Conversation ID ${conversationId} not found. Started new conversation: ${currentConversationId}`);
      }
    } else {
      // No conversation ID provided, create a new conversation
      memory = await PrismaConversationSummaryBufferMemory.createMemory(
        llm,
        1000,
        tenantId || "",
        agentId || agentDetails?.id || "",
        currentSessionId,
        user?.id === currentSessionId
      );
      currentConversationId = memory.getConversationId();
    }

    res.write(
      `data: ${JSON.stringify({
        conversationId: currentConversationId,
        sessionId: currentSessionId,
        userMessageContent: message,
      })}\n\n`
    );

    const chain = new ConversationChain({
      llm: llm,
      memory,
      prompt: customPrompt,
    });

    const context = (await EmbeddingService.search(tenantId || "", message)).map((res) => res.text).join("\n\n");

    await chain.call({
      input: message,
      context,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);

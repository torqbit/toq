import { aiAgent } from "@prisma/client";

export interface IAiAgents extends aiAgent {
  conversations: number;
}

import { ActivityType } from "@prisma/client";
import analytics from "./analytics";

export const UpdateActivitiesStats = async (req: any, userId: string, type: ActivityType, path: string) => {
  const host = req.headers.host;

  const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.socket?.remoteAddress || null;
  const userAgent = req.headers["user-agent"] || null;

  if (ip && userAgent && !process.env.NEXTAUTH_URL?.includes(host)) {
    const response = await analytics.addActivity(type, String(ip), String(userAgent), host, path);
    return response;
  }
};

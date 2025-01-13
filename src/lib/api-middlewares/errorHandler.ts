import appConstant from "@/services/appConstant";
import { APIResponse } from "@/types/apis";
import { Prisma } from "@prisma/client";
import type { NextApiResponse } from "next";
import { z } from "zod";

export function errorHandler(err: unknown, res: NextApiResponse) {
  if (
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientInitializationError
  ) {
    return res.status(422).json({ success: false, error: err.message });
  } else if (err instanceof z.ZodError) {
    return res.status(400).json({ success: false, error: err.errors });
  } else if (typeof err === "string") {
    return res.status(500).json({ success: false, error: err });
  } else if (err instanceof APIResponse) {
    return res.status(err.status).json(err);
  } else {
    return res.status(500).json({ success: false, error: appConstant.cmnErrorMsg });
  }
}

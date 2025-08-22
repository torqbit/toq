import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { APIResponse } from "@/types/apis";

const RAPID_EMAIL_VERIFIER_BASE_URL = "https://rapid-email-verifier.fly.dev";
const SINGLE_EMAIL_ENDPOINT = "/api/validate";
const BATCH_EMAIL_ENDPOINT = "/api/validate-batch";

const rateLimitStore = new Map();

// Rate limiting function
function checkRateLimit(identifier: string, maxRequests = 30, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, []);
  }

  const requests = rateLimitStore.get(identifier);
  const validRequests = requests.filter((time: number) => time > windowStart);

  if (validRequests.length >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: windowStart + windowMs };
  }

  validRequests.push(now);
  rateLimitStore.set(identifier, validRequests);

  return {
    allowed: true,
    remaining: maxRequests - validRequests.length,
    resetTime: windowStart + windowMs,
  };
}

export const verifySingleEmail = async (email: string) => {
  try {
    const response = await fetch(`${RAPID_EMAIL_VERIFIER_BASE_URL}${SINGLE_EMAIL_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      email: email,
      isValid: data.status === "VALID" && data.score == 100,
      isAlias: data.aliasOf || false,
    };
  } catch (error: any) {
    console.error(`Email verification API failed: ${error.message}`);
    return {
      email: email,
      isValid: false,
      isAlias: false,
    };
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email } = req.body;

    const validationResponse = await verifySingleEmail(email);
    if (validationResponse.isValid) {
      return res.status(200).json(new APIResponse(true, 200, "email is valid"));
    } else {
      return res.status(404).json(new APIResponse(false, 404, "email is not valid"));
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);

import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { z } from "zod";

import { promises as dns } from "dns";
import { signIn } from "next-auth/react";

const userSchema = z.object({
  email: z.string().email("Invalid email address"), // Email must be a valid email format
});

type SignUpRequest = z.infer<typeof userSchema>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const newUser: SignUpRequest = userSchema.parse(body);
    const rawDomain = newUser.email.split("@")[1];
    const emaildomain = rawDomain.split(":")[0];

    const mxRecords = await dns.resolveMx(emaildomain).catch((error) => {
      return res.status(400).json({ success: false, error: "Email domain is not verified" });
    });
    const isValid = mxRecords && mxRecords.length > 0;
    if (isValid) {
      return res.status(200).json({ success: true, message: "You have successfully signedup" });
    } else {
      return res.status(400).json({ success: false, error: "Email domain is not verified" });
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);

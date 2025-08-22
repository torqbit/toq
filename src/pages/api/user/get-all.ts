import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const allUsers = await prisma.user.findMany({});
    return res.status(200).json({ success: true, message: "Users Found", allUsers });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(withTenantOwnerAuthorized(handler)));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { decrypt } from "../../encryption";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { withTenantOwnerAuthorized } from "@/lib/api-middlewares/with-tenant-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query;
    const { name } = query;
    if (name) {
      const credentials = await prisma.serviceProvider.findFirst({
        where: {
          service_type: name as string,
        },
      });
      if (credentials) {
        return res.status(200).json({ success: true, messsage: "Found credentials", credentials });
      } else {
        return res.status(400).json({ success: false, messsage: "credentials not found" });
      }
    }
  } catch (err) {
    return errorHandler(err, res);
  }
};
export default withMethods(["GET"], withTenantOwnerAuthorized(handler));

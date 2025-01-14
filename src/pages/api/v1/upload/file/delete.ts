import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = await req.body;
    const { name, dir } = body;

    // Validate name and dir values
    const isValidName = /^[a-zA-Z0-9-_]+$/.test(name);
    const isValidDir = /^[a-zA-Z0-9-_]+$/.test(dir);
    if (!isValidName || !isValidDir) {
      return res.status(400).json({ success: false, message: "Invalid name or dir value" });
    }

    const service_provider = await prisma.serviceProvider.findFirst({
      where: {
        provider_name: "bunny img",
      },
    });
    if (service_provider) {
      const url = `https://storage.bunnycdn.com/torqbit-files/static/${dir}/${name}`;

      const options = {
        method: "DELETE",
        // headers: { AccessKey: service_provider.api_key },
      };

      fetch(url, options)
        .then((res) => res.json())
        .then((json: any) => {
          return res.status(200).json({ success: true, message: "file deleted" });
        })
        .catch((err: string) => console.error("error:" + err));
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["POST"], withAuthentication(handler));

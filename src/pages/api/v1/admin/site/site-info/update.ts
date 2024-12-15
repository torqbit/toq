import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";

import { withMethods } from "@/lib/api-middlewares/with-method";

const YAML = require("yaml");
import fs from "fs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { config } = req.body;

    const filePath = "./site.yaml";

    const updatedYamlContent = YAML.stringify({ site: config });

    fs.writeFileSync(filePath, updatedYamlContent, "utf8");

    return res.status(200).json({ success: true, message: " Design has been updated", basicInfo: req.body });
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);

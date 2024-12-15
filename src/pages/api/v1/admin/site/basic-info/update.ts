import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";

import { withMethods } from "@/lib/api-middlewares/with-method";

import { PageSiteConfig } from "@/services/siteConstant";
const YAML = require("yaml");
import fs from "fs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { brandName, brandColor, brandTitle } = req.body;

    const filePath = "./site.yaml";

    const file = fs.readFileSync(filePath, "utf8");
    const yamlData = YAML.parse(file);
    const { site } = yamlData;

    let data: PageSiteConfig = {
      ...site,
      updated: true,
      brand: {
        ...site.brand,
        name: brandName,
        brandColor: brandColor,
        title: brandTitle,
      },
    };

    const updatedYamlContent = YAML.stringify({ site: data });

    fs.writeFileSync(filePath, updatedYamlContent, "utf8");

    return res
      .status(200)
      .json({ success: true, message: "Basic site information has been updated", basicInfo: req.body });
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);

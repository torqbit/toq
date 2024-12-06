import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";

import { withMethods } from "@/lib/api-middlewares/with-method";
import path from "path";
import fs from "fs";
import os from "os";

import appConstant from "@/services/appConstant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { imageName } = req.query;
    const filePath = path.join(os.homedir(), `${appConstant.homeDirName}/static/${imageName}`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Image not found" });
    }

    const file = fs.readFileSync(filePath);

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(file);
  } catch (error) {
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], handler);

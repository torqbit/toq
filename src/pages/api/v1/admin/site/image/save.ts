import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";

import { withMethods } from "@/lib/api-middlewares/with-method";
import path from "path";
import fs from "fs";
import os from "os";

import appConstant from "@/services/appConstant";
import { readFieldWithFile } from "@/lib/upload/utils";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;
    const homeDir = os.homedir();
    const dirPath = path.join(homeDir, `${appConstant.homeDirName}/${appConstant.homeDirFileName}`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, {
        recursive: true,
      });
    }

    const previousImgPath = path.join(
      homeDir,
      `${appConstant.homeDirName}/${appConstant.homeDirFileName}/${fields.previousPath[0]}`
    );

    if (fs.existsSync(previousImgPath)) {
      fs.unlinkSync(previousImgPath);
    }

    const imgName = `${new Date().getTime()}-${fields.imgName[0]}`;

    const sourcePath = files.file[0].filepath;

    const filePath = path.join(dirPath, imgName);

    fs.copyFileSync(sourcePath, filePath);

    fs.unlinkSync(sourcePath);

    return res.status(200).json({ success: true, imgName });
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);

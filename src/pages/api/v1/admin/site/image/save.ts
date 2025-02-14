import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";

import { withMethods } from "@/lib/api-middlewares/with-method";
import path from "path";
import fs from "fs";
import os from "os";
import appConstant from "@/services/appConstant";
import { readFieldWithFile } from "@/lib/upload/utils";
import sharp from "sharp";
import { toIco } from "@/actions/pngToIco";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;
    const homeDir = os.homedir();
    const dirPath = path.join(homeDir, `${appConstant.homeDirName}/${appConstant.staticFileDirName}`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, {
        recursive: true,
      });
    }

    const isProfile = fields.hasOwnProperty("imageType") && fields.imageType[0] && fields.imageType[0] === "profile";

    if (isProfile) {
      const profileName = `${fields.imgName[0]}`;

      const profilePath = path.join(dirPath, profileName);

      const filePath = path.join(dirPath, profileName);
      const base64String = fields.base64Img[0];

      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

      fs.writeFile(profilePath, base64Data, { encoding: "base64" }, (err) => {
        if (err) {
          console.error("Error saving image:", err);
        } else {
        }
      });

      return res.status(200).json({ success: true, imgName: profileName });
    }

    const previousImgPath = path.join(
      homeDir,
      `${appConstant.homeDirName}/${appConstant.staticFileDirName}/${fields.previousPath[0]}`
    );
    if (fs.existsSync(previousImgPath) && fs.statSync(previousImgPath).isFile()) {
      fs.unlinkSync(previousImgPath);
    }

    const imgName = `${new Date().getTime()}-${fields.imgName[0]}`;
    const filePath = path.join(dirPath, imgName);

    const sourcePath = files.file[0].filepath;
    const isResize = fields.hasOwnProperty("resize") && fields.resize[0] && fields.resize[0] === "true";
    const isIcon = fields.hasOwnProperty("imageType") && fields.imageType[0] && fields.imageType[0] === "icon";

    let icoFileName = "favicon.ico";

    if (isIcon) {
      const icoFilePath = path.join(dirPath, icoFileName);
      const fileBuffer = await fs.promises.readFile(sourcePath);
      const image = sharp(fileBuffer);
      const icoBuffer = await toIco(image, [16, 32]);
      icoBuffer && fs.promises.writeFile(icoFilePath, new Uint8Array(icoBuffer));
    }

    if (isResize) {
      const imageBuffer = await fs.promises.readFile(sourcePath);
      const resizedImageBuffer = await sharp(imageBuffer).resize({ height: 40 }).png({ quality: 90 }).toBuffer();
      fs.promises.writeFile(filePath, new Uint8Array(resizedImageBuffer));
    } else {
      fs.copyFileSync(sourcePath, filePath);
      fs.unlinkSync(sourcePath);
    }

    return res.status(200).json({ success: true, imgName, icoFileName: isIcon ? icoFileName : false });
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["POST"], handler);

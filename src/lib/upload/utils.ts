import appConstant from "@/services/appConstant";
import { IncomingForm } from "formidable";
import fs from "fs";
import { NextApiRequest } from "next";
import os from "os";
import path from "path";

export async function mergeChunks(
  fileName: string,
  totalChunks: number,

  extention: string,

  filePath: string
) {
  const homeDir = os.homedir();

  const outFile = fs.createWriteStream(filePath);
  const dirPath = path.join(homeDir, `${appConstant.homeDirName}/${appConstant.staticFileDirName}`);
  for (let i = 0; i < totalChunks; i++) {
    const chunkFilePath = path.join(dirPath, `${fileName}.part${i}.${extention}`);
    const partStream = fs.createReadStream(chunkFilePath);

    await new Promise<void>((resolve, reject) => {
      partStream.pipe(outFile, { end: false });
      partStream.on("end", () => {
        fs.unlink(chunkFilePath, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  outFile.end();
}

export async function fetchImageBuffer(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export const saveToLocal = async (fileName: string, sourcePath: string): Promise<string> => {
  const homeDir = os.homedir();
  const dirPath = path.join(homeDir, `${appConstant.homeDirName}/${appConstant.staticFileDirName}`);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, {
      recursive: true,
    });
  }

  const filePath = path.join(dirPath, fileName);

  fs.copyFileSync(sourcePath, filePath);

  fs.unlinkSync(sourcePath);
  return filePath;
};

export const readFieldWithFile = (req: NextApiRequest) => {
  const form = new IncomingForm({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export const readFieldWithSingleFile = (req: NextApiRequest) => {
  const form = new IncomingForm({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

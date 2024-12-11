import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { UploadVideoObjectType } from "@/types/courses/Course";
import { uploadVideo } from "@/actions/courses";
import { APIResponse } from "@/types/apis";
import { readFieldWithFile } from "@/lib/upload/utils";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;
    if (files.file) {
      const name = fields.title[0].replaceAll(" ", "_");
      const objectId = Number(fields.objectId[0]);
      const objectType = fields.objectType[0] as UploadVideoObjectType;
      let response: APIResponse<any>;
      response = await uploadVideo(
        files.file[0],
        name,
        objectId,
        objectType,
        Number(fields.chunkIndex[0]),
        Number(fields.totalChunks[0])
      );
      return res
        .status(response.status)
        .json({ success: response.success, message: response.message, video: response.body });
    } else {
      return res.status(404).json({ success: false, message: "file not recieved" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: `${error}` });
  }
};

export default withMethods(["POST"], withUserAuthorized(handler));

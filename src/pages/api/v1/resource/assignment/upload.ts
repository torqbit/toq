import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";
import { UploadVideoObjectType } from "@/types/courses/Course";
import { uploadArchive, uploadVideo } from "@/actions/courses";
import { APIResponse } from "@/types/apis";
import { readFieldWithFile } from "@/lib/upload/utils";
import { FileObjectType } from "@/types/cms/common";
import { removeExtension } from "@/lib/utils";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;
    if (files.file) {
      let response: APIResponse<any>;
      response = await uploadArchive(
        files.file[0],
        removeExtension(files.file[0].originalFilename),
        FileObjectType.ARCHIVE,
        "assignment",
        fields?.existArchiveUrl[0]
      );
      return res
        .status(response.status)
        .json({ success: response.success, message: response.message, archiveUrl: response.body });
    } else {
      return res.status(404).json({ success: false, message: "file not recieved" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: `${error}` });
  }
};

export default withMethods(["POST"], withAuthentication(handler));

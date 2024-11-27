import { createSlug } from "@/lib/utils";
import { APIServerError } from "@/types/cms/apis";
import { BunnyRequestError, BunnyServerError, UnAuthorizedRequest, VideoLibrary, VideoLibraryResponse } from "@/types/cms/bunny";

export class BunnyClient {
  accessKey: string;
  constructor(accessKey: string) {
    this.accessKey = accessKey;
  }

  getClientHeaders = () => {
    return {
      accept: "application/json",
      "content-type": "application/json",
      AccessKey: this.accessKey,
    }
  }

  getClientFileOptions = (file: Buffer) => {
    return {
      method: "PUT",
      headers: { accept: "application/json", AccessKey: this.accessKey },
      body: file,
    }
  }

  handleError = async (response: Response): Promise<APIServerError> => {
    if (response.status == 400) {
      const reqError = (await response.json()) as BunnyRequestError;
      return new APIServerError(reqError.Message, response.status);
    } else {
      return new APIServerError("Failed to get response from Bunny Server");
    }
  }

  listVideoLibraries = async () => {
    const url = "https://api.bunny.net/videolibrary?page=1&perPage=1000&includeAccessKey=false";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        AccessKey: this.accessKey,
      },
    };

    try {
      const result = await fetch(url, options);

      if (result.status == 200) {
        const vidLibs = (await result.json()) as VideoLibrary[];
        return { status: result.status, items: vidLibs } as VideoLibraryResponse;
      } else if (result.status == 400) {
        const reqError = (await result.json()) as BunnyRequestError;
        return new APIServerError(reqError.Message, result.status);
      } else {
        return new APIServerError("Failed to get response from Bunny Server");
      }
    } catch (err: any) {
      return new APIServerError(err);
    }
  };

  createVideoLibrary = async (brandName: string, replicatedRegions: string[]): Promise<VideoLibrary | APIServerError> => {
    const url = "https://api.bunny.net/videolibrary";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        AccessKey: this.accessKey,
      },
      body: JSON.stringify({ Name: `${createSlug(brandName)}--videos`, ReplicationRegions: replicatedRegions }),
    };
    try {
      const result = await fetch(url, options);

      if (result.status == 200) {
        const vidLib = (await result.json()) as VideoLibrary;
        return vidLib;
      } else if (result.status == 401) {
        const authError = (await result.json()) as UnAuthorizedRequest;
        return new APIServerError(authError.Message, result.status);
      } else {
        return new APIServerError("Failed to get response from Bunny Server");
      }
    } catch (err: any) {
      return new APIServerError(err);
    }
  };

  uploadWatermark = async (file: Buffer, videoId: string): Promise<boolean | APIServerError> => {
    const url = `https://api.bunny.net/videolibrary/${videoId}/watermark`
    const result = await fetch(url, this.getClientFileOptions(file))
    if (result.status == 200) {
      return true
    } else {
      return await this.handleError(result)
    }

  }
}

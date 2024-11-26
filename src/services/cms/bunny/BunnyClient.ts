import { APIServerError } from "@/types/cms/apis";
import { BunnyServerError, UnAuthorizedRequest, VideoLibrary, VideoLibraryResponse } from "@/types/cms/bunny";

export class BunnyClient {
  accessKey: string;
  constructor(accessKey: string) {
    this.accessKey = accessKey;
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
}

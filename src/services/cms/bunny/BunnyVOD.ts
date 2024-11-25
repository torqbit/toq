import { getFetch } from "@/services/request";
import { VODService } from "../vod/VODService";

export interface BunnyConfig {
  accessKey: string;
}
export class BunnyVODService implements VODService<BunnyConfig> {
  providerName: string = "Bunny";
  saveConfiguration(config: BunnyConfig): Promise<Boolean> {
    const url = "https://api.bunny.net/region";
    const options = { method: "GET", headers: { accept: "application/json", AccessKey: config.accessKey } };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.error(err));
    throw new Error("Method not implemented.");
  }
}

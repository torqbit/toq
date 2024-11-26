import { BunnyClient } from "./BunnyClient";
import { BunnyServerError } from "@/types/cms/bunny";
import { APIServerError } from "@/types/cms/apis";
import { ICMSConfig, IContentProvider } from "../IContentProvider";

export interface BunnyConfig extends ICMSConfig {
  accessKey: string;
  secretKey: string;
}
export class BunnyCMS implements IContentProvider<BunnyConfig> {


  provider: string = "bunny.net";


  /**
   * 
   * @param config 
   * @returns true if Access Key is valid, throws error if it fails
   */
  testConfiguration(config: BunnyConfig): Promise<Boolean | APIServerError> {
    const bunny = new BunnyClient(config.accessKey);
    return bunny.listVideoLibraries().then(r => {
      if (r.status == 200) {
        return new Boolean(true)
      } else {
        return r as APIServerError;
      }
    }).catch(err => new APIServerError(err))
  }

  listReplicationRegions(): Promise<{ name: string; code: string; }[]> {
    return new Promise((resolve, reject) => {
      resolve([
        { name: "London, UK", code: "UK" },
        { name: "New York, US", code: "NY" },
        { name: "Sydney, Oceania", code: "SYD" },
        { name: "Singapore, Asia", code: "SG" },
        { name: "Johannesburg, Africa", code: "JH" },
        { name: "Sao Paulo, LATAM", code: "BR" },
        { name: "Los Angeles, US West", code: "LA" },
        { name: "Falkenstein, Europe", code: "DE" },
        { name: "Stockholm, Europe", code: "SY" },
      ])
    })
  }

}

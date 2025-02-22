import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";

import { withMethods } from "@/lib/api-middlewares/with-method";
import { getSiteConfig } from "@/services/getSiteConfig";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withUserAuthorized } from "@/lib/api-middlewares/with-authorized";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { site } = getSiteConfig();
    if (site) {
      return res.status(200).json({ success: true, siteConfig: site });
    } else {
      return res.status(404).json({ success: false, error: "Site config not found" });
    }
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(withUserAuthorized(handler)));

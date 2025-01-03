import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getCourseDetailedView } from "@/actions/courses";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { courseId } = req.query;
        const cdv = await getCourseDetailedView(Number(courseId));

        return res
            .status(cdv.status)
            .json(cdv);
    } catch (error) {
        return errorHandler(error, res);
    }
};

export default withMethods(["GET"], withAuthentication(handler));

import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { courseId } = req.query;
    const result = await prisma.$queryRaw<
      any[]
    >`  SELECT YEAR(createdAt) AS year, MONTHNAME(createdAt) AS month, COUNT(registrationId) users 
    FROM CourseRegistration WHERE courseId = ${Number(
      courseId
    )}  GROUP BY MONTHNAME(createdAt),MONTH(createdAt), YEAR(createdAt) ORDER BY MONTH(createdAt) `;
    const userData = result.map((r) => {
      return { year: r.year, month: r.month, users: Number(r.users) };
    });
    return res.status(200).json({
      info: false,
      success: true,
      message: "users enrolled in course by month successfully fetched",
      userData,
    });
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

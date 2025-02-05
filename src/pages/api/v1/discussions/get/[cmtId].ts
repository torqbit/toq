import prisma from "../../../../../lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const commentId = req.query?.cmtId;

    const rawData = await prisma.$queryRaw<any[]>`
    select dis.id, dis.userId, name, image,  comment, dis.createdAt, 
COUNT(thread.reply_id) as replyCount FROM Discussion as dis
INNER JOIN User ON dis.userId = User.id
LEFT OUTER JOIN ( SELECT id as reply_id, parentCommentId FROM Discussion) as thread
ON dis.id = thread.parentCommentId
WHERE dis.parentCommentId is NULL AND dis.id =${Number(commentId)}
GROUP BY dis.id, userId, comment, dis.createdAt

`;

    const comment = rawData.map((data) => {
      return {
        ...data,
        comment: data.comment,
        id: data.id,

        user: {
          id: data.userId,
          name: data.name,
          image: data.image,
        },
        createdAt: data.createdAt,
        replyCount: Number(data.replyCount),
      };
    });

    return res.status(200).json({ success: true, comment: comment[0], messsage: "Comment Found" });
  } catch (err) {
    return errorHandler(err, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

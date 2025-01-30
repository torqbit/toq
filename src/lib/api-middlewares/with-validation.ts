import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import * as z from "zod";
import type { ZodSchema } from "zod";

export default function withValidation<T extends ZodSchema>(
  schema: T,
  handler: NextApiHandler,
  query: boolean = false
) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      let data: any;
      if (query) {
        data = req.query ? req.query : {};
      } else {
        data = req.body ? req.body : {};
      }
      await schema.parse(data);
      return handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({ zodError: error.issues, error: "Field missing or invalid value" });
      }
      return res.status(422).end();
    }
  };
}

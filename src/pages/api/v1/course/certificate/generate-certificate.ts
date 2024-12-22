import prisma from "@/lib/prisma";
import { NextApiResponse, NextApiRequest } from "next";
import { errorHandler } from "@/lib/api-middlewares/errorHandler";
import { withMethods } from "@/lib/api-middlewares/with-method";
import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { getToken } from "next-auth/jwt";
import { getCookieName } from "@/lib/utils";
import { ContentManagementService } from "@/services/cms/ContentManagementService";
import { ICertificateInfo } from "@/types/courses/Course";
import { CeritificateService } from "@/services/certificate/CertificateService";
import { APIResponse } from "@/types/apis";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cms = new ContentManagementService();
    let cookieName = getCookieName();

    const { courseId } = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const cr = await prisma.courseRegistration.findFirst({
      where: {
        studentId: token?.id,
        order: {
          productId: Number(courseId)
        }
      },
      select: {
        registrationId: true,
        orderId: true,
        certificate: true,
        user: true
      }
    });

    if (cr) {
      if (cr.certificate != null) {
        return res.status(200).json(new APIResponse(true, 200, "Certificate already exists", { certificateIssueId: cr.certificate.id }));
      } else {
        await new CeritificateService().generateCourseCertificate(cr.registrationId, Number(courseId), cr.user.name).then((r) => {
          if (r.success) {
            return res.status(200).json({ ...r, certificateIssueId: r.body });
          } else {
            return res.status(400).json(r);
          }
        });
      }
    } else {
      return res.status(400).json(new APIResponse(false, 400, "No enrolment found for this course"));
    }



  } catch (error) {
    return errorHandler(error, res);
  }
}

export default withMethods(["GET"], withAuthentication(handler));

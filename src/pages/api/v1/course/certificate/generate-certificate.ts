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
import { getCourseAccessRole } from "@/actions/getCourseAccessRole";
import { Role } from "@prisma/client";
import { getLearningPathCourseStatus } from "@/actions/getLearningPathCourseStatus";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cms = new ContentManagementService();
    let cookieName = getCookieName();

    const { productId } = req.query;
    const token = await getToken({
      req,
      secret: process.env.NEXT_PUBLIC_SECRET,
      cookieName,
    });

    const hasAccess = await getCourseAccessRole(token?.role, token?.id, Number(productId));
    let pId = hasAccess.productId;
    const cr = await prisma.courseRegistration.findFirst({
      where: {
        studentId: token?.id,
        order: {
          productId: pId,
        },
      },
      select: {
        registrationId: true,
        user: {
          select: {
            name: true,
          },
        },
        certificate: {
          select: {
            productId: true,
            id: true,
          },
        },
      },
    });
    let updateRegistration = true;
    if (hasAccess.isLearningPath) {
      const getLearningStatus = await getLearningPathCourseStatus(pId, String(token?.id));
      if (getLearningStatus.body && getLearningStatus.body.length > 0) {
        let TotalCompleted = getLearningStatus.body.filter(
          (f) => f.watchedLesson > 0 && f.totalLessons === f.watchedLesson
        );
        updateRegistration = TotalCompleted.length == getLearningStatus.body.length;
      } else {
        updateRegistration = false;
      }
    }

    if (hasAccess.role === Role.STUDENT) {
      const isExist = cr?.certificate.find((c) => c.productId === Number(productId));
      if (isExist) {
        return res
          .status(200)
          .json(new APIResponse(true, 200, "Certificate already exists", { certificateIssueId: isExist.id }));
      } else {
        cr?.registrationId &&
          (await new CeritificateService()
            .generateCourseCertificate(cr.registrationId, Number(productId), cr.user.name, updateRegistration)
            .then((r) => {
              if (r.success) {
                return res.status(200).json({ ...r, certificateIssueId: r.body });
              } else {
                return res.status(400).json(r);
              }
            }));
      }
    } else {
      return res.status(400).json(new APIResponse(false, 400, "No enrolment found for this course"));
    }
  } catch (error) {
    return errorHandler(error, res);
  }
};

export default withMethods(["GET"], withAuthentication(handler));

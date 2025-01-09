import prisma from "@/lib/prisma";
import { compareByPercentage } from "@/lib/utils";
import { APIResponse } from "@/types/apis";
import {
  IEarningResponse,
  IEarningStats,
  IEnrollmentResponse,
  IEnrollmentStats,
  IUsersResponse,
  IUsersStats,
} from "@/types/courses/analytics";
import { orderStatus, Role } from "@prisma/client";

class Analytics {
  async getTotalEarning(): Promise<APIResponse<IEarningResponse>> {
    const result = await prisma.$queryRaw<IEarningStats[]>` 
    SELECT 
    (SELECT COALESCE(SUM(amount), 0) FROM \`Order\` WHERE  orderStatus = ${orderStatus.SUCCESS}) AS totalEarnings,
    (SELECT COALESCE(SUM(amount), 0) 
     FROM \`Order\` 
     WHERE createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND orderStatus = ${orderStatus.SUCCESS} ) AS currentMonthEarnings,
    (SELECT COALESCE(SUM(amount), 0) 
     FROM \`Order\`
     WHERE createdAt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(CURDATE(), '%Y-%m-01') AND orderStatus = ${orderStatus.SUCCESS}) AS previousMonthEarnings `;

    return new APIResponse(true, 200, "", {
      totalEarning: result[0].totalEarnings,
      comparedPercentage: compareByPercentage(result[0].currentMonthEarnings, result[0].previousMonthEarnings),
    });
  }
  async getTotalEnrollments(): Promise<APIResponse<IEnrollmentResponse>> {
    const enrollmentsResult = await prisma.$queryRaw<IEnrollmentStats[]>`
    SELECT 
    (SELECT COALESCE(COUNT(*), 0) 
     FROM CourseRegistration) AS totalEnrollment,

    (SELECT COALESCE(COUNT(*), 0) 
     FROM CourseRegistration 
     WHERE createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')) AS currentMonthEnrollment,

    (SELECT COALESCE(COUNT(*), 0) 
     FROM CourseRegistration 
     WHERE createdAt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(CURDATE(), '%Y-%m-01')) AS previousMonthEnrollment;

   `;

    return new APIResponse(true, 200, "", {
      totalEnrollment: Number(enrollmentsResult[0].totalEnrollment),
      comparedPercentage: compareByPercentage(
        Number(enrollmentsResult[0].currentMonthEnrollment),
        Number(enrollmentsResult[0].previousMonthEnrollment)
      ),
    });
  }

  async getTotalUsers(): Promise<APIResponse<IUsersResponse>> {
    const usersResult = await prisma.$queryRaw<IUsersStats[]>`
    SELECT 
    (SELECT COALESCE(COUNT(*), 0) 
     FROM User WHERE  role = ${Role.STUDENT}) AS totalUsers,

    (SELECT COALESCE(COUNT(*), 0) 
     FROM User 
     WHERE createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND  role = ${Role.STUDENT}) AS currentMonthUsers,

    (SELECT COALESCE(COUNT(*), 0) 
     FROM User 
     WHERE createdAt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(CURDATE(), '%Y-%m-01') AND  role = ${Role.STUDENT}) AS previousMonthUsers ;

   `;

    return new APIResponse(true, 200, "", {
      totalUsers: Number(usersResult[0].totalUsers),
      comparedPercentage: compareByPercentage(
        Number(usersResult[0].currentMonthUsers),
        Number(usersResult[0].previousMonthUsers)
      ),
    });
  }
}

export default new Analytics();

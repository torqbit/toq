import prisma from "@/lib/prisma";
import { compareByPercentage } from "@/lib/utils";
import appConstant from "@/services/appConstant";
import { APIResponse } from "@/types/apis";
import {
  AnalyticsDuration,
  IAnalyticResponse,
  IEarningResponse,
  IEnrollmentResponse,
  IResponseStats,
  IUsersResponse,
} from "@/types/courses/analytics";
import { orderStatus, Role } from "@prisma/client";
class Analytics {
  async getTotalEarning(): Promise<APIResponse<IEarningResponse>> {
    const result = await prisma.$queryRaw<IResponseStats[]>` 
    SELECT 
    (SELECT COALESCE(SUM(amount), 0) FROM \`Order\` WHERE  orderStatus = ${orderStatus.SUCCESS}) AS total,
    (SELECT COALESCE(SUM(amount), 0) 
     FROM \`Order\` 
     WHERE createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND orderStatus = ${orderStatus.SUCCESS} ) AS current,
    (SELECT COALESCE(SUM(amount), 0) 
     FROM \`Order\`
     WHERE createdAt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(CURDATE(), '%Y-%m-01') AND orderStatus = ${orderStatus.SUCCESS}) AS previous`;

    return new APIResponse(true, 200, "", {
      totalEarning: result[0].total,
      comparedPercentage: compareByPercentage(result[0].current, result[0].previous),
    });
  }
  async getTotalEnrollments(): Promise<APIResponse<IEnrollmentResponse>> {
    const enrollmentsResult = await prisma.$queryRaw<IResponseStats[]>`
    SELECT 
    (SELECT COALESCE(COUNT(*), 0) 
     FROM CourseRegistration) AS total,

    (SELECT COALESCE(COUNT(*), 0) 
     FROM CourseRegistration 
     WHERE createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')) AS current,

    (SELECT COALESCE(COUNT(*), 0) 
     FROM CourseRegistration 
     WHERE createdAt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(CURDATE(), '%Y-%m-01')) AS previous;

   `;

    return new APIResponse(true, 200, "", {
      totalEnrollment: Number(enrollmentsResult[0].total),
      comparedPercentage: compareByPercentage(
        Number(enrollmentsResult[0].current),
        Number(enrollmentsResult[0].previous)
      ),
    });
  }
  async getTotalUsers(): Promise<APIResponse<IUsersResponse>> {
    const usersResult = await prisma.$queryRaw<IResponseStats[]>`
    SELECT 
    (SELECT COALESCE(COUNT(*), 0) 
     FROM User WHERE  role = ${Role.STUDENT}) AS total,

    (SELECT COALESCE(COUNT(*), 0) 
     FROM User 
     WHERE createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND  role = ${Role.STUDENT}) AS current,

    (SELECT COALESCE(COUNT(*), 0) 
     FROM User 
     WHERE createdAt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(CURDATE(), '%Y-%m-01') AND  role = ${Role.STUDENT}) AS previous ;

   `;

    return new APIResponse(true, 200, "", {
      totalUsers: Number(usersResult[0].total),
      comparedPercentage: compareByPercentage(Number(usersResult[0].current), Number(usersResult[0].previous)),
    });
  }
  getDateCondition(duration: AnalyticsDuration) {
    const currentDate = new Date();

    // Switch case to handle different durations
    switch (duration) {
      case "month":
        // For monthly, get the current month
        return {
          startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),

          // For previous month
          previousStartDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
          previousEndDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 0),
        };
        break;

      case "quarter":
        const quarterStartMonth = Math.floor(currentDate.getMonth() / 3) * 3;
        const prevQuarterStartMonth = Math.floor((currentDate.getMonth() - 3) / 3) * 3;
        return {
          startDate: new Date(currentDate.getFullYear(), quarterStartMonth, 1),
          endDate: new Date(currentDate.getFullYear(), quarterStartMonth + 3, 0),

          // For previous month
          previousStartDate: new Date(currentDate.getFullYear(), prevQuarterStartMonth, 1),
          previousEndDate: new Date(currentDate.getFullYear(), prevQuarterStartMonth + 3, 0),
        };

      case "year":
        // For yearly, get the current year

        return {
          startDate: new Date(currentDate.getFullYear(), 0, 1),
          endDate: new Date(currentDate.getFullYear(), 12, 0),

          // For previous month
          previousStartDate: new Date(currentDate.getFullYear() - 1, 0, 1),
          previousEndDate: new Date(currentDate.getFullYear() - 1, 12, 0),
        };

      default:
        return {
          startDate: "",
          endDate: "",

          // For previous month
          previousStartDate: "",
          previousEndDate: "",
        };
    }
  }
  async getEarnings(duration: AnalyticsDuration): Promise<APIResponse<IAnalyticResponse>> {
    const currentDetail = await prisma.order.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        orderStatus: orderStatus.SUCCESS,

        createdAt: {
          gte: this.getDateCondition(duration).startDate,
          lte: this.getDateCondition(duration).endDate,
        },
      },
    });

    const previousDetail = await prisma.order.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        orderStatus: orderStatus.SUCCESS,
        createdAt: {
          gte: this.getDateCondition(duration).previousStartDate,
          lte: this.getDateCondition(duration).previousEndDate,
        },
      },
    });

    return new APIResponse(true, 200, "", {
      info: {
        total: `${currentDetail._sum.amount || 0}`,
        type: "Earnings",
        comparedPercentage: compareByPercentage(currentDetail._sum.amount || 0, previousDetail._sum.amount || 0),
      },
      data: [
        {
          id: "line",

          data: [
            {
              x: this.getDateCondition(duration).previousStartDate.toLocaleString(
                "default",
                duration === "year" ? { year: "numeric" } : { month: "long" }
              ),
              y: Number(previousDetail._sum.amount),
            },
            {
              x: this.getDateCondition(duration).startDate.toLocaleString(
                "default",
                duration === "year" ? { year: "numeric" } : { month: "long" }
              ),
              y: Number(currentDetail._sum.amount),
            },
          ],
        },
      ],
    });
  }
}

export default new Analytics();

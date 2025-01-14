import { getDummyArray } from "@/lib/dummyData";
import prisma from "@/lib/prisma";
import { compareByPercentage } from "@/lib/utils";
import appConstant from "@/services/appConstant";
import { APIResponse } from "@/types/apis";
import {
  AnalyticsDuration,
  IAnalyticResponse,
  IAnalyticStats,
  IEarningResponse,
  IEnrollmentResponse,
  IResponseStats,
  IUsersResponse,
} from "@/types/courses/analytics";
import { orderStatus, Role } from "@prisma/client";
class Analytics {
  async getOverviewDetails(): Promise<APIResponse<IAnalyticStats[]>> {
    const earningDetail = await this.getTotalEarning();
    const enrollmentDetail = await this.getTotalEnrollments();
    const usersDetail = await this.getTotalUsers();

    let overviewStats: IAnalyticStats[] = [
      {
        type: "Earnings",
        total: `${earningDetail.body?.totalEarning}`,
        comparedPercentage: Number(earningDetail.body?.comparedPercentage),
      },
      {
        type: "Enrollments",
        total: `${enrollmentDetail.body?.totalEnrollment}`,
        comparedPercentage: Number(enrollmentDetail.body?.comparedPercentage),
      },
      {
        type: "Users",
        total: `${usersDetail.body?.totalUsers}`,
        comparedPercentage: Number(usersDetail.body?.comparedPercentage),
      },
    ];

    if (earningDetail.success && enrollmentDetail.success && usersDetail.success) {
      return new APIResponse(true, 200, "Overview has been fetched successfully", overviewStats);
    } else {
      return new APIResponse(false, 404, "Overview stats not found");
    }
  }

  async getTotalEarning(): Promise<APIResponse<IEarningResponse>> {
    const result = await prisma.$queryRaw<IResponseStats[]>` 
    SELECT 
    (SELECT COALESCE(SUM(amount), 0) FROM \`Order\` WHERE  orderStatus = ${orderStatus.SUCCESS}) AS total,
    (SELECT COALESCE(SUM(amount), 0) 
     FROM \`Order\` 
     WHERE updatedAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
     AND updatedAt < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND orderStatus = ${orderStatus.SUCCESS} ) AS current,
    (SELECT COALESCE(SUM(amount), 0) 
     FROM \`Order\`
     WHERE updatedAt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
     AND updatedAt < DATE_FORMAT(CURDATE(), '%Y-%m-01') AND orderStatus = ${orderStatus.SUCCESS}) AS previous`;

    if (result.length > 0) {
      return new APIResponse(true, 200, "", {
        totalEarning: result[0].total,
        comparedPercentage: compareByPercentage(result[0].current, result[0].previous),
      });
    } else {
      return new APIResponse(true, 200, "Earnings Data not found", {
        totalEarning: 0,
        comparedPercentage: 0,
      });
    }
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

    if (enrollmentsResult.length > 0) {
      return new APIResponse(true, 200, "", {
        totalEnrollment: Number(enrollmentsResult[0].total),
        comparedPercentage: compareByPercentage(
          Number(enrollmentsResult[0].current),
          Number(enrollmentsResult[0].previous)
        ),
      });
    } else {
      return new APIResponse(true, 200, "Enrollment Data not found", {
        totalEnrollment: 0,
        comparedPercentage: 0,
      });
    }
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
    if (usersResult.length > 0) {
      return new APIResponse(true, 200, "", {
        totalUsers: Number(usersResult[0].total),
        comparedPercentage: compareByPercentage(Number(usersResult[0].current), Number(usersResult[0].previous)),
      });
    } else {
      return new APIResponse(true, 200, "User Data not found", {
        totalUsers: 0,
        comparedPercentage: 0,
      });
    }
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

  async getEarningsByDurtaion(duration: AnalyticsDuration): Promise<APIResponse<IAnalyticResponse>> {
    const transactions = await prisma.order.groupBy({
      by: ["updatedAt"],
      where: {
        orderStatus: orderStatus.SUCCESS,
        updatedAt: {
          gte: this.getDateCondition(duration).startDate,
          lte: this.getDateCondition(duration).endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    let data: { x: string; y: number }[] = [];

    switch (duration) {
      case "month":
        data = await this.generateMonthlyData(
          transactions.map((t) => {
            return {
              amount: t._sum.amount || 0,
              createdAt: t.updatedAt,
            };
          })
        );

        break;

      case "quarter":
        data = await this.generateQuarterlyData(
          transactions.map((t) => {
            return {
              amount: t._sum.amount || 0,
              createdAt: t.updatedAt,
            };
          })
        );
        break;
      case "year":
        data = await this.generateYearlyData(
          transactions.map((t) => {
            return {
              amount: t._sum.amount || 0,
              createdAt: t.updatedAt,
            };
          })
        );
        break;

      default:
        break;
    }

    let totalAmount = transactions.map((t) => t._sum.amount).reduce((sum, amount) => Number(sum) + Number(amount), 0);

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
        total: `${totalAmount || 0}`,
        type: "Earnings",
        comparedPercentage: compareByPercentage(totalAmount || 0, previousDetail._sum.amount || 0),
      },
      data: [
        {
          id: "line",
          data,
        },
      ],
    });
  }

  async generateMonthlyData(transactions: { amount: number; createdAt: Date }[]) {
    const totalDaysInMonth = new Date(
      new Date(this.getDateCondition("month").startDate).getFullYear(),
      new Date(this.getDateCondition("month").startDate).getMonth() + 1,
      0
    ).getDate();

    const allDaysArray = Array.from({ length: totalDaysInMonth }, (_, i) => ({
      date: (i + 1).toString(),
      amount: 0,
    }));

    transactions.forEach((transaction) => {
      const day = transaction.createdAt.getDate().toString();
      const amount = transaction.amount;

      const dayIndex = allDaysArray.findIndex((item) => item.date === day);
      if (dayIndex !== -1) {
        allDaysArray[dayIndex].amount = Number(amount);
      }
    });

    return allDaysArray.map((item) => ({
      x: item.date,
      y: item.amount,
    }));
  }

  async generateQuarterlyData(transactions: { amount: number; createdAt: Date }[]) {
    const currentQuarterMonths = this.getQuarterMonths(new Date(this.getDateCondition("quarter").startDate));

    // Initialize the result array for the quarter
    const result = currentQuarterMonths.map((month) => {
      const monthTransactions = transactions.filter((transaction) => transaction.createdAt.getMonth() === month.index);

      const totalAmount = monthTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        x: month.name,
        y: totalAmount,
      };
    });

    return result;
  }

  async generateYearlyData(transactions: { amount: number; createdAt: Date }[]) {
    const result = Array.from({ length: 12 }, (_, i) => {
      const monthTransactions = transactions.filter((transaction) => transaction.createdAt.getMonth() === i);

      const totalAmount = monthTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        x: new Date(0, i).toLocaleString("default", { month: "short" }),
        y: totalAmount,
      };
    });

    return result;
  }

  getQuarterMonths(startDate: Date) {
    const month = startDate.getMonth();
    let quarterStartMonth = Math.floor(month / 3) * 3;

    return [
      { name: new Date(0, quarterStartMonth).toLocaleString("default", { month: "long" }), index: quarterStartMonth },
      {
        name: new Date(0, quarterStartMonth + 1).toLocaleString("default", { month: "long" }),
        index: quarterStartMonth + 1,
      },
      {
        name: new Date(0, quarterStartMonth + 2).toLocaleString("default", { month: "long" }),
        index: quarterStartMonth + 2,
      },
    ];
  }

  async getEnrollment(duration: AnalyticsDuration): Promise<APIResponse<IAnalyticResponse>> {
    const enrollments = await prisma.courseRegistration.groupBy({
      by: ["dateJoined"],
      where: {
        dateJoined: {
          gte: this.getDateCondition(duration).startDate,
          lte: this.getDateCondition(duration).endDate,
        },
      },
      _count: {
        studentId: true,
      },
    });

    let data: { x: string; y: number }[] = [];

    switch (duration) {
      case "month":
        data = await this.generateMonthlyData(
          enrollments.map((t) => {
            return {
              amount: t._count.studentId || 0,
              createdAt: t.dateJoined,
            };
          })
        );

        break;

      case "quarter":
        data = await this.generateQuarterlyData(
          enrollments.map((t) => {
            return {
              amount: t._count.studentId || 0,
              createdAt: t.dateJoined,
            };
          })
        );
        break;
      case "year":
        data = await this.generateYearlyData(
          enrollments.map((t) => {
            return {
              amount: t._count.studentId || 0,
              createdAt: t.dateJoined,
            };
          })
        );
        break;

      default:
        break;
    }

    let totalAmount = enrollments
      .map((t) => t._count.studentId)
      .reduce((sum, amount) => Number(sum) + Number(amount), 0);

    const previousDetail = await prisma.courseRegistration.aggregate({
      _count: {
        studentId: true,
      },
      where: {
        dateJoined: {
          gte: this.getDateCondition(duration).previousStartDate,
          lte: this.getDateCondition(duration).previousEndDate,
        },
      },
    });

    return new APIResponse(true, 200, "", {
      info: {
        total: `${totalAmount || 0}`,
        type: "Enrollments",
        comparedPercentage: compareByPercentage(totalAmount || 0, previousDetail._count.studentId || 0),
      },
      data: [
        {
          id: "line",
          data,
        },
      ],
    });
  }
  async getUserDetailByDuration(duration: AnalyticsDuration): Promise<APIResponse<IAnalyticResponse>> {
    const users = await prisma.user.groupBy({
      by: ["createdAt"],
      where: {
        dateJoined: {
          gte: this.getDateCondition(duration).startDate,
          lte: this.getDateCondition(duration).endDate,
        },
      },
      _count: {
        id: true,
      },
    });

    let data: { x: string; y: number }[] = [];

    switch (duration) {
      case "month":
        data = await this.generateMonthlyData(
          users.map((t) => {
            return {
              amount: t._count.id || 0,
              createdAt: t.createdAt,
            };
          })
        );

        break;

      case "quarter":
        data = await this.generateQuarterlyData(
          users.map((t) => {
            return {
              amount: t._count.id || 0,
              createdAt: t.createdAt,
            };
          })
        );
        break;
      case "year":
        data = await this.generateYearlyData(
          users.map((t) => {
            return {
              amount: t._count.id || 0,
              createdAt: t.createdAt,
            };
          })
        );
        break;

      default:
        break;
    }

    let totalAmount = users.map((t) => t._count.id).reduce((sum, amount) => Number(sum) + Number(amount), 0);

    const previousDetail = await prisma.courseRegistration.aggregate({
      _count: {
        studentId: true,
      },
      where: {
        dateJoined: {
          gte: this.getDateCondition(duration).previousStartDate,
          lte: this.getDateCondition(duration).previousEndDate,
        },
      },
    });

    return new APIResponse(true, 200, "", {
      info: {
        total: `${totalAmount || 0}`,
        type: "Users",
        comparedPercentage: compareByPercentage(totalAmount || 0, previousDetail._count.studentId || 0),
      },
      data: [
        {
          id: "line",
          data,
        },
      ],
    });
  }
}

export default new Analytics();

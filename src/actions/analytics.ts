import prisma from "@/lib/prisma";
import { compareByPercentage, getFormattedDate } from "@/lib/utils";
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
import { gatewayProvider, orderStatus, Role } from "@prisma/client";
import { getCurrency } from "./getCurrency";
class Analytics {
  async getOverviewDetails(): Promise<APIResponse<IAnalyticStats[]>> {
    const earningDetail = await this.getTotalEarning();
    const enrollmentDetail = await this.getTotalEnrollments();
    const usersDetail = await this.getTotalUsers();
    const currency = await getCurrency(gatewayProvider.CASHFREE);

    let overviewStats: IAnalyticStats[] = [
      {
        type: "Earnings",
        total: `${earningDetail.body?.totalEarning}`,
        comparedPercentage: Number(earningDetail.body?.comparedPercentage),
        currency,
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

  async getOverviewDetailsByProduct(productId: number): Promise<APIResponse<IAnalyticStats[]>> {
    const earningDetail = await this.getEarningByProduct(productId);
    const enrollmentDetail = await this.getEnrollmentsByProduct(productId);
    const usersDetail = await this.getActiveUsersByProduct(productId);
    const currency = await getCurrency(gatewayProvider.CASHFREE);

    let overviewStats: IAnalyticStats[] = [
      {
        type: "Earnings",
        total: `${earningDetail.body?.totalEarning}`,
        comparedPercentage: Number(earningDetail.body?.comparedPercentage),
        currency,
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
  async getEarningByProduct(productId: number): Promise<APIResponse<IEarningResponse>> {
    const result = await prisma.$queryRaw<IResponseStats[]>`
    SELECT 
      (SELECT COALESCE(SUM(amount), 0) 
       FROM \`Order\` 
       WHERE orderStatus = ${orderStatus.SUCCESS} AND productId = ${productId}) AS total,
  
      (SELECT COALESCE(SUM(amount), 0) 
       FROM \`Order\` 
       WHERE updatedAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01')  
       AND updatedAt < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
       AND orderStatus = ${orderStatus.SUCCESS} 
       AND productId = ${productId}) AS current,
  
      (SELECT COALESCE(SUM(amount), 0) 
       FROM \`Order\`
       WHERE updatedAt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
       AND updatedAt < DATE_FORMAT(CURDATE(), '%Y-%m-01') 
       AND orderStatus = ${orderStatus.SUCCESS} 
       AND productId = ${productId}) AS previous;
  `;

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
  async getEnrollmentsByProduct(productId: number): Promise<APIResponse<IEnrollmentResponse>> {
    const enrollmentsResult = await prisma.$queryRaw<IResponseStats[]>`
    SELECT 
      (SELECT COALESCE(COUNT(*), 0) 
       FROM \`Order\` 
       WHERE productId = ${productId} AND orderStatus = ${orderStatus.SUCCESS}) AS total,
  
      (SELECT COALESCE(COUNT(*), 0) 
       FROM \`Order\` 
       WHERE createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
       AND createdAt < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
       AND productId = ${productId} 
       AND orderStatus = ${orderStatus.SUCCESS}) AS current,
  
      (SELECT COALESCE(COUNT(*), 0) 
       FROM \`Order\` 
       WHERE createdAt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
       AND createdAt < DATE_FORMAT(CURDATE(), '%Y-%m-01') 
       AND productId = ${productId} 
       AND orderStatus = ${orderStatus.SUCCESS}) AS previous;
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
  async getActiveUsersByProduct(productId: number): Promise<APIResponse<IUsersResponse>> {
    const usersResult = await prisma.$queryRaw<IResponseStats[]>`
    SELECT 
    (SELECT COALESCE(COUNT(*), 0) 
     FROM CourseProgress 
     WHERE createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') AND courseId = ${productId}   ) AS current,

    (SELECT COALESCE(COUNT(*), 0) 
     FROM CourseProgress 
     WHERE createdAt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
     AND createdAt < DATE_FORMAT(CURDATE(), '%Y-%m-01') AND courseId = ${productId} ) AS previous ;

   `;
    if (usersResult.length > 0) {
      return new APIResponse(true, 200, "", {
        totalUsers: Number(usersResult[0].current),
        comparedPercentage: compareByPercentage(Number(usersResult[0].current), Number(usersResult[0].previous)),
      });
    } else {
      return new APIResponse(true, 200, "User Data not found", {
        totalUsers: 0,
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
    const transactionQuery = async (duration: AnalyticsDuration) => {
      switch (duration) {
        case "month":
          return await prisma.$queryRaw<{ amount: number; createdAt: string }[]>`
    SELECT 
    DATE(paymentTime) AS createdAt,
     SUM(amount) AS amount
     FROM 
    \`Order\`
     WHERE 
     paymentTime >= ${getFormattedDate(
       new Date(this.getDateCondition(duration).startDate)
     )} AND paymentTime <= ${getFormattedDate(new Date(this.getDateCondition(duration).endDate))}
     GROUP BY 
     DATE(paymentTime);
       `;

        default:
          return await prisma.$queryRaw<{ amount: number; createdAt: string }[]>`
       SELECT 
      MONTH(paymentTime) AS createdAt,
      SUM(amount) AS amount
      FROM 
      \`Order\`
      WHERE 
       paymentTime >= ${getFormattedDate(
         new Date(this.getDateCondition(duration).startDate)
       )} AND paymentTime <= ${getFormattedDate(new Date(this.getDateCondition(duration).endDate))}
      GROUP BY 
      MONTH(paymentTime);
 `;
      }
    };

    const transactions = await transactionQuery(duration);

    let data: { x: string; y: number }[] = [];

    switch (duration) {
      case "month":
        data = await this.generateMonthlyData(
          transactions.map((t) => {
            return {
              amount: t.amount || 0,
              createdAt: new Date(t.createdAt) || new Date(),
            };
          })
        );

        break;

      case "quarter":
        data = await this.generateQuarterlyData(
          transactions.map((t) => {
            let orderDate = new Date(`${t.createdAt}-01`);
            return {
              amount: t.amount || 0,
              createdAt: t.createdAt ? orderDate : new Date(),
            };
          })
        );
        break;
      case "year":
        data = await this.generateYearlyData(
          transactions.map((t) => {
            let orderDate = new Date(`${t.createdAt}-01`);

            return {
              amount: t.amount || 0,
              createdAt: t.createdAt && orderDate ? orderDate : new Date(),
            };
          })
        );
        break;

      default:
        break;
    }

    let totalAmount = transactions.map((t) => t.amount).reduce((sum, amount) => Number(sum) + Number(amount), 0);

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
      currency: await getCurrency(gatewayProvider.CASHFREE),
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
        allDaysArray[dayIndex].amount += Number(amount);
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
    const enrollmentQuery = async (duration: AnalyticsDuration) => {
      switch (duration) {
        case "month":
          return await prisma.$queryRaw<{ total: number; enrollDate: string }[]>`
      SELECT 
      DATE(dateJoined) AS enrollDate,
       COUNT(studentId) AS total
       FROM 
       CourseRegistration
       WHERE 
       dateJoined >= ${getFormattedDate(
         new Date(this.getDateCondition(duration).startDate)
       )} AND dateJoined <= ${getFormattedDate(new Date(this.getDateCondition(duration).endDate))}
       GROUP BY 
       DATE(dateJoined);
         `;

        default:
          return await prisma.$queryRaw<{ total: number; enrollDate: string }[]>`
         SELECT 
        MONTH(dateJoined) AS enrollDate,
        COUNT(studentId) AS total
        FROM 
        CourseRegistration
        WHERE 
        dateJoined >= ${getFormattedDate(
          new Date(this.getDateCondition(duration).startDate)
        )} AND dateJoined <= ${getFormattedDate(new Date(this.getDateCondition(duration).endDate))}
        GROUP BY 
        MONTH(dateJoined);
   `;
      }
    };

    const enrollments = await enrollmentQuery(duration);

    let data: { x: string; y: number }[] = [];

    switch (duration) {
      case "month":
        data = await this.generateMonthlyData(
          enrollments.map((t) => {
            return {
              amount: t.total || 0,
              createdAt: new Date(t.enrollDate),
            };
          })
        );

        break;

      case "quarter":
        data = await this.generateQuarterlyData(
          enrollments.map((t) => {
            let orderDate = new Date(`${t.enrollDate}-01`);

            return {
              amount: Number(t.total) || 0,
              createdAt: t.enrollDate && orderDate ? orderDate : new Date(),
            };
          })
        );
        break;
      case "year":
        data = await this.generateYearlyData(
          enrollments.map((t) => {
            let orderDate = new Date(`${t.enrollDate}-01`);

            return {
              amount: Number(t.total) || 0,
              createdAt: t.enrollDate && orderDate ? orderDate : new Date(),
            };
          })
        );
        break;

      default:
        break;
    }

    let totalAmount = enrollments.map((t) => t.total).reduce((sum, amount) => Number(sum) + Number(amount), 0);

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
    const userQuery = async (duration: AnalyticsDuration) => {
      switch (duration) {
        case "month":
          return await prisma.$queryRaw<{ total: number; createdAt: string }[]>`
      SELECT 
      DATE(createdAt) AS createdAt ,
       COUNT(id) AS total
       FROM 
       User
       WHERE 
       createdAt >= ${getFormattedDate(
         new Date(this.getDateCondition(duration).startDate)
       )} AND createdAt <= ${getFormattedDate(new Date(this.getDateCondition(duration).endDate))}
       GROUP BY 
       DATE(createdAt);
         `;

        default:
          return await prisma.$queryRaw<{ total: number; createdAt: string }[]>`
         SELECT 
        MONTH(createdAt) AS createdAt,
        COUNT(id) AS total
        FROM 
        User
        WHERE 
        createdAt >= ${getFormattedDate(
          new Date(this.getDateCondition(duration).startDate)
        )} AND createdAt <= ${getFormattedDate(new Date(this.getDateCondition(duration).endDate))}
        GROUP BY 
        MONTH(createdAt);
   `;
      }
    };

    const users = await userQuery(duration);

    let data: { x: string; y: number }[] = [];

    switch (duration) {
      case "month":
        data = await this.generateMonthlyData(
          users.map((t) => {
            return {
              amount: Number(t.total) || 0,
              createdAt: new Date(t.createdAt),
            };
          })
        );

        break;

      case "quarter":
        data = await this.generateQuarterlyData(
          users.map((t) => {
            let orderDate = new Date(`${t.createdAt}-01`);

            return {
              amount: Number(t.total) || 0,
              createdAt: t.createdAt && orderDate ? orderDate : new Date(),
            };
          })
        );
        break;
      case "year":
        data = await this.generateYearlyData(
          users.map((t) => {
            let orderDate = new Date(`${t.createdAt}-01`);

            return {
              amount: Number(t.total) || 0,
              createdAt: t.createdAt && orderDate ? orderDate : new Date(),
            };
          })
        );
        break;

      default:
        break;
    }

    let totalAmount = users.map((t) => t.total).reduce((sum, amount) => Number(sum) + Number(amount), 0);

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

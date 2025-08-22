import prisma from "@/lib/prisma";
import {
  compareByPercentage,
  generateMonthlyData,
  generateQuarterlyData,
  generateYearlyData,
  getDateCondition,
  getFormattedDate,
} from "@/lib/utils";
import { APIResponse } from "@/types/apis";
import { AnalyticsDuration, IAnalyticResponse, IAnalyticStats } from "@/types/courses/analytics";

class AdminAnalytics {
  getTenantStats = async () => {
    const stats = await prisma.$queryRaw<any[]>`
    SELECT 
      (SELECT COUNT(*) FROM Tenant) as totalTenants,
      (
        SELECT COUNT(*) 
        FROM Tenant 
        WHERE YEAR(createdAt) = YEAR(CURRENT_DATE())
        AND MONTH(createdAt) = MONTH(CURRENT_DATE())
      ) as tenantsThisMonth,
      (
        SELECT COUNT(*) 
        FROM Tenant 
        WHERE YEAR(createdAt) = YEAR(
          CASE 
            WHEN MONTH(CURRENT_DATE()) = 1 
            THEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
            ELSE CURRENT_DATE() 
          END
        )
        AND MONTH(createdAt) = 
          CASE 
            WHEN MONTH(CURRENT_DATE()) = 1 THEN 12
            ELSE MONTH(CURRENT_DATE()) - 1 
          END
      ) as tenantsLastMonth
  `;

    return {
      totalTenants: Number(stats[0].totalTenants),
      growth: compareByPercentage(Number(stats[0].tenantsThisMonth), Number(stats[0].tenantsLastMonth)),
    };
  };

  getAssistantMessageStats = async () => {
    const stats = await prisma.$queryRaw<any[]>`
    SELECT 
      -- Total messages
      (SELECT COUNT(*) FROM assistant_messages WHERE role = "SYSTEM") as totalMessages,

      -- Messages this month
      (
        SELECT COUNT(*) 
        FROM assistant_messages
        WHERE 
         role = "SYSTEM" AND
        YEAR(createdAt) = YEAR(CURRENT_DATE())
        AND MONTH(createdAt) = MONTH(CURRENT_DATE())
      ) as messagesThisMonth,

      -- Messages last month
      (
        SELECT COUNT(*) 
        FROM assistant_messages
        WHERE
         role = "SYSTEM" AND
         YEAR(createdAt) = YEAR(
          CASE 
            WHEN MONTH(CURRENT_DATE()) = 1 
            THEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
            ELSE CURRENT_DATE() 
          END
        )
        AND MONTH(createdAt) = 
          CASE 
            WHEN MONTH(CURRENT_DATE()) = 1 THEN 12
            ELSE MONTH(CURRENT_DATE()) - 1 
          END
      ) as messagesLastMonth
  `;

    return {
      totalMessages: Number(stats[0].totalMessages),
      messagesGrowth: compareByPercentage(Number(stats[0].messagesThisMonth), Number(stats[0].messagesLastMonth)),
    };
  };

  getSerieData = async (
    records: {
      total: number;
      createdAt: string;
    }[],
    duration: AnalyticsDuration
  ) => {
    let data: { x: string; y: number }[] = [];

    switch (duration) {
      case "month":
        data = await generateMonthlyData(
          records.map((t) => {
            return {
              amount: Number(t.total) || 0,
              createdAt: new Date(t.createdAt),
            };
          })
        );

        break;

      case "quarter":
        data = await generateQuarterlyData(
          records.map((t) => {
            let orderDate = new Date(`${t.createdAt}-01`);

            return {
              amount: Number(t.total) || 0,
              createdAt: t.createdAt && orderDate ? orderDate : new Date(),
            };
          })
        );
        break;
      case "year":
        data = await generateYearlyData(
          records.map((t) => {
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
    return data;
  };

  /**
   * @description Get course stats for the platform.
   */

  getMemberStats = async () => {
    const stats = await prisma.$queryRaw<any[]>`
    SELECT 
      (SELECT COUNT(*) FROM User WHERE role = 'MEMBER') as totalCustomers,
      (
        SELECT COUNT(*) 
        FROM User 
        WHERE role = 'MEMBER'  
        AND YEAR(dateJoined) = YEAR(CURRENT_DATE())
        AND MONTH(dateJoined) = MONTH(CURRENT_DATE())
      ) as customersThisMonth,
      (
        SELECT COUNT(*) 
        FROM User 
        WHERE role = 'MEMBER' 
        AND YEAR(dateJoined) = YEAR(
          CASE 
            WHEN MONTH(CURRENT_DATE()) = 1 
            THEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
            ELSE CURRENT_DATE() 
          END
        )
        AND MONTH(dateJoined) = 
          CASE 
            WHEN MONTH(CURRENT_DATE()) = 1 THEN 12
            ELSE MONTH(CURRENT_DATE()) - 1 
          END
      ) as customersLastMonth
    `;

    return {
      totalCustomers: Number(stats[0].totalCustomers),
      growth: compareByPercentage(Number(stats[0].customersThisMonth), Number(stats[0].customersLastMonth)),
    };
  };

  getOrgsByDuration = async (duration: AnalyticsDuration): Promise<APIResponse<IAnalyticResponse>> => {
    const orgsCountQuery = async (duration: AnalyticsDuration) => {
      switch (duration) {
        case "month":
          return await prisma.$queryRaw<{ total: number; createdAt: string }[]>`
      SELECT 
        DATE(createdAt) as createdAt,
        COUNT(*) as total
      FROM Tenant
       WHERE 
       createdAt >= ${getFormattedDate(
         new Date(getDateCondition(duration).startDate)
       )} AND createdAt <= ${getFormattedDate(new Date(getDateCondition(duration).endDate))}
       GROUP BY 
       DATE(createdAt);
         `;

        default:
          return await prisma.$queryRaw<{ total: number; createdAt: string }[]>`
         SELECT 
        MONTH(createdAt) as createdAt,
        COUNT(*) as total
      FROM Tenant
        WHERE 
        createdAt >= ${getFormattedDate(
          new Date(getDateCondition(duration).startDate)
        )} AND createdAt <= ${getFormattedDate(new Date(getDateCondition(duration).endDate))}
        GROUP BY 
        MONTH(createdAt);`;
      }
    };

    const orgs = await orgsCountQuery(duration);
    const data = await this.getSerieData(orgs, duration);

    let totalAmount = orgs.map((t) => t.total).reduce((sum, amount) => Number(sum) + Number(amount), 0);

    const previousDetail = await prisma.tenant.aggregate({
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: getDateCondition(duration).previousStartDate,
          lte: getDateCondition(duration).previousEndDate,
        },
      },
    });

    return new APIResponse(true, 200, "", {
      info: {
        total: `${Number(totalAmount) || 0}`,
        type: "Orgs",
        comparedPercentage: compareByPercentage(Number(totalAmount) || 0, Number(previousDetail._count.id) || 0),
      },
      data: [
        {
          id: "line",
          data,
        },
      ],
    });
  };

  getUsersByDuration = async (duration: AnalyticsDuration): Promise<APIResponse<IAnalyticResponse>> => {
    const usersCountQuery = async (duration: AnalyticsDuration) => {
      switch (duration) {
        case "month":
          return await prisma.$queryRaw<{ total: number; createdAt: string }[]>`
      SELECT
        DATE(dateJoined) as createdAt,
        COUNT(*) as total
      FROM User
       WHERE
       dateJoined >= ${getFormattedDate(
         new Date(getDateCondition(duration).startDate)
       )} AND dateJoined <= ${getFormattedDate(new Date(getDateCondition(duration).endDate))}
       GROUP BY
       DATE(dateJoined);
         `;
        default:
          return await prisma.$queryRaw<{ total: number; createdAt: string }[]>`
         SELECT
         MONTH(dateJoined) as createdAt,
        COUNT(*) as total
      FROM User
        WHERE
        dateJoined >= ${getFormattedDate(
          new Date(getDateCondition(duration).startDate)
        )} AND dateJoined <= ${getFormattedDate(new Date(getDateCondition(duration).endDate))}
        GROUP BY
        MONTH(dateJoined);`;
      }
    };
    const users = await usersCountQuery(duration);
    const data = await this.getSerieData(users, duration);
    let totalAmount = users.map((t) => t.total).reduce((sum, amount) => Number(sum) + Number(amount), 0);
    const previousDetail = await prisma.user.aggregate({
      _count: {
        id: true,
      },
      where: {
        dateJoined: {
          gte: getDateCondition(duration).previousStartDate,
          lte: getDateCondition(duration).previousEndDate,
        },
      },
    });
    return new APIResponse(true, 200, "", {
      info: {
        total: `${Number(totalAmount) || 0}`,
        type: "Users",
        comparedPercentage: compareByPercentage(Number(totalAmount) || 0, Number(previousDetail._count.id) || 0),
      },
      data: [
        {
          id: "line",
          data,
        },
      ],
    });
  };

  getPlatformStats = async (): Promise<APIResponse<IAnalyticStats[]>> => {
    const aiMessagesDetail = this.getAssistantMessageStats();
    const memberStats = this.getMemberStats();

    const [aiMessageStatsResult, memberStatsResult] = await Promise.all([aiMessagesDetail, memberStats]);
    return {
      message: "Success",
      status: 200,
      success: true,
      body: [
        {
          type: "AIMessages",
          total: aiMessageStatsResult.totalMessages.toString(),
          comparedPercentage: aiMessageStatsResult.messagesGrowth,
        },

        {
          type: "Users",
          total: memberStatsResult.totalCustomers.toString(),
          comparedPercentage: memberStatsResult.growth,
        },
      ],
    };
  };
}

export default new AdminAnalytics();

import prisma from "@/lib/prisma";
import {
  compareByPercentage,
  generateMonthlyData,
  generateQuarterlyData,
  generateYearlyData,
  getFormattedDate,
} from "@/lib/utils";
import { APIResponse } from "@/types/apis";
import {
  AnalyticsDuration,
  IAnalyticResponse,
  IAnalyticStats,
  IPageViewResponse,
  IResponseStats,
  IUsersResponse,
} from "@/types/courses/analytics";
import { ActivityType, Role, TenantRole } from "@prisma/client";
import { getCurrency } from "./getCurrency";
import appConstant from "@/services/appConstant";

class Analytics {
  async getOverviewDetails(tenantId: string): Promise<APIResponse<IAnalyticStats[]>> {
    // const earningDetail = await this.getTotalEarning(tenantId);
    const usersDetail = await this.getTotalUsers(tenantId);
    const pageViewDetail = await this.getTotalPageViews(tenantId);
    const currency = await getCurrency("CASHFREE");

    let overviewStats: IAnalyticStats[] = [
      {
        type: "PageViews",
        total: `${pageViewDetail.body?.totalViews}`,
        comparedPercentage: Number(pageViewDetail.body?.comparedPercentage),
        currency,
      },

      {
        type: "Users",
        total: `${usersDetail.body?.totalUsers}`,
        comparedPercentage: Number(usersDetail.body?.comparedPercentage),
      },
    ];

    if (usersDetail.success) {
      return new APIResponse(true, 200, "Overview has been fetched successfully", overviewStats);
    } else {
      return new APIResponse(false, 404, "Overview stats not found");
    }
  }

  async getTotalUsers(tenantId: string): Promise<APIResponse<IUsersResponse>> {
    const usersResult = await prisma.$queryRaw<IResponseStats[]>`
      SELECT
        -- Total Students
        (SELECT COALESCE(COUNT(*), 0)
         FROM UserTenant
       
         WHERE 
          role = ${TenantRole.MEMBER}
       
           AND tenantId = ${tenantId}
        ) AS total,

        -- Students Registered This Month
        (SELECT COALESCE(COUNT(*), 0)
        FROM UserTenant
       
       WHERE 
        role = ${TenantRole.MEMBER}
     
         AND tenantId = ${tenantId}
           AND createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
           AND createdAt < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
        ) AS current,

        -- Students Registered Last Month
        (SELECT COALESCE(COUNT(*), 0)
        FROM UserTenant
       
       WHERE 
        role = ${TenantRole.MEMBER}
     
         AND tenantId = ${tenantId}
           AND createdAt >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
           AND createdAt < DATE_FORMAT(CURDATE(), '%Y-%m-01')
        ) AS previous;
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
  async getTotalPageViews(tenantId: string): Promise<APIResponse<IPageViewResponse>> {
    const findDomain = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
      select: {
        domain: true,
      },
    });

    let domain = findDomain?.domain;
    const pageViewResult = await prisma.$queryRaw<IResponseStats[]>`
      SELECT
        -- Total Students
        (SELECT COALESCE(COUNT(*), 0)
         FROM Activities
       
         WHERE 
          domain = ${domain}
        ) AS total,

        -- Students Registered This Month
        (SELECT COALESCE(COUNT(*), 0)
        FROM Activities
       
       WHERE 

       domain = ${domain}

     
           AND dtOccurred >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
           AND dtOccurred < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
        ) AS current,

        -- Students Registered Last Month
        (SELECT COALESCE(COUNT(*), 0)
        FROM Activities
       
       WHERE 
       domain = ${domain}
           AND dtOccurred >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
           AND dtOccurred < DATE_FORMAT(CURDATE(), '%Y-%m-01')
        ) AS previous;
    `;

    if (pageViewResult.length > 0) {
      return new APIResponse(true, 200, "", {
        totalViews: Number(pageViewResult[0].total),
        comparedPercentage: compareByPercentage(Number(pageViewResult[0].current), Number(pageViewResult[0].previous)),
      });
    } else {
      return new APIResponse(true, 200, "User Data not found", {
        totalViews: 0,
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

  async getUserDetailByDuration(
    duration: AnalyticsDuration,
    tenantId: string
  ): Promise<APIResponse<IAnalyticResponse>> {
    const userQuery = async (duration: AnalyticsDuration) => {
      switch (duration) {
        case "month":
          return await prisma.$queryRaw<{ total: number; createdAt: string }[]>`
      SELECT 
      DATE(createdAt) AS createdAt ,
       COUNT(id) AS total
       FROM 
       UserTenant
       WHERE 
       tenantId = ${tenantId} AND
       role = ${TenantRole.MEMBER} AND
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
        UserTenant      
        WHERE 
        tenantId = ${tenantId} AND
        role = ${TenantRole.MEMBER} AND
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
        data = await generateMonthlyData(
          users.map((t) => {
            return {
              amount: Number(t.total) || 0,
              createdAt: new Date(t.createdAt),
            };
          })
        );

        break;

      case "quarter":
        data = await generateQuarterlyData(
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
        data = await generateYearlyData(
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

    const previousDetail = await prisma.userTenant.aggregate({
      // earlier course registration table was used
      _count: {
        userId: true,
      },
      where: {
        createdAt: {
          gte: this.getDateCondition(duration).previousStartDate,
          lte: this.getDateCondition(duration).previousEndDate,
        },
      },
    });

    return new APIResponse(true, 200, "", {
      info: {
        total: `${totalAmount || 0}`,
        type: "Users",
        comparedPercentage: compareByPercentage(totalAmount || 0, previousDetail._count.userId || 0),
      },
      data: [
        {
          id: "line",
          data,
        },
      ],
    });
  }
  async getPageViewDetailByDuration(
    duration: AnalyticsDuration,
    tenantId: string
  ): Promise<APIResponse<IAnalyticResponse>> {
    try {
      const findDomain = await prisma.tenant.findUnique({
        where: {
          id: tenantId,
        },
        select: {
          domain: true,
        },
      });
      const domain = findDomain?.domain;
      const userQuery = async (duration: AnalyticsDuration) => {
        switch (duration) {
          case "month":
            return await prisma.$queryRaw<{ total: number; createdAt: string }[]>`
      SELECT 
      DATE(dtOccurred) AS createdAt ,
       COUNT(*) AS total
       FROM 
       Activities
       WHERE 
    domain = ${domain} AND
       dtOccurred >= ${getFormattedDate(
         new Date(this.getDateCondition(duration).startDate)
       )} AND dtOccurred <= ${getFormattedDate(new Date(this.getDateCondition(duration).endDate))}
       GROUP BY 
       DATE(dtOccurred);
         `;

          default:
            return await prisma.$queryRaw<{ total: number; createdAt: string }[]>`
         SELECT 
        MONTH(dtOccurred) AS createdAt,
        COUNT(*) AS total
        FROM 
        Activities
       WHERE 
    domain = ${domain} AND
    dtOccurred >= ${getFormattedDate(
      new Date(this.getDateCondition(duration).startDate)
    )} AND dtOccurred <= ${getFormattedDate(new Date(this.getDateCondition(duration).endDate))}
        GROUP BY 
        MONTH(dtOccurred);
   `;
        }
      };

      const users = await userQuery(duration);

      let data: { x: string; y: number }[] = [];

      switch (duration) {
        case "month":
          data = await generateMonthlyData(
            users.map((t) => {
              return {
                amount: Number(t.total) || 0,
                createdAt: new Date(t.createdAt),
              };
            })
          );

          break;

        case "quarter":
          data = await generateQuarterlyData(
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
          data = await generateYearlyData(
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

      const previousDetail = await prisma.activities.aggregate({
        _count: {
          domain: true,
        },
        where: {
          domain,
          dtOccurred: {
            gte: this.getDateCondition(duration).previousStartDate,
            lte: this.getDateCondition(duration).previousEndDate,
          },
        },
      });

      return new APIResponse(true, 200, "", {
        info: {
          total: `${totalAmount || 0}`,
          type: "PageViews",
          comparedPercentage: compareByPercentage(totalAmount || 0, previousDetail._count.domain || 0),
        },
        data: [
          {
            id: "line",
            data,
          },
        ],
      });
    } catch (error) {
      return new APIResponse(true, 200, error as string);
    }
  }

  async getAssistantMessageDetailByDuration(
    duration: AnalyticsDuration,
    tenantId: string
  ): Promise<APIResponse<IAnalyticResponse>> {
    try {
      const dateCond = this.getDateCondition(duration);

      const messageQuery = async (duration: AnalyticsDuration) => {
        switch (duration) {
          case "month":
            return await prisma.$queryRaw<{ total: number; createdAt: string }[]>`
            SELECT 
              DATE(createdAt) AS createdAt,
              COUNT(*) AS total
            FROM 
              assistant_messages
            WHERE 
            role = "SYSTEM" AND
              createdAt >= ${getFormattedDate(new Date(dateCond.startDate))}
              AND createdAt <= ${getFormattedDate(new Date(dateCond.endDate))}
            GROUP BY 
              DATE(createdAt);
          `;

          default:
            return await prisma.$queryRaw<{ total: number; createdAt: string }[]>`
            SELECT 
              MONTH(createdAt) AS createdAt,
              COUNT(*) AS total
            FROM 
              assistant_messages
            WHERE 
             role = "SYSTEM" AND
              createdAt >= ${getFormattedDate(new Date(dateCond.startDate))}
              AND createdAt <= ${getFormattedDate(new Date(dateCond.endDate))}
            GROUP BY 
              MONTH(createdAt);
          `;
        }
      };

      const messages = await messageQuery(duration);

      let data: { x: string; y: number }[] = [];

      switch (duration) {
        case "month":
          data = await generateMonthlyData(
            messages.map((m) => ({
              amount: Number(m.total) || 0,
              createdAt: new Date(m.createdAt),
            }))
          );
          break;

        case "quarter":
          data = await generateQuarterlyData(
            messages.map((m) => ({
              amount: Number(m.total) || 0,
              createdAt: new Date(`${m.createdAt}-01`),
            }))
          );
          break;

        case "year":
          data = await generateYearlyData(
            messages.map((m) => ({
              amount: Number(m.total) || 0,
              createdAt: new Date(`${m.createdAt}-01`),
            }))
          );
          break;
      }

      const totalAmount = messages.reduce((sum, msg) => sum + Number(msg.total), 0);

      // Get previous period message count
      const previousTotal = await prisma.assistantMessage.count({
        where: {
          role: "SYSTEM",
          createdAt: {
            gte: dateCond.previousStartDate,
            lte: dateCond.previousEndDate,
          },
        },
      });

      return new APIResponse(true, 200, "", {
        info: {
          total: `${totalAmount || 0}`,
          type: "AIMessages",
          comparedPercentage: compareByPercentage(totalAmount, previousTotal),
        },
        data: [
          {
            id: "line",
            data,
          },
        ],
      });
    } catch (error) {
      return new APIResponse(false, 500, error as string);
    }
  }

  async addActivity(
    type: ActivityType,
    ip: string,
    userAgent: string,
    domain: string,
    path: string
  ): Promise<APIResponse<any>> {
    const cleanIP = ip.replace(/^::ffff:/, "");

    if (appConstant.ignoredIP.includes(cleanIP)) {
      return new APIResponse(true, 200, "Activity update has been ignored for this IP");
    } else {
      const dtOccurred = new Date();
      let location: any = null;
      if (cleanIP) {
        try {
          const response = await fetch(`http://ip-api.com/json/${cleanIP}?fields=country,city,timezone,currency`);
          if (response.ok) {
            location = await response.json();
          }
          const findExisting = await prisma.activities.findFirst({
            where: {
              clientIP: cleanIP,
              domain: domain,
              path,
            },
            select: {
              dtOccurred: true,
            },
          });

          if (
            findExisting &&
            findExisting.dtOccurred.toISOString().split("T")[0] == new Date().toISOString().split("T")[0]
          ) {
            return new APIResponse(false, 400, "Activity already  registered");
          } else {
            await prisma.activities.create({
              data: {
                userAgent: String(userAgent),
                clientIP: String(cleanIP),
                dtOccurred: dtOccurred,
                path,
                domain,
                country: location.country || "",
                city: location.city || "",
                currency: location.currency || "",
                timeZone: location.timezone || "",
                type,
              },
            });
            return new APIResponse(true, 200, "Activity has been registered");
          }
        } catch (err) {
          return new APIResponse(true, 200, `Location fetch failed: ${err}`);
        }
      } else {
        return new APIResponse(true, 200, `IP not found`);
      }
    }
  }
}

export default new Analytics();

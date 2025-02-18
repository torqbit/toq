import { Serie } from "@nivo/line";

export interface IEarningStats {
  totalEarnings: number;
  currentMonthEarnings: number;
  previousMonthEarnings: number;
}

export interface IResponseStats {
  total: number;
  current: number;
  previous: number;
}

export interface IEnrollmentStats {
  totalEnrollment: number;
  currentMonthEnrollment: number;
  previousMonthEnrollment: number;
}
export interface IUsersStats {
  totalUsers: number;
  currentMonthUsers: number;
  previousMonthUsers: number;
}

export interface IAnalyticResponse {
  info: IAnalyticStats;
  data: Serie[];
  currency?: string;
}

export interface IEarningResponse {
  totalEarning: number;
  comparedPercentage: number;
}
export interface IEnrollmentResponse {
  totalEnrollment: number;
  comparedPercentage: number;
}
export interface IUsersResponse {
  totalUsers: number;
  comparedPercentage: number;
}
export type AnalyticsType = "Earnings" | "Enrollments" | "Users";
export type AnalyticsDuration = "month" | "quarter" | "year";

export interface IAnalyticStats {
  type: AnalyticsType;
  total: string;
  comparedPercentage: number;
  currency?: string;
}

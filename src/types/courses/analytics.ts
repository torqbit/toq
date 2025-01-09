export interface IEarningStats {
  totalEarnings: number;
  currentMonthEarnings: number;
  previousMonthEarnings: number;
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

export interface IOverviewStats {
  type: string;
  total: string;
  comparedPercentage: number;
}

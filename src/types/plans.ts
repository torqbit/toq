import { Plan, Subscription, Tenant, TenantRole } from "@prisma/client";

export interface ISubscriptionPlan extends Subscription {
  plan: Plan;
}

export interface TenantSubscription extends Tenant {
  subscription: ISubscriptionPlan[];
}
export interface ITenantUser {
  role: TenantRole;
  tenantId: string;
  tenant: TenantSubscription;
}

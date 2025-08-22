import { ISubscriptionPlan } from "@/types/plans";
import { Plan, planType, Role, SubStatus, TenantRole } from "@prisma/client";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import "next-auth/adapters";
import { planType, Role, TenantRole, Plan } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: Role;
    phone: string;
    isActive: boolean;
    tenant?: {
      tenantId: string;
      role: TenantRole;
      onBoarding: boolean;
      domain: string;
      subscription: {
        id: string;
        providerSubscriptionId: string;
        status: SubStatus;
        plan: planType;
        planName: string;
        planId: string;
        startDate: Date;
        endDate: Date;
      } | null;
    };
    isSubscriptionExpired: boolean;
  }

  interface User {
    id: string;
    role: string;
    isActive: boolean;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    id: string;
    email: string;
    name: string;
    image?: string;
    phone: string;
    role: Role;
    isActive: boolean;
    tenants: [
      {
        tenantId: string;
        role: TenantRole;
        onBoarding: boolean;
        domain: string;
        subscription: {
          id: string;
          providerSubscriptionId: string;
          status: SubStatus;
          planName: string;
          plan: planType;
          planId: string;
          startDate: Date;
          endDate: Date;
        };
      },
    ];
    isSubscriptionExpired: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone: string;
    role: Role;
    isActive: boolean;
    tenant?: { tenantId: string; role: TenantRole; domain: string; onBoarding: boolean };
    subscriptionPlan?: Plan;
    isSubscriptionExpired: boolean;
  }
}

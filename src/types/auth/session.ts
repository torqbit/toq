import { Role, TenantRole } from "@prisma/client";

export type SessionUser = {
  name: string;
  id: string;
  email: string | null;
  phone: string | null;
  image: string | null;
  isActive: boolean;
  role: Role;
  account: { password: string | null }[];
  tenants: { role: TenantRole; tenantId: string }[];
  isSubscriptionExpired?: boolean;
};

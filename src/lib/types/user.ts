import { Role, TenantRole } from "@prisma/client";

export interface UserSession {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: Role;
  tenantRole?: TenantRole;
  phone?: string;
}

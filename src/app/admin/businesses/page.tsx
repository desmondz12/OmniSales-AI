import { TenantManagementClient } from "@/components/admin/tenant-management-client";

export const metadata = {
  title: "Tenant Management | OmniSales AI Super Admin",
  description: "Manage client business workspaces, channels, plans, and token limits",
};

export default function AdminBusinessesPage() {
  return <TenantManagementClient />;
}

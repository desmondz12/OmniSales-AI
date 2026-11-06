import { GlobalLogsClient } from "@/components/admin/global-logs-client";

export const metadata = {
  title: "Global Webhook & AI Logs | OmniSales AI Super Admin",
  description: "Live feed of inbound webhooks, Gemini triage decisions, token usage, and billing events",
};

export default function AdminLogsPage() {
  return <GlobalLogsClient />;
}

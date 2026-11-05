import Link from "next/link";
import { Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Contacts & Accounts
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your leads, prospects, and customer relationships.
          </p>
        </div>
      </div>

      {/* Empty State Card */}
      <Card className="border-slate-800 bg-slate-900/40">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-950/60 text-blue-400 mb-4 border border-blue-900/50">
            <Users className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl">CRM Module — Phase 3</CardTitle>
          <CardDescription className="mt-2 max-w-md text-sm text-slate-400">
            Contacts, companies, search filtering, tags, and CSV import will be implemented in <strong>Phase 3 (CRM Core)</strong>.
          </CardDescription>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Back to Overview
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

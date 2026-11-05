import Link from "next/link";
import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Collections & Invoices
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitor receivables, invoice aging, and automated collection workflows.
          </p>
        </div>
      </div>

      <Card className="border-slate-800 bg-slate-900/40">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-950/60 text-amber-400 mb-4 border border-amber-900/50">
            <DollarSign className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl">Collections Module — Phase 5</CardTitle>
          <CardDescription className="mt-2 max-w-md text-sm text-slate-400">
            Automated payment reminders, invoice ledger, aging brackets, and payment logging will be created in <strong>Phase 5 (Collections Module)</strong>.
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

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Tenant } from "@/types/database";

interface WorkspaceFormProps {
  tenant: Tenant;
  canEdit: boolean;
}

export function WorkspaceForm({ tenant, canEdit }: WorkspaceFormProps) {
  const router = useRouter();
  const [name, setName] = React.useState(tenant.name);
  const [isLoading, setIsLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [fieldError, setFieldError] = React.useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name.trim()) {
      setFieldError("Workspace name cannot be empty.");
      return;
    }
    setFieldError(undefined);

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("tenants")
        .update({ name: name.trim(), updated_at: new Date().toISOString() })
        .eq("id", tenant.id);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage("Workspace name updated successfully.");
      router.refresh();
    } catch {
      setErrorMessage("An unexpected error occurred while saving.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMessage && (
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Update Failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div>
        <Input
          label="Workspace Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldError}
          disabled={!canEdit || isLoading}
          required
        />
        {!canEdit && (
          <p className="mt-1.5 text-xs text-amber-400">
            You need Admin or Owner permissions in this workspace to modify its name.
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        <div>
          <label className="block text-xs font-medium text-slate-400">
            Workspace Slug
          </label>
          <div className="mt-1 flex items-center rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-300">
            <Building2 className="mr-2 h-4 w-4 text-slate-500" />
            <span className="font-mono">{tenant.slug}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400">
            Workspace ID
          </label>
          <div className="mt-1 flex items-center rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-400 truncate">
            <span className="font-mono text-xs">{tenant.id}</span>
          </div>
        </div>
      </div>

      {canEdit && (
        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading || name.trim() === tenant.name}
          >
            {successMessage ? (
              <Check className="mr-2 h-4 w-4 text-emerald-400" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      )}
    </form>
  );
}

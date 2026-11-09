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
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card font-sans">
      <form onSubmit={handleSubmit} className="space-y-5">
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
            <p className="mt-1.5 text-xs text-amber-600 font-medium">
              You need Admin or Owner permissions in this workspace to modify its name.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-1">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Workspace Slug
            </label>
            <div className="flex items-center rounded-2xl border border-border-button-default bg-background-secondary-default px-3.5 py-2.5 text-xs text-text-secondary">
              <Building2 className="mr-2 h-4 w-4 text-text-tertiary" />
              <span className="font-mono font-medium">{tenant.slug}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Workspace ID
            </label>
            <div className="flex items-center rounded-2xl border border-border-button-default bg-background-secondary-default px-3.5 py-2.5 text-xs text-text-tertiary truncate">
              <span className="font-mono text-xs">{tenant.id}</span>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="pt-2 border-t border-border-button-default flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || name.trim() === tenant.name}
              className="rounded-full bg-accent-600 hover:bg-accent-700 text-white font-semibold text-xs shadow-xs"
            >
              {successMessage ? (
                <Check className="mr-2 h-4 w-4 text-white" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
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
      setFieldError("Le nom de l'espace ne peut pas être vide.");
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

      setSuccessMessage("Nom de l'espace mis à jour avec succès.");
      router.refresh();
    } catch {
      setErrorMessage("Une erreur imprévue est survenue lors de l'enregistrement.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="apple-glass-card rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <form onSubmit={handleSubmit} className="space-y-5">
        {successMessage && (
          <Alert variant="success" className="rounded-2xl">
            <AlertTitle className="text-xs font-semibold">Succès</AlertTitle>
            <AlertDescription className="text-xs">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive" className="rounded-2xl">
            <AlertTitle className="text-xs font-semibold">Échec de mise à jour</AlertTitle>
            <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div>
          <Input
            label="Nom de l'Espace Commercial"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldError}
            disabled={!canEdit || isLoading}
            className="h-10 rounded-2xl text-xs bg-white/90"
            required
          />
          {!canEdit && (
            <p className="mt-1.5 text-xs text-[#FF9500] font-normal">
              Vous devez avoir les droits Administrateur ou Propriétaire pour modifier ce nom.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-500">
              Identifiant URL (Slug)
            </label>
            <div className="mt-1 flex items-center rounded-2xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-700">
              <Building2 className="mr-2 h-4 w-4 text-slate-400" />
              <span className="font-mono text-xs">{tenant.slug}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500">
              ID Espace (UUID)
            </label>
            <div className="mt-1 flex items-center rounded-2xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-400 truncate">
              <span className="font-mono text-xs truncate">{tenant.id}</span>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || name.trim() === tenant.name}
              className="apple-press rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium px-4 py-2"
            >
              {successMessage ? (
                <Check className="mr-1.5 h-3.5 w-3.5 text-white" />
              ) : (
                <Save className="mr-1.5 h-3.5 w-3.5" />
              )}
              Enregistrer les Modifications
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

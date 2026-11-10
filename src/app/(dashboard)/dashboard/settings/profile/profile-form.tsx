"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Mail, Save, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
  userEmail: string;
  userId: string;
  profile: Profile | null;
}

export function ProfileForm({ userEmail, userId, profile }: ProfileFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = React.useState(profile?.full_name ?? "");
  const [isLoading, setIsLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [fieldError, setFieldError] = React.useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!fullName.trim()) {
      setFieldError("Le nom affiché ne peut pas être vide.");
      return;
    }
    setFieldError(undefined);

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage("Votre profil a été mis à jour avec succès.");
      router.refresh();
    } catch {
      setErrorMessage("Une erreur est survenue lors de la mise à jour.");
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

        <div className="relative">
          <Input
            label="Nom complet"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={fieldError}
            disabled={isLoading}
            className="h-10 rounded-2xl text-xs bg-white/90"
            required
          />
          <UserIcon className="pointer-events-none absolute right-3.5 top-8.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Adresse e-mail de connexion
          </label>
          <div className="mt-1 flex items-center rounded-2xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-600">
            <Mail className="mr-2 h-4 w-4 text-slate-400" />
            <span>{userEmail}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            L&apos;adresse e-mail est liée à votre compte d&apos;authentification Supabase.
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading || fullName.trim() === (profile?.full_name ?? "")}
            className="apple-press rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium px-4 py-2"
          >
            {successMessage ? (
              <Check className="mr-1.5 h-3.5 w-3.5 text-white" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5" />
            )}
            Mettre à jour le Profil
          </Button>
        </div>
      </form>
    </div>
  );
}

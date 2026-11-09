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
      setFieldError("Display name cannot be empty.");
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

      setSuccessMessage("Your profile was updated successfully.");
      router.refresh();
    } catch {
      setErrorMessage("An unexpected error occurred while updating profile.");
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

      <div className="relative">
        <Input
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={fieldError}
          disabled={isLoading}
          required
        />
        <UserIcon className="pointer-events-none absolute right-3 top-8.5 h-4 w-4 text-slate-500" />
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-slate-400">
          Email Address
        </label>
        <div className="mt-1.5 flex items-center rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-400">
          <Mail className="mr-2 h-4 w-4 text-slate-500" />
          <span>{userEmail}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Email address is managed by your account authentication.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400">
          User Identifier
        </label>
        <div className="mt-1.5 flex items-center rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 font-mono text-xs text-slate-500 truncate">
          <span>{userId}</span>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading || fullName.trim() === (profile?.full_name ?? "")}
        >
          {successMessage ? (
            <Check className="mr-2 h-4 w-4 text-emerald-400" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Update Profile
        </Button>
      </div>
    </form>
  );
}

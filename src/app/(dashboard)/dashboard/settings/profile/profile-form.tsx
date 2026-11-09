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
          <UserIcon className="pointer-events-none absolute right-3.5 top-8.5 h-4 w-4 text-text-tertiary" />
        </div>

        <div className="relative">
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Email Address
          </label>
          <div className="flex items-center rounded-2xl border border-border-button-default bg-background-secondary-default px-3.5 py-2.5 text-xs text-text-secondary">
            <Mail className="mr-2 h-4 w-4 text-text-tertiary" />
            <span>{userEmail}</span>
          </div>
          <p className="mt-1 text-xs text-text-tertiary">
            Email address is managed by your account authentication.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            User Identifier
          </label>
          <div className="flex items-center rounded-2xl border border-border-button-default bg-background-secondary-default px-3.5 py-2.5 font-mono text-xs text-text-tertiary truncate">
            <span>{userId}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-border-button-default flex justify-end">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading || fullName.trim() === (profile?.full_name ?? "")}
            className="rounded-full bg-accent-600 hover:bg-accent-700 text-white font-semibold text-xs shadow-xs"
          >
            {successMessage ? (
              <Check className="mr-2 h-4 w-4 text-white" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Bot, CheckCircle2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { APP_NAME, ROUTES } from "@/lib/constants";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [fieldError, setFieldError] = React.useState<string | undefined>();

  const validate = (): boolean => {
    if (!email.trim()) {
      setFieldError("Email address is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError("Please enter a valid email address.");
      return false;
    }
    setFieldError(undefined);
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback?next=/dashboard/settings/profile`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background-full px-4 py-12 text-text-primary font-sans antialiased">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-600 text-white shadow-card mb-2">
              <Bot className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              {APP_NAME}
            </h2>
          </div>

          <Card className="rounded-3xl border border-emerald-200 bg-background-primary-default shadow-card">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-text-primary">Check your inbox</CardTitle>
              <CardDescription className="text-text-secondary text-xs">
                If an account exists for <strong>{email}</strong>, you will receive a reset link shortly.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-4">
              <Link
                href={ROUTES.LOGIN}
                className={buttonVariants({ variant: "outline", className: "w-full rounded-full text-xs font-semibold" })}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-full px-4 py-12 text-text-primary font-sans antialiased">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-600 text-white shadow-card mb-2">
            <Bot className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {APP_NAME}
          </h1>
          <p className="text-xs text-text-secondary">
            Reset your account password
          </p>
        </div>

        <Card className="rounded-3xl border border-border-button-default bg-background-primary-default shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-text-primary">Forgot password?</CardTitle>
            <CardDescription className="text-text-secondary text-xs">
              Enter your email address and we will send you a password recovery link
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleResetPassword} noValidate>
            <CardContent className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertTitle>Reset Request Failed</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="relative">
                <Input
                  label="Work Email"
                  type="email"
                  autoComplete="email"
                  placeholder="jeanluc@fotsotrading.cm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldError}
                  disabled={isLoading}
                  required
                />
                <Mail className="pointer-events-none absolute right-3.5 top-8.5 h-4 w-4 text-text-tertiary" />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                className="w-full rounded-full bg-accent-600 hover:bg-accent-700 text-white font-semibold text-xs shadow-xs"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Send Reset Link
              </Button>

              <div className="text-center text-xs text-text-secondary">
                <Link
                  href={ROUTES.LOGIN}
                  className="inline-flex items-center font-semibold text-accent-600 hover:text-accent-700"
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <Link
              href={ROUTES.HOME}
              className="inline-block text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors"
            >
              {APP_NAME}
            </Link>
          </div>

          <Card className="border-emerald-900/40 bg-emerald-950/20">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/50 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Check your inbox</CardTitle>
              <CardDescription className="text-slate-300">
                If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-center text-xs text-slate-400">
              <p>Be sure to check your spam or junk folder if it doesn&apos;t arrive within a few minutes.</p>
            </CardContent>
            <CardFooter>
              <Link
                href={ROUTES.LOGIN}
                className={buttonVariants({ variant: "outline", className: "w-full" })}
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link
            href={ROUTES.HOME}
            className="inline-block text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors"
          >
            {APP_NAME}
          </Link>
          <p className="text-sm text-slate-400">
            Reset your account password
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forgot password?</CardTitle>
            <CardDescription>
              Enter your email address and we will send you a link to reset your password
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
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldError}
                  disabled={isLoading}
                  required
                />
                <Mail className="pointer-events-none absolute right-3 top-8.5 h-4 w-4 text-slate-500" />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Send Reset Link
              </Button>

              <div className="text-center text-sm text-slate-400">
                <Link
                  href={ROUTES.LOGIN}
                  className="inline-flex items-center font-medium text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
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

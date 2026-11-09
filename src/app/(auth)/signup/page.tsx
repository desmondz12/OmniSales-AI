"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, Building2, CheckCircle2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
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

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  // States: loading, error, success
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<{
    fullName?: string;
    companyName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!fullName.trim()) {
      errors.fullName = "Full name is required.";
    }

    if (!companyName.trim()) {
      errors.companyName = "Company or Workspace name is required.";
    }

    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid work email.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName.trim(),
            tenant_name: companyName.trim(),
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setErrorMessage(
            "An account with this email address already exists. Please sign in instead."
          );
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMessage("An unexpected error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12 text-slate-900">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-2">
              <Bot className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {APP_NAME}
            </h2>
          </div>

          <Card className="border border-emerald-200 bg-white shadow-sm">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">Check your inbox</CardTitle>
              <CardDescription className="text-slate-500">
                We sent a confirmation link to:
              </CardDescription>
              <p className="mt-1 font-semibold text-slate-900">{email}</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs text-slate-600 text-center">
              <p>
                Click the verification link in the email to activate your account
                and complete setting up <strong>{companyName}</strong>.
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href={ROUTES.LOGIN}
                className={buttonVariants({ variant: "outline", className: "w-full" })}
              >
                Return to Sign In
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12 text-slate-900">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-2">
            <Bot className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {APP_NAME}
          </h1>
          <p className="text-xs text-slate-500">
            Create your sales workspace across 5 channels
          </p>
        </div>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Create a workspace</CardTitle>
            <CardDescription>
              Enter your business details to launch your AI sales agent
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSignUp} noValidate>
            <CardContent className="space-y-3.5">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertTitle>Sign-up Failed</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="relative">
                <Input
                  label="Your Full Name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={fieldErrors.fullName}
                  disabled={isLoading}
                  required
                />
                <User className="pointer-events-none absolute right-3 top-7.5 h-4 w-4 text-slate-400" />
              </div>

              <div className="relative">
                <Input
                  label="Company / Workspace Name"
                  type="text"
                  placeholder="Acme Retail"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  error={fieldErrors.companyName}
                  disabled={isLoading}
                  required
                />
                <Building2 className="pointer-events-none absolute right-3 top-7.5 h-4 w-4 text-slate-400" />
              </div>

              <div className="relative">
                <Input
                  label="Work Email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@acme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldErrors.email}
                  disabled={isLoading}
                  required
                />
                <Mail className="pointer-events-none absolute right-3 top-7.5 h-4 w-4 text-slate-400" />
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Password (min. 8 characters)
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={fieldErrors.password}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={fieldErrors.confirmPassword}
                  disabled={isLoading}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                <Lock className="mr-2 h-4 w-4" />
                Create Workspace
              </Button>

              <div className="text-center text-xs text-slate-500">
                Already have an account?{" "}
                <Link
                  href={ROUTES.LOGIN}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

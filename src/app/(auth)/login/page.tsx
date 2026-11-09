"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bot,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  // States
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDemoLoading, setIsDemoLoading] = React.useState<"owner" | "admin" | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("Invalid email or password. Verify your credentials or use the one-click demo login below.");
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo Login Handler
  const handleDemoLogin = async (role: "business_client" | "super_admin") => {
    setIsDemoLoading(role === "business_client" ? "owner" : "admin");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch {
      setErrorMessage("Failed to initiate demo session.");
      setIsDemoLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Demo Role Switcher Cards */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-900 mb-2.5">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span>One-Click Role Switcher (Instant Demo Access)</span>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleDemoLogin("business_client")}
            disabled={isLoading || Boolean(isDemoLoading)}
            className="flex flex-col items-start rounded-lg border border-blue-200/80 bg-white p-3 text-left shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <div className="flex items-center space-x-2 w-full justify-between">
              <span className="flex items-center text-xs font-bold text-slate-900">
                <Building2 className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                Business Owner
              </span>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                /dashboard
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-tight">
              Musa&apos;s 5-channel AI Sales & Collections workspace
            </p>
            {isDemoLoading === "owner" && (
              <span className="mt-2 text-[10px] text-blue-600 font-medium animate-pulse">
                Launching Business Portal...
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin("super_admin")}
            disabled={isLoading || Boolean(isDemoLoading)}
            className="flex flex-col items-start rounded-lg border border-purple-200/80 bg-white p-3 text-left shadow-2xs hover:border-purple-500 hover:shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <div className="flex items-center space-x-2 w-full justify-between">
              <span className="flex items-center text-xs font-bold text-slate-900">
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-purple-600" />
                Super Admin
              </span>
              <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">
                /admin
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-tight">
              SaaS owner platform command center & tenant control
            </p>
            {isDemoLoading === "admin" && (
              <span className="mt-2 text-[10px] text-purple-600 font-medium animate-pulse">
                Launching Admin Portal...
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-[#F8FAFC] px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          Or sign in with email
        </span>
      </div>

      {/* Standard Form */}
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your credentials to access your sales workspace
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignIn} noValidate>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertTitle>Sign-in Failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="relative">
              <Input
                label="Work Email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
                disabled={isLoading}
                required
              />
              <Mail className="pointer-events-none absolute right-3 top-7.5 h-4 w-4 text-slate-400" />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Password
                </label>
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading || Boolean(isDemoLoading)}
            >
              <Lock className="mr-2 h-4 w-4" />
              Sign In
            </Button>

            <div className="text-center text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href={ROUTES.SIGNUP}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create a workspace
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12 text-slate-900">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-2">
            <Bot className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {APP_NAME}
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            AI-powered sales, CRM & collections platform across 5 channels
          </p>
        </div>

        <React.Suspense
          fallback={
            <div className="h-64 rounded-xl border border-slate-200 bg-white shadow-xs animate-pulse" />
          }
        >
          <LoginForm />
        </React.Suspense>
      </div>
    </div>
  );
}

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
import { usePostHog } from "posthog-js/react";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
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
  const posthog = usePostHog();

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

      posthog?.capture("auth_email_signin_success");
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
      posthog?.capture("auth_demo_login", { role });
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
      {/* Demo Role Switcher Cards: Apple Translucent Capsule Cards */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 mb-2.5">
          <Sparkles className="h-3.5 w-3.5 text-[#0071E3]" />
          <span>Accès Démo Instantané (1 Clic)</span>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleDemoLogin("business_client")}
            disabled={isLoading || Boolean(isDemoLoading)}
            className="apple-press flex flex-col items-start rounded-2xl border border-slate-200/80 bg-white/90 p-3 text-left shadow-2xs hover:border-[#0071E3] transition-all disabled:opacity-50 cursor-pointer"
          >
            <div className="flex items-center space-x-2 w-full justify-between">
              <span className="flex items-center text-xs font-semibold text-slate-900 tracking-tight">
                <Building2 className="mr-1.5 h-3.5 w-3.5 text-[#0071E3]" />
                Commerçant
              </span>
              <span className="rounded-full bg-[#0071E3]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0071E3]">
                /dashboard
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-snug">
              Espace vendeur 5 canaux & recouvrement MoMo/OM
            </p>
            {isDemoLoading === "owner" && (
              <span className="mt-1.5 text-[10px] text-[#0071E3] font-medium animate-pulse">
                Connexion en cours...
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin("super_admin")}
            disabled={isLoading || Boolean(isDemoLoading)}
            className="apple-press flex flex-col items-start rounded-2xl border border-slate-200/80 bg-white/90 p-3 text-left shadow-2xs hover:border-[#5856D6] transition-all disabled:opacity-50 cursor-pointer"
          >
            <div className="flex items-center space-x-2 w-full justify-between">
              <span className="flex items-center text-xs font-semibold text-slate-900 tracking-tight">
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-[#5856D6]" />
                Super Admin
              </span>
              <span className="rounded-full bg-[#5856D6]/10 px-2 py-0.5 text-[10px] font-semibold text-[#5856D6]">
                /admin
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-snug">
              Supervision SaaS, entreprises & audit global
            </p>
            {isDemoLoading === "admin" && (
              <span className="mt-1.5 text-[10px] text-[#5856D6] font-medium animate-pulse">
                Connexion en cours...
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200/80 w-full" />
        <span className="bg-[#F8FAFC] px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          Ou avec identifiants
        </span>
      </div>

      {/* Standard Apple Card */}
      <Card className="apple-glass-card rounded-3xl border border-white/60 bg-white/80 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-2">
        <CardHeader className="pb-3 pt-4 px-5">
          <CardTitle className="text-lg font-semibold tracking-[-0.02em] text-slate-900">Connexion</CardTitle>
          <CardDescription className="text-xs text-slate-500 font-normal">
            Saisissez vos identifiants pour ouvrir votre espace commercial
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignIn} noValidate>
          <CardContent className="space-y-3.5 px-5">
            {errorMessage && (
              <Alert variant="destructive" className="rounded-2xl">
                <AlertTitle className="text-xs font-semibold">Échec de connexion</AlertTitle>
                <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
              </Alert>
            )}

            <SocialAuthButtons
              mode="signin"
              redirectTo={redirectTo}
              disabled={isLoading || Boolean(isDemoLoading)}
              onError={(msg) => setErrorMessage(msg || null)}
            />

            <div className="relative flex items-center justify-center py-0.5">
              <div className="border-t border-slate-200/80 w-full" />
              <span className="bg-white px-2.5 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Ou par e-mail
              </span>
            </div>

            <div className="relative">
              <Input
                label="Email professionnel"
                type="email"
                autoComplete="email"
                placeholder="nom@entreprise.cm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
                disabled={isLoading}
                className="h-10 rounded-2xl text-xs bg-white/90"
                required
              />
              <Mail className="pointer-events-none absolute right-3.5 top-7.5 h-4 w-4 text-slate-400" />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-700"
                >
                  Mot de passe
                </label>
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className="text-xs text-[#0071E3] hover:underline font-medium"
                >
                  Mot de passe oublié ?
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
                  className="h-10 rounded-2xl text-xs bg-white/90"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="apple-press absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
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

          <CardFooter className="flex flex-col space-y-3 pt-3 pb-5 px-5">
            <Button
              type="submit"
              className="apple-press w-full rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs h-10 shadow-xs"
              isLoading={isLoading}
              disabled={isLoading || Boolean(isDemoLoading)}
            >
              <Lock className="mr-2 h-3.5 w-3.5" />
              Se connecter
            </Button>

            <div className="text-center text-xs text-slate-500 font-normal">
              Pas encore d&apos;espace ?{" "}
              <Link
                href={ROUTES.SIGNUP}
                className="font-medium text-[#0071E3] hover:underline"
              >
                Créer un compte
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12 text-slate-900 selection:bg-[#0071E3]/15 selection:text-[#0071E3]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0071E3] text-white shadow-md shadow-[#0071E3]/20 mb-2">
            <Bot className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-slate-900">
            {APP_NAME}
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto font-normal">
            Plateforme commerciale IA omnicanale & recouvrement de créances
          </p>
        </div>

        <React.Suspense
          fallback={
            <div className="h-64 rounded-3xl border border-slate-200/60 bg-white/80 shadow-xs animate-pulse" />
          }
        >
          <LoginForm />
        </React.Suspense>
      </div>
    </div>
  );
}

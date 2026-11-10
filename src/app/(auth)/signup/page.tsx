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
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12 text-slate-900 selection:bg-[#0071E3]/15 selection:text-[#0071E3]">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0071E3] text-white shadow-md shadow-[#0071E3]/20 mb-2">
              <Bot className="h-6 w-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-slate-900">
              {APP_NAME}
            </h2>
          </div>

          <Card className="apple-glass-card rounded-3xl border border-white/60 bg-white/80 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-4">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#34C759]/10 text-[#34C759]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg font-semibold tracking-tight text-slate-900">Vérifiez vos e-mails</CardTitle>
              <CardDescription className="text-xs text-slate-500 font-normal">
                Un lien de confirmation a été envoyé à l&apos;adresse :
              </CardDescription>
              <p className="mt-1 font-semibold text-xs text-slate-900">{email}</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-3 text-xs text-slate-600 text-center font-normal">
              <p>
                Cliquez sur le lien dans l&apos;e-mail pour activer votre compte
                et démarrer la configuration de <strong>{companyName}</strong>.
              </p>
            </CardContent>
            <CardFooter className="pt-2">
              <Link
                href={ROUTES.LOGIN}
                className={buttonVariants({ variant: "outline", className: "apple-press w-full rounded-2xl text-xs font-medium" })}
              >
                Retour à la page de connexion
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12 text-slate-900 selection:bg-[#0071E3]/15 selection:text-[#0071E3]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0071E3] text-white shadow-md shadow-[#0071E3]/20 mb-2">
            <Bot className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-slate-900">
            {APP_NAME}
          </h1>
          <p className="text-xs text-slate-400 font-normal">
            Créez votre espace commercial omnicanal en quelques clics
          </p>
        </div>

        <Card className="apple-glass-card rounded-3xl border border-white/60 bg-white/80 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-2">
          <CardHeader className="pb-3 pt-4 px-5">
            <CardTitle className="text-lg font-semibold tracking-[-0.02em] text-slate-900">Nouveau compte</CardTitle>
            <CardDescription className="text-xs text-slate-500 font-normal">
              Renseignez vos coordonnées pour déployer votre agent commercial IA
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSignUp} noValidate>
            <CardContent className="space-y-3.5 px-5">
              {errorMessage && (
                <Alert variant="destructive" className="rounded-2xl">
                  <AlertTitle className="text-xs font-semibold">Erreur d&apos;inscription</AlertTitle>
                  <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="relative">
                <Input
                  label="Nom complet"
                  type="text"
                  autoComplete="name"
                  placeholder="Jean-Luc Fotso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={fieldErrors.fullName}
                  disabled={isLoading}
                  className="h-10 rounded-2xl text-xs bg-white/90"
                  required
                />
                <User className="pointer-events-none absolute right-3.5 top-7.5 h-4 w-4 text-slate-400" />
              </div>

              <div className="relative">
                <Input
                  label="Nom de l'entreprise ou boutique"
                  type="text"
                  placeholder="Fotso Commerce SARL"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  error={fieldErrors.companyName}
                  disabled={isLoading}
                  className="h-10 rounded-2xl text-xs bg-white/90"
                  required
                />
                <Building2 className="pointer-events-none absolute right-3.5 top-7.5 h-4 w-4 text-slate-400" />
              </div>

              <div className="relative">
                <Input
                  label="Email professionnel"
                  type="email"
                  autoComplete="email"
                  placeholder="contact@fotso.cm"
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
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Mot de passe (8 caractères minimum)
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

              <div>
                <Input
                  label="Confirmez le mot de passe"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={fieldErrors.confirmPassword}
                  disabled={isLoading}
                  className="h-10 rounded-2xl text-xs bg-white/90"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-3 pb-5 px-5">
              <Button
                type="submit"
                className="apple-press w-full rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs h-10 shadow-xs"
                isLoading={isLoading}
                disabled={isLoading}
              >
                <Lock className="mr-2 h-3.5 w-3.5" />
                Créer l&apos;espace de travail
              </Button>

              <div className="text-center text-xs text-slate-500 font-normal">
                Vous avez déjà un compte ?{" "}
                <Link
                  href={ROUTES.LOGIN}
                  className="font-medium text-[#0071E3] hover:underline"
                >
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

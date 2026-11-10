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
      setFieldError("L'adresse e-mail est obligatoire.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError("Veuillez saisir une adresse e-mail valide.");
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
      setErrorMessage("Une erreur imprévue est survenue. Veuillez réessayer.");
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
                Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien de réinitialisation sous peu.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-4">
              <Link
                href={ROUTES.LOGIN}
                className={buttonVariants({ variant: "outline", className: "apple-press w-full rounded-2xl text-xs font-medium" })}
              >
                <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                Retour à la connexion
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
            Récupération de compte OmniSales
          </p>
        </div>

        <Card className="apple-glass-card rounded-3xl border border-white/60 bg-white/80 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-2">
          <CardHeader className="pb-3 pt-4 px-5">
            <CardTitle className="text-lg font-semibold tracking-[-0.02em] text-slate-900">Mot de passe oublié</CardTitle>
            <CardDescription className="text-xs text-slate-500 font-normal">
              Entrez votre adresse e-mail professionnelle pour recevoir un lien de réinitialisation sécurisé
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleResetPassword} noValidate>
            <CardContent className="space-y-4 px-5">
              {errorMessage && (
                <Alert variant="destructive" className="rounded-2xl">
                  <AlertTitle className="text-xs font-semibold">Erreur</AlertTitle>
                  <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="relative">
                <Input
                  label="Email professionnel"
                  type="email"
                  autoComplete="email"
                  placeholder="nom@entreprise.cm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldError}
                  disabled={isLoading}
                  className="h-10 rounded-2xl text-xs bg-white/90"
                  required
                />
                <Mail className="pointer-events-none absolute right-3.5 top-7.5 h-4 w-4 text-slate-400" />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-3 pb-5 px-5">
              <Button
                type="submit"
                className="apple-press w-full rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs h-10 shadow-xs"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Envoyer le lien de réinitialisation
              </Button>

              <div className="text-center text-xs text-slate-500 font-normal">
                <Link
                  href={ROUTES.LOGIN}
                  className="font-medium text-[#0071E3] hover:underline inline-flex items-center"
                >
                  <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                  Retour à la connexion
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

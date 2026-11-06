"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // 1. Clear Supabase session if any
      const supabase = createClient();
      await supabase.auth.signOut().catch(() => {});

      // 2. Clear server demo cookies
      await fetch("/api/auth/logout", {
        method: "POST",
      }).catch(() => {});

      // 3. Navigate to /login and refresh session
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      isLoading={isLoading}
      disabled={isLoading}
      className="text-slate-600 hover:text-slate-900 border-slate-200"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Déconnexion
    </Button>
  );
}

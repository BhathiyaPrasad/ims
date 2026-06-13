"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { verifyCredentials } from "@/lib/accounts";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = verifyCredentials(email, password);
    if (!account) {
      setError("Invalid email or password.");
      return;
    }
    setError(null);

    if (account.mustReset) {
      router.push(`/student/set-password?email=${encodeURIComponent(email)}`);
      return;
    }

    login({
      role: "student",
      firstName: account.firstName,
      lastName: account.lastName,
      studentId: account.studentId,
      email: account.email,
    });
    router.push("/student/dashboard");
  };

  return (
    <div className="grid flex-1 lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden min-h-[260px] bg-gradient-to-br from-navy-deep via-teal to-navy lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="absolute bottom-8 left-8 text-white/70">
          <p className="text-sm">Internship Management System</p>
          <p className="text-xs text-white/50">University of Ruhuna</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-teal px-8 py-16 text-white">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold">IMS</h1>
            <p className="mt-1 text-sm uppercase tracking-[0.3em] text-white/60">
              University System
            </p>
          </div>

          <p className="mt-10 text-center text-white/80">
            Sign in with your university credentials to access the Internship
            Management System
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
                University Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@university.ruh.ac.lk"
                required
                className="w-full rounded-lg border border-white/40 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-periwinkle/60"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold"
              >
                Temporary Password
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-white/40 accent-periwinkle"
              />
              Remember Me
            </label>

            {error && <p className="text-sm text-red-300">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-lg bg-periwinkle py-3.5 text-sm font-bold text-navy-deep transition-colors hover:bg-periwinkle/90"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center bg-teal text-white">
            Loading…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
      <Footer />
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { BackHome } from "@/components/layout/BackHome";
import { Footer } from "@/components/layout/Footer";
import { AuthTabs, type AuthMode } from "@/components/auth/AuthTabs";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import {
  createDepartmentAccount,
  getAccount,
  verifyCredentials,
} from "@/lib/accounts";

export default function DepartmentAuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signup");

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup") {
      if (form.password !== form.confirm) {
        setError("Passwords do not match.");
        return;
      }
      if (getAccount(form.email)) {
        setError("An account with this email already exists. Please log in.");
        return;
      }
      createDepartmentAccount(form.email, form.password);
      setError(null);
      login({ role: "department", email: form.email });
      router.push("/department/profile/edit");
      return;
    }

    const account = verifyCredentials(form.email, form.password);
    if (!account || account.role !== "department") {
      setError("Invalid email or password.");
      return;
    }

    setError(null);
    login({ role: "department", email: form.email });
    router.push("/department/dashboard");
  };

  return (
    <>
      <main className="flex-1 bg-sky-soft">
        <div className="mx-auto max-w-md px-6 py-10">
          <div className="mb-6">
            <BackHome />
          </div>

          <div className="overflow-hidden rounded-2xl shadow-xl">
            {/* Header */}
            <div className="bg-navy-deep px-8 py-8 text-center text-white">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                <Building2 className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold">Department Portal</h1>
              <p className="mt-1 text-sm text-white/75">
                Manage placements &amp; approvals
              </p>
            </div>

            {/* Body */}
            <div className="bg-panel px-8 py-8">
              <AuthTabs mode={mode} onChange={setMode} />

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <Field label="University Email Address" htmlFor="email">
                  <Input
                    id="email"
                    type="email"
                    placeholder="@university.edu"
                    value={form.email}
                    onChange={set("email")}
                    required
                  />
                </Field>

                <Field label="Create Password" htmlFor="password">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                    required
                  />
                </Field>

                {mode === "signup" && (
                  <Field label="Confirm Password" htmlFor="confirm">
                    <Input
                      id="confirm"
                      type="password"
                      placeholder="••••••••"
                      value={form.confirm}
                      onChange={set("confirm")}
                      required
                    />
                  </Field>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full py-3.5">
                  {mode === "signup" ? "Sign Up" : "Login"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

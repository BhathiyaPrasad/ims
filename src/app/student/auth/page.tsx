"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, KeyRound, Copy, Check } from "lucide-react";
import { BackHome } from "@/components/layout/BackHome";
import { Footer } from "@/components/layout/Footer";
import { Field, Input } from "@/components/ui/Field";
import { Button, LinkButton } from "@/components/ui/Button";
import { createStudentAccount, getAccount } from "@/lib/accounts";

export default function StudentSignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
  });
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (getAccount(form.email)) {
      setError("An account with this email already exists. Please log in.");
      return;
    }
    setError(null);
    setTempPassword(createStudentAccount(form));
  };

  const copy = () => {
    if (!tempPassword) return;
    navigator.clipboard?.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <main className="flex-1 bg-sky">
        <div className="mx-auto max-w-md px-6 py-10">
          <div className="mb-6">
            <BackHome />
          </div>

          <div className="overflow-hidden rounded-2xl shadow-xl">
            {/* Header */}
            <div className="bg-navy px-8 py-8 text-center text-white">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold">Student Portal</h1>
              <p className="mt-1 text-sm text-white/75">
                Register to access your internship dashboard
              </p>
            </div>

            {/* Body */}
            <div className="bg-panel px-8 py-8">
              {tempPassword ? (
                <AccountCreated
                  email={form.email}
                  tempPassword={tempPassword}
                  copied={copied}
                  onCopy={copy}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name" htmlFor="firstName">
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        value={form.firstName}
                        onChange={set("firstName")}
                        required
                      />
                    </Field>
                    <Field label="Last Name" htmlFor="lastName">
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        value={form.lastName}
                        onChange={set("lastName")}
                      />
                    </Field>
                  </div>

                  <Field label="Student ID" htmlFor="studentId">
                    <Input
                      id="studentId"
                      placeholder="e.g. SC/2020/12345"
                      value={form.studentId}
                      onChange={set("studentId")}
                      required
                    />
                  </Field>

                  <Field label="University Email" htmlFor="email">
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@university.ruh.ac.lk"
                      value={form.email}
                      onChange={set("email")}
                      required
                    />
                  </Field>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <Button type="submit" variant="dark" className="w-full py-3.5">
                    Create Account
                  </Button>

                  <p className="text-center text-sm text-navy-deep/70">
                    Already have an account?{" "}
                    <Link
                      href="/student/login"
                      className="font-semibold text-navy hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function AccountCreated({
  email,
  tempPassword,
  copied,
  onCopy,
}: {
  email: string;
  tempPassword: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy/10">
        <KeyRound className="h-6 w-6 text-navy" />
      </div>
      <h2 className="text-lg font-bold text-navy-deep">Account Created</h2>
      <p className="mt-2 text-sm text-navy-deep/70">
        Use this <strong>temporary password</strong> to log in for the first
        time. You&apos;ll be asked to set a new one.
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-navy/20 bg-white px-4 py-3">
        <code className="text-lg font-bold tracking-wider text-navy-deep">
          {tempPassword}
        </code>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 rounded-md bg-navy/10 px-2.5 py-1.5 text-xs font-medium text-navy hover:bg-navy/20"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <p className="mt-3 text-xs text-navy-deep/60">
        (In production this would be emailed to {email}.)
      </p>

      <LinkButton
        href={`/student/login?email=${encodeURIComponent(email)}`}
        variant="dark"
        className="mt-6 w-full py-3.5"
      >
        Continue to Login
      </LinkButton>
    </div>
  );
}

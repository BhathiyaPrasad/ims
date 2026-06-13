"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Pencil,
  IdCard,
  Mail,
  Link2,
  Code2,
  Calculator,
  FileText,
  Star,
  User as UserIcon,
} from "lucide-react";
import { StudentNav } from "@/components/layout/StudentNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { calculateGpa } from "@/lib/gpa";

export default function ManagementHub() {
  const router = useRouter();
  const { user, ready, profile, semesters, setProfile } = useAuth();

  useEffect(() => {
    if (ready && user?.role !== "student") router.replace("/student/login");
  }, [ready, user, router]);

  const gpa = useMemo(() => calculateGpa(semesters), [semesters]);

  if (!ready || user?.role !== "student" || !profile) {
    return (
      <main className="flex flex-1 items-center justify-center bg-sky text-navy-deep">
        Loading…
      </main>
    );
  }

  const updateLink = (key: "linkedin" | "github", value: string) =>
    setProfile({ ...profile, [key]: value });

  return (
    <>
      <StudentNav />

      <main className="flex-1 bg-sky">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-deep">
            MANAGEMENT HUB
          </h1>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Profile column */}
            <aside className="rounded-2xl bg-sky-soft/70 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-navy/20">
                    {profile.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.photo}
                        alt={profile.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-14 w-14 text-navy-deep/60" />
                    )}
                  </div>
                  <Link
                    href="/student/profile/edit"
                    aria-label="Edit profile"
                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-navy-deep text-white shadow-md hover:bg-navy"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <h2 className="mt-4 text-lg font-bold text-navy-deep">
                  {profile.name || "Student"}
                </h2>
                <p className="text-sm text-navy-deep/70">
                  {profile.specialization
                    ? `${profile.specialization} Undergraduate`
                    : "Undergraduate"}
                </p>
                <span className="mt-3 rounded-md bg-navy-deep px-3 py-1.5 text-xs font-semibold text-white">
                  CURRENT GPA : {gpa.toFixed(2)}
                </span>
              </div>

              <hr className="my-6 border-navy-deep/15" />

              <dl className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <IdCard className="mt-0.5 h-5 w-5 text-navy-deep/60" />
                  <div>
                    <dt className="text-navy-deep/60">Student ID</dt>
                    <dd className="font-semibold text-navy-deep">
                      {profile.studentId || "—"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-navy-deep/60" />
                  <div>
                    <dt className="text-navy-deep/60">University Email</dt>
                    <dd className="font-semibold text-navy-deep">
                      {profile.email || "—"}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-5">
                <p className="mb-1.5 text-sm font-bold text-navy-deep">
                  Confirmed Specialization
                </p>
                <div className="rounded-lg border border-navy-deep/15 bg-sky/60 px-4 py-2.5 text-sm text-navy-deep/70">
                  {profile.specialization || "Select Specialization"}
                </div>
              </div>

              <Link
                href="/student/profile/edit"
                className="mt-4 block rounded-lg bg-navy-deep py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-navy"
              >
                Edit profile
              </Link>

              <p className="mt-6 text-sm font-bold tracking-wide text-navy-deep">
                PROFESSIONAL LINKS
              </p>
              <div className="mt-3 space-y-3">
                <LinkInput
                  icon={<Link2 className="h-4 w-4" />}
                  placeholder="LinkedIn Link"
                  value={profile.linkedin ?? ""}
                  onChange={(v) => updateLink("linkedin", v)}
                />
                <LinkInput
                  icon={<Code2 className="h-4 w-4" />}
                  placeholder="GitHub Link"
                  value={profile.github ?? ""}
                  onChange={(v) => updateLink("github", v)}
                />
              </div>
            </aside>

            {/* Modules column */}
            <div className="grid gap-6 lg:col-span-2 lg:auto-rows-min sm:grid-cols-2">
              <ModuleCard
                icon={<Calculator className="h-6 w-6" />}
                title="GPA Calculator"
                body="Calculate and simulate your academic standing. Estimate final results based on target grades."
                cta="Open Module →"
                href="/student/gpa"
              />
              <ModuleCard
                icon={<FileText className="h-6 w-6" />}
                title="Portfolio"
                body="Upload and manage your professional documents. Keep your resume up to date for recruiters."
                cta="Manage Files →"
                href="/student/portfolio"
              />

              <div className="overflow-hidden rounded-2xl bg-sky-soft/70 shadow-sm sm:col-span-2">
                <div className="flex items-center gap-3 bg-navy-deep px-6 py-4 text-white">
                  <Star className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">Internship Status</h3>
                </div>
                <div className="p-6">
                  <p className="text-navy-deep/80">
                    Monitor your industrial placement progress. Track
                    applications, view selection status, and submit official
                    internship offer letters for department approval.
                  </p>
                  <div className="mt-6 flex justify-end">
                    <Link
                      href="/student/internship-status"
                      className="rounded-lg bg-navy-deep px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy"
                    >
                      Check Updates
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function ModuleCard({
  icon,
  title,
  body,
  cta,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-sky-soft/70 shadow-sm">
      <div className="flex items-center gap-3 bg-navy-deep px-6 py-4 text-white">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <p className="text-navy-deep/80">{body}</p>
        <Link
          href={href}
          className="mt-8 font-bold text-navy-deep hover:text-navy"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}

function LinkInput({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-navy-deep/15 bg-sky/60 px-3 py-2.5">
      <span className="text-navy-deep/60">{icon}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-navy-deep placeholder:text-navy-deep/50 focus:outline-none"
      />
    </div>
  );
}

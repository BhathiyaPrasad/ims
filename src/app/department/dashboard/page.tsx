"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, ClipboardCheck, BarChart3, Pencil } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

const cards = [
  {
    icon: Users,
    title: "Student Placements",
    body: "Review registered students and their internship applications.",
  },
  {
    icon: ClipboardCheck,
    title: "Approvals",
    body: "Approve or reject placement and record-book submissions.",
  },
  {
    icon: BarChart3,
    title: "Program Insights",
    body: "Monitor overall internship program performance and reporting.",
  },
];

export default function DepartmentDashboard() {
  const router = useRouter();
  const { user, ready, deptProfile } = useAuth();

  useEffect(() => {
    if (ready && user?.role !== "department") router.replace("/department/auth");
  }, [ready, user, router]);

  if (!ready || user?.role !== "department") {
    return (
      <main className="flex flex-1 items-center justify-center bg-sky-soft text-navy-deep">
        Loading…
      </main>
    );
  }

  return (
    <>
      <DashboardHeader subtitle="Department" />
      <main className="flex-1 bg-sky-soft">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-navy-deep">
                {deptProfile?.fullName
                  ? `Welcome, ${deptProfile.fullName}`
                  : "Department Dashboard"}
              </h1>
              <p className="mt-1 text-sm text-navy-deep/70">
                {deptProfile?.designation
                  ? `${deptProfile.designation} · ${user.email}`
                  : user.email}
              </p>
            </div>
            <Link
              href="/department/profile/edit"
              className="inline-flex items-center gap-2 rounded-lg bg-navy-deep px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy"
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {cards.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
                <Icon className="h-6 w-6 text-navy" />
                <h2 className="mt-4 font-semibold text-navy-deep">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-navy-deep/70">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 rounded-xl border border-dashed border-navy/20 bg-white/50 p-6 text-center text-sm text-navy-deep/60">
            This portal is a frontend scaffold. Connect it to your backend to
            enable live placement management and approvals.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

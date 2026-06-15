"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  CheckCircle2,
  Building2,
  Rocket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DepartmentNav } from "@/components/layout/DepartmentNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

type Status = "pending" | "approved";

interface RequestRow {
  id: string;
  name: string;
  studentId: string;
  company: string;
  icon: typeof Building2;
  position: string;
  date: string;
  relative: string;
  status: Status;
}

const INITIAL: RequestRow[] = [
  {
    id: "2024-IM-0892",
    name: "Marcus Sterling",
    studentId: "2024-IM-0892",
    company: "Lumina Tech Systems",
    icon: Building2,
    position: "UI/UX Design Intern",
    date: "Oct 12, 2023",
    relative: "2 DAYS AGO",
    status: "pending",
  },
  {
    id: "2024-IM-0412",
    name: "Elena Rodriguez",
    studentId: "2024-IM-0412",
    company: "Global Finance Corp",
    icon: Building2,
    position: "Data Analyst Intern",
    date: "Oct 13, 2023",
    relative: "1 DAY AGO",
    status: "pending",
  },
  {
    id: "2024-IM-0931",
    name: "Jameson Wu",
    studentId: "2024-IM-0931",
    company: "Nebula Startups",
    icon: Rocket,
    position: "Software Engineering",
    date: "Oct 14, 2023",
    relative: "TODAY",
    status: "pending",
  },
];

const TOTAL_PENDING = 42;

export default function ApprovalsPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [rows, setRows] = useState<RequestRow[]>(INITIAL);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (ready && user?.role !== "department") router.replace("/department/auth");
  }, [ready, user, router]);

  const pendingCount = useMemo(
    () => rows.filter((r) => r.status === "pending").length,
    [rows],
  );
  const approvedCount = useMemo(
    () => rows.filter((r) => r.status === "approved").length,
    [rows],
  );

  const approve = (id: string) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)),
    );

  if (!ready || user?.role !== "department") {
    return (
      <main className="flex flex-1 items-center justify-center bg-sky-soft text-navy-deep">
        Loading…
      </main>
    );
  }

  return (
    <>
      <DepartmentNav />

      <main className="flex-1 bg-sky-soft">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-2xl font-bold text-navy-deep">
            Internship Requests
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-deep/70">
            Centralized management for student internship placements. Review
            pending records, verify company details and track approval
            workflows for the current academic session.
          </p>

          {/* Stat cards */}
          <div className="mt-8 flex flex-wrap gap-5">
            <StatCard
              icon={<ClipboardList className="h-5 w-5 text-navy-deep" />}
              label="Pending Review"
              value={TOTAL_PENDING - approvedCount}
            />
            <StatCard
              icon={<CheckCircle2 className="h-5 w-5 text-navy-deep" />}
              label="Approved"
              value={approvedCount}
            />
          </div>

          {/* Table */}
          <div className="mt-8 overflow-hidden rounded-2xl bg-[#5b93bf] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left text-navy-deep">
                    {[
                      "Student & ID",
                      "Company",
                      "Job Position",
                      "Date Submitted",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className="px-6 py-4 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`align-middle ${
                        i % 2 === 0 ? "bg-white" : "bg-[#eaf3fa]"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="h-9 w-9 shrink-0 rounded-full bg-navy/15" />
                          <div>
                            <p className="font-semibold text-navy-deep">
                              {r.name}
                            </p>
                            <p className="text-xs text-navy-deep/60">
                              ID: {r.studentId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 text-navy-deep/90">
                          <r.icon className="h-4 w-4 text-navy" />
                          {r.company}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-navy/10 px-3 py-1.5 text-sm text-navy-deep">
                          {r.position}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-navy-deep/90">{r.date}</p>
                        <p className="text-xs uppercase text-navy-deep/55">
                          {r.relative}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {r.status === "pending" ? (
                          <span className="flex items-center gap-2 font-medium text-amber-600">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            Pending Review
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 font-medium text-emerald-600">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Approved
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => approve(r.id)}
                            disabled={r.status === "approved"}
                            className="rounded-md bg-navy-deep px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy disabled:opacity-40"
                          >
                            {r.status === "approved" ? "Approved" : "Review"}
                          </button>
                          <button className="text-sm font-semibold text-navy hover:underline">
                            View Record Book →
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 text-sm text-navy-deep">
              <p>
                Showing <strong>{rows.length}</strong> of{" "}
                <strong>{TOTAL_PENDING}</strong> pending requests
              </p>
              <div className="flex items-center gap-2">
                <PageBtn
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </PageBtn>
                {[1, 2, 3].map((n) => (
                  <PageBtn
                    key={n}
                    active={page === n}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </PageBtn>
                ))}
                <PageBtn
                  onClick={() => setPage((p) => Math.min(3, p + 1))}
                  disabled={page === 3}
                >
                  <ChevronRight className="h-4 w-4" />
                </PageBtn>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="w-56 rounded-2xl bg-[#8fa9cf] p-5 text-white shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/70">
        {icon}
      </span>
      <p className="mt-10 text-lg font-semibold">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function PageBtn({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors disabled:opacity-40 ${
        active
          ? "border-navy-deep bg-navy-deep text-white"
          : "border-navy-deep/30 text-navy-deep hover:bg-navy-deep/10"
      }`}
    >
      {children}
    </button>
  );
}

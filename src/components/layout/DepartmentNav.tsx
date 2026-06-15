"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { label: "Overview", href: "/department/dashboard" },
  { label: "Verification", href: "/department/verification" },
  { label: "student Details", href: "/department/students" },
  { label: "Approvals", href: "/department/approvals" },
];

export function DepartmentNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { deptProfile, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const name = deptProfile?.fullName || "Admin User";

  return (
    <header className="bg-navy-deep text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/department/dashboard" className="text-2xl font-bold tracking-wide">
          IMS
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-10 text-base font-semibold lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className={`transition-colors ${
                    active ? "text-white" : "text-white/75 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-sm font-semibold text-white/90">{name}</p>
            <p className="text-xs italic text-white/55">Dept. Admin</p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-2 ring-white/30">
            {deptProfile?.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={deptProfile.photo} alt={name} className="h-full w-full object-cover" />
            ) : (
              <UserRound className="h-6 w-6 text-white/80" />
            )}
          </span>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </header>
  );
}

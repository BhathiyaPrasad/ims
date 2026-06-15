"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  DepartmentProfile,
  Semester,
  StudentProfile,
  User,
} from "@/lib/types";
import { defaultSemesters } from "@/lib/semesters";

const USER_KEY = "ims.user";
const SEMESTERS_KEY = "ims.semesters";
const PROFILE_KEY = "ims.profile";
const DEPT_PROFILE_KEY = "ims.deptProfile";

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  semesters: Semester[];
  profile: StudentProfile | null;
  deptProfile: DepartmentProfile | null;
  login: (user: User) => void;
  logout: () => void;
  setSemesters: (semesters: Semester[]) => void;
  setProfile: (profile: StudentProfile) => void;
  setDeptProfile: (profile: DepartmentProfile) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function seedStudentProfile(user: Extract<User, { role: "student" }>): StudentProfile {
  return {
    name: `${user.firstName} ${user.lastName}`.trim(),
    studentId: user.studentId,
    email: user.email,
    specialization: "",
    specializationConfirmed: false,
  };
}

function seedDeptProfile(user: Extract<User, { role: "department" }>): DepartmentProfile {
  return {
    fullName: "",
    universityId: "",
    designation: "",
    academicTitle: "",
    contactNumber: "",
    email: user.email,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [semesters, setSemestersState] = useState<Semester[]>([]);
  const [profile, setProfileState] = useState<StudentProfile | null>(null);
  const [deptProfile, setDeptProfileState] = useState<DepartmentProfile | null>(
    null,
  );
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on mount (frontend-only persistence).
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(USER_KEY);
      if (rawUser) setUser(JSON.parse(rawUser));

      const rawProfile = localStorage.getItem(PROFILE_KEY);
      if (rawProfile) setProfileState(JSON.parse(rawProfile));

      const rawDept = localStorage.getItem(DEPT_PROFILE_KEY);
      if (rawDept) setDeptProfileState(JSON.parse(rawDept));

      const rawSemesters = localStorage.getItem(SEMESTERS_KEY);
      setSemestersState(
        rawSemesters ? JSON.parse(rawSemesters) : defaultSemesters(),
      );
    } catch {
      setSemestersState(defaultSemesters());
    }
    setReady(true);
  }, []);

  const login = (next: User) => {
    setUser(next);
    localStorage.setItem(USER_KEY, JSON.stringify(next));

    // Seed the relevant profile on first login if none exists yet.
    if (next.role === "student" && !localStorage.getItem(PROFILE_KEY)) {
      const seeded = seedStudentProfile(next);
      setProfileState(seeded);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(seeded));
    }
    if (next.role === "department" && !localStorage.getItem(DEPT_PROFILE_KEY)) {
      const seeded = seedDeptProfile(next);
      setDeptProfileState(seeded);
      localStorage.setItem(DEPT_PROFILE_KEY, JSON.stringify(seeded));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  const setSemesters = (next: Semester[]) => {
    setSemestersState(next);
    localStorage.setItem(SEMESTERS_KEY, JSON.stringify(next));
  };

  const setProfile = (next: StudentProfile) => {
    setProfileState(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  };

  const setDeptProfile = (next: DepartmentProfile) => {
    setDeptProfileState(next);
    localStorage.setItem(DEPT_PROFILE_KEY, JSON.stringify(next));
  };

  const value = useMemo(
    () => ({
      user,
      ready,
      semesters,
      profile,
      deptProfile,
      login,
      logout,
      setSemesters,
      setProfile,
      setDeptProfile,
    }),
    [user, ready, semesters, profile, deptProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

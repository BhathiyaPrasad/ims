"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Semester, StudentProfile, User } from "@/lib/types";
import { defaultSemesters } from "@/lib/semesters";

const USER_KEY = "ims.user";
const SEMESTERS_KEY = "ims.semesters";
const PROFILE_KEY = "ims.profile";

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  semesters: Semester[];
  profile: StudentProfile | null;
  login: (user: User) => void;
  logout: () => void;
  setSemesters: (semesters: Semester[]) => void;
  setProfile: (profile: StudentProfile) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function seedProfile(user: User): StudentProfile {
  if (user.role === "student") {
    return {
      name: `${user.firstName} ${user.lastName}`.trim(),
      studentId: user.studentId,
      email: user.email,
      specialization: "",
      specializationConfirmed: false,
    };
  }
  return {
    name: "",
    studentId: "",
    email: user.email,
    specialization: "",
    specializationConfirmed: false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [semesters, setSemestersState] = useState<Semester[]>([]);
  const [profile, setProfileState] = useState<StudentProfile | null>(null);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on mount (frontend-only persistence).
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(USER_KEY);
      if (rawUser) setUser(JSON.parse(rawUser));

      const rawProfile = localStorage.getItem(PROFILE_KEY);
      if (rawProfile) setProfileState(JSON.parse(rawProfile));

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

    // Seed a profile on first login if none exists yet.
    const existing = localStorage.getItem(PROFILE_KEY);
    if (!existing) {
      const seeded = seedProfile(next);
      setProfileState(seeded);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(seeded));
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

  const value = useMemo(
    () => ({
      user,
      ready,
      semesters,
      profile,
      login,
      logout,
      setSemesters,
      setProfile,
    }),
    [user, ready, semesters, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

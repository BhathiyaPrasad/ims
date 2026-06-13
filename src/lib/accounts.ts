// Frontend-only account store backed by localStorage. Swap these functions
// for real API calls later; the UI does not need to change.

const ACCOUNTS_KEY = "ims.accounts";

export interface StudentAccount {
  role: "student";
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  password: string;
  /** True until the student replaces their temporary password. */
  mustReset: boolean;
}

type AccountMap = Record<string, StudentAccount>;

function load(): AccountMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function save(map: AccountMap) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(map));
}

const key = (email: string) => email.trim().toLowerCase();

/** Generates a readable temporary password, e.g. "RUH-7K2Q9F". */
export function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return `RUH-${out}`;
}

/** Registers a student and returns the issued temporary password. */
export function createStudentAccount(data: {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
}): string {
  const map = load();
  const tempPassword = generateTempPassword();
  map[key(data.email)] = {
    role: "student",
    firstName: data.firstName,
    lastName: data.lastName,
    studentId: data.studentId,
    email: data.email,
    password: tempPassword,
    mustReset: true,
  };
  save(map);
  return tempPassword;
}

export function getAccount(email: string): StudentAccount | undefined {
  return load()[key(email)];
}

/** Returns the account when email + password match, otherwise null. */
export function verifyCredentials(
  email: string,
  password: string,
): StudentAccount | null {
  const account = load()[key(email)];
  if (!account || account.password !== password) return null;
  return account;
}

/** Replaces the password and clears the must-reset flag. */
export function setPassword(email: string, newPassword: string): StudentAccount | null {
  const map = load();
  const account = map[key(email)];
  if (!account) return null;
  account.password = newPassword;
  account.mustReset = false;
  save(map);
  return account;
}

/** At least 8 chars with a mix of letters, numbers & symbols. */
export function isStrongPassword(pw: string): boolean {
  return (
    pw.length >= 8 &&
    /[A-Za-z]/.test(pw) &&
    /\d/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw)
  );
}

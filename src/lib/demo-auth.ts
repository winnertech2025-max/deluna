"use client";

export type DemoUser = {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
};

const usersKey = "deluna_demo_users";
const currentKey = "deluna_current_user";
const resetKey = "deluna_reset_codes";

const defaultAdmin: DemoUser = {
  name: "Admin",
  email: "admin@deluna.local",
  password: "Deluna@2026",
  role: "admin"
};

export function getDemoUsers(): DemoUser[] {
  const raw = window.localStorage.getItem(usersKey);
  const users = raw ? (JSON.parse(raw) as DemoUser[]) : [];
  if (!users.some((user) => user.email === defaultAdmin.email)) {
    users.push(defaultAdmin);
    window.localStorage.setItem(usersKey, JSON.stringify(users));
  }
  return users;
}

export function signupDemoUser(user: Omit<DemoUser, "role">) {
  const users = getDemoUsers();
  if (users.some((candidate) => candidate.email === user.email)) {
    throw new Error("This email is already registered.");
  }
  const next: DemoUser = { ...user, role: "customer" };
  users.push(next);
  window.localStorage.setItem(usersKey, JSON.stringify(users));
  setCurrentUser(next);
  return next;
}

export function loginDemoUser(email: string, password: string) {
  const user = getDemoUsers().find((candidate) => candidate.email === email && candidate.password === password);
  if (!user) throw new Error("Email or password is incorrect.");
  setCurrentUser(user);
  return user;
}

export function findDemoUser(email: string) {
  return getDemoUsers().find((candidate) => candidate.email === email) || null;
}

export function createPasswordResetCode(email: string) {
  const user = findDemoUser(email);
  if (!user) throw new Error("We could not find an account with this email.");
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const raw = window.localStorage.getItem(resetKey);
  const codes = raw ? JSON.parse(raw) as Record<string, { code: string; expiresAt: number }> : {};
  codes[email] = { code, expiresAt: Date.now() + 10 * 60 * 1000 };
  window.localStorage.setItem(resetKey, JSON.stringify(codes));
  return code;
}

export function resetDemoPassword(email: string, code: string, password: string) {
  const raw = window.localStorage.getItem(resetKey);
  const codes = raw ? JSON.parse(raw) as Record<string, { code: string; expiresAt: number }> : {};
  const reset = codes[email];
  if (!reset || reset.code !== code || reset.expiresAt < Date.now()) {
    throw new Error("Reset code is invalid or expired.");
  }
  const users = getDemoUsers();
  const index = users.findIndex((candidate) => candidate.email === email);
  if (index < 0) throw new Error("We could not find an account with this email.");
  users[index] = { ...users[index], password };
  delete codes[email];
  window.localStorage.setItem(usersKey, JSON.stringify(users));
  window.localStorage.setItem(resetKey, JSON.stringify(codes));
  return users[index];
}

export function setCurrentUser(user: DemoUser) {
  window.localStorage.setItem(currentKey, JSON.stringify(user));
  window.localStorage.setItem("deluna_profile_name", user.name);
  window.localStorage.setItem("deluna_profile_email", user.email);
  window.localStorage.setItem("deluna_profile_role", user.role);
  window.dispatchEvent(new Event("deluna-auth"));
}

export function getCurrentUser(): DemoUser | null {
  const raw = window.localStorage.getItem(currentKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function logoutDemoUser() {
  window.localStorage.removeItem(currentKey);
  window.localStorage.removeItem("deluna_profile_name");
  window.localStorage.removeItem("deluna_profile_email");
  window.localStorage.removeItem("deluna_profile_role");
  window.dispatchEvent(new Event("deluna-auth"));
}

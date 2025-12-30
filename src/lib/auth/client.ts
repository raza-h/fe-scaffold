"use client";

import { apiClient } from "@/lib/api/client";
import { User, LoginCredentials } from "./types";

export async function loginUser(credentials: LoginCredentials): Promise<{ user: User } | null> {
  try {
    const response = await apiClient.post<{ user: User }>("/auth/login", credentials, { _silent: true } as never);
    return response.data;
  } catch {
    return null;
  }
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient.get<User>("/auth/current", { _silent: true } as never);
    return response.data;
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<boolean> {
  try {
    await apiClient.post("/auth/logout", {}, { _silent: true } as never);
    return true;
  } catch {
    return false;
  }
}

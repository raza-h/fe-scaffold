"use client";

import { api } from "@/lib/api/client";
import { User, LoginCredentials } from "./types";

export async function loginUser(credentials: LoginCredentials): Promise<{ user: User }> {
  const data = await api.post<{ user: User }>("/auth/login", credentials);
  return data;
}

export async function fetchCurrentUser(): Promise<User | null> {
  let response = await fetch("/api/auth/current", {
    credentials: "include",
  });

  if (response.status === 401) {
    const refreshResponse = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      response = await fetch("/api/auth/current", {
        credentials: "include",
      });
    }
  }

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout");
}

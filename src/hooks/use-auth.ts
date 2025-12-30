"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser, fetchCurrentUser } from "@/lib/auth/client";
import { LoginCredentials } from "@/lib/auth/types";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await loginUser(credentials);
      if (result) {
        queryClient.setQueryData(["auth", "user"], result.user);
        toast.success("Successfully logged in");
        return result.user;
      }
      toast.error("Failed to login");
      return null;
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    const success = await logoutUser();
    queryClient.setQueryData(["auth", "user"], null);
    if (success) {
      toast.success("Successfully logged out");
    } else {
      toast.error("Failed to logout");
    }
    router.push("/login");
  }, [queryClient, router]);

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}

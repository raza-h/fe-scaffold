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
      try {
        const { user } = await loginUser(credentials);
        queryClient.setQueryData(["auth", "user"], user);
        toast.success("Successfully logged in");
        return user;
      } catch (error) {
        toast.error("Failed to login");
        throw error;
      }
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      queryClient.setQueryData(["auth", "user"], null);
      toast.success("Successfully logged out");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
      throw error;
    }
  }, [queryClient, router]);

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}

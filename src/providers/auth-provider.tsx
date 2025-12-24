"use client";

import { useEffect, ReactNode, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/auth/types";

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (initialUser !== undefined) {
      queryClient.setQueryData(["auth", "user"], initialUser);
    }
  }, [initialUser, queryClient]);

  return <>{children}</>;
}

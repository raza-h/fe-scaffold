"use client";

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { api, NetworkError } from "@/lib/api/client";

export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<T, NetworkError>, "queryKey" | "queryFn">
) {
  return useQuery<T, NetworkError>({
    queryKey: key,
    queryFn: () => api.get<T>(url),
    ...options,
  });
}

export function useApiMutation<TData, TVariables>(
  url: string,
  method: "post" | "put" | "patch" | "delete" = "post",
  options?: Omit<UseMutationOptions<TData, NetworkError, TVariables>, "mutationFn">
) {
  return useMutation<TData, NetworkError, TVariables>({
    mutationFn: (variables) => {
      if (method === "delete") {
        return api.delete<TData>(url);
      }
      return api[method]<TData>(url, variables);
    },
    ...options,
  });
}


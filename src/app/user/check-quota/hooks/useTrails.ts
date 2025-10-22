// src/app/user/check-quota/hooks/useTrails.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/api/client";
import type { ApiEither, Trail } from "../types";
import { unwrap } from "../utils";

export function useTrails() {
  const q = useQuery({
    queryKey: ["public-trails-active"],
    queryFn: () => api<ApiEither<Trail[]>>("/api/trails?active=1"),
    staleTime: 60_000,
  });
  return { ...q, data: unwrap<Trail[]>(q.data, []) };
}

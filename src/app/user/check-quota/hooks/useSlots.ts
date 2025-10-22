// src/app/user/check-quota/hooks/useSlots.ts
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/api/client";
import type { ApiEither, Slot } from "../types";
import { unwrap } from "../utils";

export function useSlots(trailId: string, fromISO: string, toISO: string) {
  const q = useQuery({
    queryKey: ["slots", trailId, fromISO, toISO],
    queryFn: () => api<ApiEither<Slot[]>>(`/api/trails/${trailId}/slots?from=${fromISO}&to=${toISO}`),
    enabled: !!trailId,
  });

  const data = useMemo(
    () => unwrap<Slot[]>(q.data, []).sort((a, b) => a.date.localeCompare(b.date)),
    [q.data],
  );

  return { ...q, data };
}

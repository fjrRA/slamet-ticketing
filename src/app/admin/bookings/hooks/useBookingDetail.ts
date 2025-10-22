// src/app/admin/booking/hooks/useBookingDetail.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBookingDetail, patchBooking, createMember, updateMember, deleteMember, checkinMember, checkinAll,
} from '@/app/api/admin';
// import type { BookingDetail } from '@/types/api';
import type { PatchBookingPayload, MemberPayload } from '@/app/api/admin';

export function useBookingDetail(id: string) {
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ['admin.booking', id],
    queryFn: () => getBookingDetail(id),
    enabled: !!id,
  });

  const mPatch = useMutation({
    mutationFn: (payload: PatchBookingPayload) => patchBooking(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin.booking', id] }),
  });

  const mAdd = useMutation({
    mutationFn: (payload: MemberPayload) => createMember(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin.booking', id] }),
  });

  const mUpd = useMutation({
    mutationFn: (p: { mid: string; payload: Partial<MemberPayload> }) => updateMember(id, p.mid, p.payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin.booking', id] }),
  });

  const mDel = useMutation({
    mutationFn: (mid: string) => deleteMember(id, mid),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin.booking', id] }),
  });

  const mCheck = useMutation({
    mutationFn: (mid: string) => checkinMember(id, mid),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin.booking', id] }),
  });

  const mCheckAll = useMutation({
    mutationFn: () => checkinAll(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin.booking', id] }),
  });

  return {
    q,
    patch: (p: PatchBookingPayload) => mPatch.mutate(p),
    addMember: (p: MemberPayload) => mAdd.mutate(p),
    updateMember: (mid: string, payload: Partial<MemberPayload>) => mUpd.mutate({ mid, payload }),
    deleteMember: (mid: string) => mDel.mutate(mid),
    checkinMember: (mid: string) => mCheck.mutate(mid),
    checkinAll: () => mCheckAll.mutate(),
    isCheckingAll: mCheckAll.isPending,
  };
}

// src/app/user/check-quota/CheckQuotaPage.tsx
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { apiPost } from "@/app/api/client";
import { useTrails } from "./hooks/useTrails";
import { useSlots } from "./hooks/useSlots";
import { addDaysISO } from "./utils";
import type { MemberMini } from "./types";
import { QuotaFilterForm, SlotsList, SelectedSlotCard } from "@/components/user/check-quota";
import { useMe } from "@/app/api/auth";
import LoginRequiredDialog from "@/components/login/LoginRequiredDialog";

export default function CheckQuotaPage() {
  const [sp, setSp] = useSearchParams();

  // — baca state awal dari URL
  const qTrailId = sp.get("trailId") ?? "";
  const qDate = sp.get("date") ?? "";
  const qParty = Number(sp.get("party") ?? "1") || 1;

  const [trailId, setTrailId] = useState(qTrailId);
  const [date, setDate] = useState(qDate);
  const [party, setParty] = useState(qParty);

  // — ambil jalur
  const trailsQ = useTrails();
  const trails = trailsQ.data;

  const { data: me } = useMe();

  // default-kan trail ketika jalur sudah ada & URL kosong
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    if (trailId) {
      didInit.current = true;
      return;
    }
    if (trails.length) {
      setTrailId(trails[0].id);
      didInit.current = true;
    }
  }, [trails, trailId]);

  // sinkronkan form -> URL
  useEffect(() => {
    const next = new URLSearchParams();
    if (trailId) next.set("trailId", trailId);
    if (date) next.set("date", date);
    if (party) next.set("party", String(party));

    const curr = sp.toString();
    const nextStr = next.toString();
    if (nextStr !== curr) setSp(next, { replace: true });
  }, [trailId, date, party, sp, setSp]);

  // range tanggal slot
  const today = new Date();
  const fromISO = date || today.toISOString().slice(0, 10);
  const toISO = date || addDaysISO(today, 60);

  const slotsQ = useSlots(trailId, fromISO, toISO);
  const slots = slotsQ.data;

  const selected = useMemo(
    () => (date ? slots.find((s) => s.date.slice(0, 10) === date) ?? null : null),
    [slots, date]
  );

  // — anggota
  const [members, setMembers] = useState<MemberMini[]>(
    Array.from({ length: party }, () => ({ fullName: "", idNumber: "" })),
  );

  useEffect(() => {
    setMembers((prev) => {
      const next = [...prev];
      if (party > prev.length) {
        for (let i = prev.length; i < party; i++) next.push({ fullName: "", idNumber: "" });
      } else if (party < prev.length) {
        next.length = party;
      }
      return next;
    });
  }, [party]);

  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;

  async function handleCreateBooking() {
    if (!me) {
      setShowLoginPrompt(true);
      return;
    }

    if (!selected) { alert("Pilih tanggal yang memiliki slot."); return; }
    if (selected.remaining < party) { alert("Kuota tidak mencukupi."); return; }
    if (members.some((m) => !m.fullName || !m.idNumber)) { alert("Lengkapi nama & nomor identitas."); return; }

    const resp = await apiPost<{ ok: true; data: { id: string; orderId: string } }>("/api/bookings", {
      trailId,
      slotId: selected.id,
      partySize: party,
      members,
      isNonLocal: false,
    });

    navigate(`/order/${resp.data.orderId}`);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Cek Kuota</h1>

      <QuotaFilterForm
        trails={trails}
        trailId={trailId}
        date={date}
        party={party}
        onTrailChange={setTrailId}
        onDateChange={setDate}
        onPartyChange={setParty}
      />

      {slotsQ.isLoading && <div>Memuat kuota…</div>}
      {slotsQ.error && <div className="text-red-600">Gagal memuat kuota</div>}

      {selected && (
        <SelectedSlotCard
          selected={selected}
          party={party}
          members={members}
          onMembersChange={setMembers}
          onCreate={handleCreateBooking}
          ctaLabel={me ? "Lanjutkan & Buat Pesanan" : "Masuk untuk memesan"}
        />
      )}

      {!date && slots.length > 0 && (
        <SlotsList slots={slots} onPickDate={(iso) => setDate(iso)} />
      )}

      {!slotsQ.isLoading && slots.length === 0 && (
        <div className="text-slate-500">Belum ada slot pada rentang ini.</div>
      )}

      <LoginRequiredDialog
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        returnTo={returnTo}
      />
    </div>
  );
}

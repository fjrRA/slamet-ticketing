// src/components/user/check-quota/SelectedSlotCard.tsx
import type { Slot, MemberMini } from "@/app/user/check-quota/types";
import MembersForm from "./MembersForm";

type Props = {
  selected: Slot;
  party: number;
  members: MemberMini[];
  onMembersChange: (next: MemberMini[]) => void;
  onCreate: () => void;
  ctaLabel?: string;
};

export default function SelectedSlotCard({
  selected, party, members, onMembersChange, onCreate,
}: Props) {
  return (
    <div className="border rounded-xl p-4 mb-6">
      <div className="font-medium mb-2">{new Date(selected.date).toLocaleDateString("id-ID")}</div>
      <div>
        Tersedia: <b>{Math.max(0, selected.remaining)}</b> dari <b>{selected.quotaTotal}</b>
      </div>
      <div className="text-sm text-slate-500">
        Reserved: {selected.quotaReserved} • Paid: {selected.quotaPaid}
      </div>

      <MembersForm party={party} members={members} onChange={onMembersChange} />

      <button
        className="mt-3 px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        onClick={onCreate}
        disabled={selected.remaining < party}
      >
        Lanjutkan &amp; Buat Pesanan
      </button>
    </div>
  );
}

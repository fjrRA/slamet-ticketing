// src/components/user/check-quota/SlotsList.tsx
import type { Slot } from "@/app/user/check-quota/types";

type Props = {
  slots: Slot[];
  onPickDate: (isoDate: string) => void;
};

export default function SlotsList({ slots, onPickDate }: Props) {
  if (slots.length === 0) {
    return <div className="text-slate-500">Belum ada slot pada rentang ini.</div>;
  }

  return (
    <div className="space-y-2">
      {slots.map((s) => (
        <button
          key={s.id}
          className="w-full text-left border rounded-xl px-4 py-3 hover:bg-slate-50"
          onClick={() => onPickDate(s.date.slice(0, 10))}
        >
          <div className="flex justify-between">
            <div className="font-medium">{new Date(s.date).toLocaleDateString("id-ID")}</div>
            <div>
              Tersedia: <b>{Math.max(0, s.remaining)}</b> / {s.quotaTotal}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

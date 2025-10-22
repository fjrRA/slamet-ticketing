// src/components/user/check-quota/MembersForm.tsx
import type { MemberMini } from "@/app/user/check-quota/types";

type Props = {
  party: number;
  members: MemberMini[];
  onChange: (next: MemberMini[]) => void;
};

export default function MembersForm({ party, members, onChange }: Props) {
  function update(idx: number, patch: Partial<MemberMini>) {
    onChange(members.map((m, i) => (i === idx ? { ...m, ...patch } : m)));
  }

  return (
    <div className="mt-4">
      <div className="mb-2 font-semibold">Data Anggota ({party})</div>
      <div className="space-y-2">
        {members.map((m, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              className="border rounded px-3 py-2"
              placeholder={`Nama Lengkap #${i + 1}`}
              value={m.fullName}
              onChange={(e) => update(i, { fullName: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Nomor Identitas (KTP/SIM/Paspor)"
              value={m.idNumber}
              onChange={(e) => update(i, { idNumber: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

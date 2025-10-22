// prisma/seed.ts
import bcrypt from 'bcryptjs';
import { prisma } from '../src/server/libs/prisma'; // ← pakai prisma dari libs

// helper: tanggal UTC (hindari offset saat disimpan sebagai DATE)
function utcDate(y: number, m: number, d: number) {
  return new Date(Date.UTC(y, m, d));
}
function addDaysUTC(base: Date, days: number) {
  return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + days));
}

async function main() {
  // === 1) Seed Super Admin ===
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@slametmountain.com';
  const adminPass  = process.env.ADMIN_PASSWORD ?? 'ganti-segera!';
  const adminHash  = await bcrypt.hash(adminPass, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN', password: adminHash, name: 'Super Admin' },
    create: { name: 'Super Admin', email: adminEmail, password: adminHash, role: 'ADMIN' },
  });

  // === 2) User dummy untuk testing ===
  const testerEmail = 'tester@example.com';
  const testerHash  = await bcrypt.hash('tester123', 10);
  const user = await prisma.user.upsert({
    where: { email: testerEmail },
    update: {},
    create: {
      name: 'Tester',
      email: testerEmail,
      phone: '08123456789',
      password: testerHash,
      role: 'USER',
    },
  });

  // === 3) Trail ===
  const trail = await prisma.trail.upsert({
    where: { name: 'Jalur Bambangan' },
    update: {},
    create: {
      name: 'Jalur Bambangan',
      basecamp: 'Bambangan',
      basecampCode: 'BMB',
    },
  });

  // === 4) Price (bulan ini & bulan depan) ===
  const now = new Date();
  const startMonth = utcDate(now.getUTCFullYear(), now.getUTCMonth(), 1);
  const endMonth   = utcDate(now.getUTCFullYear(), now.getUTCMonth() + 1, 0);

  await prisma.price.upsert({
    where: { id: 'seed-price-current' },
    update: { weekendMultiplier: 1.5 },
    create: {
      id: 'seed-price-current',
      trailId: trail.id,
      startDate: startMonth,
      endDate: endMonth,
      priceLocal: 25000,
      priceNonLocal: 50000,
      weekendMultiplier: 1.5,
      seasonLabel: 'Reguler',
    },
  });

  const startNext = utcDate(now.getUTCFullYear(), now.getUTCMonth() + 1, 1);
  const endNext   = utcDate(now.getUTCFullYear(), now.getUTCMonth() + 2, 0);
  await prisma.price.upsert({
    where: { id: 'seed-price-next' },
    update: {},
    create: {
      id: 'seed-price-next',
      trailId: trail.id,
      startDate: startNext,
      endDate: endNext,
      priceLocal: 30000,
      priceNonLocal: 60000,
      weekendMultiplier: 1.5,
      seasonLabel: 'High Season',
    },
  });

  // === 5) Generate TimeSlot 14 hari ke depan (quota 100/hari) ===
  const todayUTC = utcDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  for (let i = 0; i < 14; i++) {
    const d = addDaysUTC(todayUTC, i);
    await prisma.timeSlot.upsert({
      where: { trailId_date: { trailId: trail.id, date: d } }, // @@unique([trailId, date]) di schema
      update: {},
      create: { trailId: trail.id, date: d, quotaTotal: 100 },
    });
  }

  console.log('✅ Seed done');
  console.log('→ Admin:', adminEmail);
  console.log('→ Dummy user:', user.email, '(password: tester123)');
  console.log('→ Trail:', trail.name, trail.id);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

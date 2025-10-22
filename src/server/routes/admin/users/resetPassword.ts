// src/server/routes/admin/users/resetPassword.ts
import { Router } from 'express';
import { prisma } from '../../../libs/prisma';
import { AppError } from '../../../utils/app-error';
// src/server/routes/admin/users/resetPassword.ts
import bcrypt from 'bcryptjs';

function generateTempPassword() {
  return `Tmp-${Math.random().toString(36).slice(2, 6)}${Math.floor(Math.random() * 90 + 10)}`;
}

export default function registerResetPassword(r: Router) {
  r.post('/:id/reset-password', async (req, res) => {
    const { id } = req.params;
    const u = await prisma.user.findUnique({ where: { id } });
    if (!u) throw new AppError('User tidak ditemukan', 404);

    const temp = generateTempPassword();
    const hash = await bcrypt.hash(temp, 10);

    await prisma.user.update({ where: { id }, data: { password: hash } });
    // Production: kirim lewat email. Untuk sekarang dikembalikan agar admin bisa menyampaikan.
    res.json({ ok: true, tempPassword: temp });
  });
}

// src/app/user/PayButton.tsx
import { useEffect, useState } from 'react';

type ClientKeyResp = { clientKey: string };

// respons minimal yang server kita kirim balik saat minta snap-token
type SnapTokenResponse = {
  ok?: boolean;
  token?: string;
  redirect_url?: string;
  message?: string;
};

/** Bentuk payload callback dari Midtrans Snap (disederhanakan) */
type SnapCallbackResult = {
  order_id?: string;
  transaction_status?: string;
  status_code?: string;
  gross_amount?: string;
  payment_type?: string;
  fraud_status?: string;
  transaction_id?: string;
  signature_key?: string;
};

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        opts: {
          onSuccess?: (result: SnapCallbackResult) => void;
          onPending?: (result: SnapCallbackResult) => void;
          onError?: (result: SnapCallbackResult) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export default function PayButton({ bookingId }: { bookingId: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let script: HTMLScriptElement | null = document.createElement('script');

    (async () => {
      const { clientKey }: ClientKeyResp = await fetch('/api/payments/client-key').then((r) => r.json());
      if (!script) return;

      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', clientKey);
      script.onload = () => setReady(true);
      document.body.appendChild(script);
    })();

    return () => {
      if (script && document.body.contains(script)) document.body.removeChild(script);
      script = null;
    };
  }, []);

  async function pay() {
    let token: string | undefined;

    try {
      const resp = await fetch('/api/payments/snap-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookingId }),
      });

      const payload = (await resp.json().catch(() => ({}))) as Partial<SnapTokenResponse>;

      if (!resp.ok || !payload.token) {
        const msg = typeof payload.message === 'string' ? payload.message : 'Gagal membuat transaksi.';
        throw new Error(msg);
      }
      token = payload.token;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal membuat transaksi.';
      alert(msg);
      return;
    }

    if (!window.snap) {
      alert('Pembayaran belum siap. Coba lagi.');
      return;
    }

    window.snap.pay(token, {
      onSuccess: () => location.assign('/me/bookings'),
      onPending: () => location.assign('/me/bookings'),
      onError: () => alert('Pembayaran gagal. Coba lagi.'),
    });
  }

  return (
    <button
      onClick={pay}
      disabled={!ready}
      className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      type="button"
    >
      Bayar Sekarang
    </button>
  );
}

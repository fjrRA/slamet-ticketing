// src/server/routes/payments/types.ts
export type SnapParam = {
  transaction_details: { order_id: string; gross_amount: number };
  credit_card?: { secure?: boolean };
  item_details?: Array<{ id: string; name: string; price: number; quantity: number }>;
  customer_details?: { first_name?: string; email?: string; phone?: string };
  callbacks?: { finish?: string; pending?: string; error?: string };
  expiry?: { unit: 'minutes' | 'hours' | 'days'; duration: number };
};

export type MidtransNotification = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  transaction_status: string;
  transaction_id?: string;
  payment_type?: string;
  fraud_status?: string;
  signature_key?: string;
};

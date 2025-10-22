// src/server/routes/admin/payments/index.ts
import { Router } from 'express';
import registerList from './list';
import registerOverride from './override';

const payments = Router();
registerList(payments);
registerOverride(payments);

export default payments;

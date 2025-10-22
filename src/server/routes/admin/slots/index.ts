// src/server/routes/admin/slots/index.ts
import { Router } from 'express';
import registerList from './list';
import registerBulkCreate from './bulk.create';
import registerUpdateQuota from './updateQuota';
import registerDelete from './delete';

const r = Router();
registerList(r);
registerBulkCreate(r);
registerUpdateQuota(r);
registerDelete(r);
export default r;

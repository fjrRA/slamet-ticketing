// src/server/routes/admin/closures/index.ts
import { Router } from 'express';
import registerList from './list';
import registerCreate from './create';
import registerUpdate from './update';
import registerDelete from './delete';

const r = Router();
registerList(r);
registerCreate(r);
registerUpdate(r);
registerDelete(r);

export default r;

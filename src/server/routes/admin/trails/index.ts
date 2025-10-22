// src/server/routes/admin/trails/index.ts
import { Router } from 'express';
import registerList from './list';
import registerCreate from './create';
import registerUpdate from './update';
import registerToggle from './toggleActive';
import registerDelete from './delete';

const r = Router();

registerList(r);         // GET    /
registerCreate(r);       // POST   /
registerUpdate(r);       // PATCH  /:id
registerToggle(r);       // PATCH  /:id/active
registerDelete(r);       // DELETE /:id

export default r;

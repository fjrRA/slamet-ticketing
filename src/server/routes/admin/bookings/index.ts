// src/server/routes/admin/bookings/index.ts
import { Router } from 'express';

import registerList           from './list';
import registerGetById        from './getById';
import registerPatchBooking   from './patchBooking';
import registerUpdateStatus   from './updateStatus.byOrderId';
import registerMemberCreate   from './members.create';
import registerMemberUpdate   from './members.update';
import registerMemberDelete   from './members.delete';
import registerCheckinMember  from './checkin.member';
import registerCheckinAll     from './checkin.all';

const bookings = Router();              // ← pastikan ini Router()

registerList(bookings);                 // GET    /
registerGetById(bookings);              // GET    /:id
registerPatchBooking(bookings);         // PATCH  /:id
registerUpdateStatus(bookings);         // PUT    /:orderId/status
registerMemberCreate(bookings);         // POST   /:id/members
registerMemberUpdate(bookings);         // PATCH  /:id/members/:memberId
registerMemberDelete(bookings);         // DELETE /:id/members/:memberId
registerCheckinMember(bookings);        // POST   /:id/members/:memberId/checkin
registerCheckinAll(bookings);           // POST   /:id/checkin-all

export default bookings;                // ← WAJIB default export Router

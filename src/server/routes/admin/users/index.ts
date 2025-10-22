// src/server/routes/admin/users/index.ts
import { Router } from 'express';
import registerList from './list';
import registerUpdate from './update';
import registerSetRole from './setRole';
import registerResetPassword from './resetPassword';

const users = Router();
registerList(users);
registerUpdate(users);
registerSetRole(users);
registerResetPassword(users);

export default users;

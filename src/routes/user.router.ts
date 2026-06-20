import { Router } from 'express';
import UserController from '../app/controller/UserController.ts';
import createValidation from '../app/validations/user/create.ts';

const router = Router();

router.post('/user', createValidation, UserController.create);

export default router;

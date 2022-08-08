import { Router } from 'express';
import UserController from '../app/controller/UserController';
import createValidation from '../app/validations/user/create';

const router = Router();

router.post('/user', createValidation, UserController.create);

export default router;

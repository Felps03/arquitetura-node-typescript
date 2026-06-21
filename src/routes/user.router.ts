import { Router } from 'express';
import UserController from '#modules/users/controllers/UserController.ts';
import createValidation from '#modules/users/validations/create.ts';
import listValidation from '#modules/users/validations/list.ts';
import idParamValidation from '#modules/users/validations/idParam.ts';
import updateValidation from '#modules/users/validations/update.ts';

const router = Router();

router.post('/user', createValidation, UserController.create);
router.get('/user', listValidation, UserController.list);
router.get('/user/:id', idParamValidation, UserController.getById);
router.patch('/user/:id', idParamValidation, updateValidation, UserController.update);
router.delete('/user/:id', idParamValidation, UserController.remove);

export default router;

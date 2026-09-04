import { Router } from 'express';
import { body } from 'express-validator';
import { register } from '../controllers/auth.controller.js';

const router = Router();

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Debe ser un email válido'),
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    ],
    register
);

export default router;

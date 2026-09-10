import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { createTag, getTags } from '../controllers/tags.controller.js';

const router = Router();

router.post(
    '/',
    authenticateToken,
    [body('name').notEmpty().withMessage('El nombre es obligatorio')],
    createTag
);

router.get('/', authenticateToken, getTags);

export default router;

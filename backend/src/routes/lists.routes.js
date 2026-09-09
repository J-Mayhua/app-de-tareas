import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { createList, getLists, updateList, deleteList } from '../controllers/lists.controller.js';

const router = Router();

router.post(
    '/',
    authenticateToken,
    [body('name').notEmpty().withMessage('El nombre es obligatorio')],
    createList
);

router.get('/', authenticateToken, getLists);

router.put(
    '/:id',
    authenticateToken,
    [body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío')],
    updateList
);

router.delete('/:id', authenticateToken, deleteList);

export default router;

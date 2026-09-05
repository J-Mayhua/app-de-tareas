import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/tasks.controller.js';

const router = Router();

router.post(
    '/',
    authenticateToken,
    [
        body('title').notEmpty().withMessage('El título es obligatorio'),
        body('description').optional().isString(),
    ],
    createTask
);
router.get('/', authenticateToken, getTasks, deleteTask);

router.put(
    '/:id',
    authenticateToken,
    [
        body('title').optional().notEmpty().withMessage('El título no puede estar vacío'),
        body('description').optional().isString(),
        body('completed').optional().isBoolean().withMessage('completed debe ser true o false'),
    ],
    updateTask
);

router.delete('/:id', authenticateToken, deleteTask);


export default router;

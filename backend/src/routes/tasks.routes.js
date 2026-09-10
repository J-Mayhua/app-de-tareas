import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { createTask, getTasks, updateTask, deleteTask, addTagToTask, removeTagFromTask } from '../controllers/tasks.controller.js';

const router = Router();

router.post(
    '/',
    authenticateToken,
    [
        body('title').notEmpty().withMessage('El título es obligatorio'),
        body('description').optional().isString(),
        body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Prioridad inválida'),
        body('due_at').optional().isISO8601().withMessage('Fecha inválida'),
        body('list_id').optional().isInt().withMessage('list_id debe ser un número'),
    ],
    createTask
);

router.get('/', authenticateToken, getTasks);

router.put(
    '/:id',
    authenticateToken,
    [
        body('title').optional().notEmpty().withMessage('El título no puede estar vacío'),
        body('description').optional().isString(),
        body('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('Estado inválido'),
        body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Prioridad inválida'),
        body('due_at').optional().isISO8601().withMessage('Fecha inválida'),
        body('list_id').optional().isInt().withMessage('list_id debe ser un número'),
    ],
    updateTask
);

router.delete('/:id', authenticateToken, deleteTask);

router.post('/:id/tags', authenticateToken, addTagToTask);
router.delete('/:id/tags/:tagId', authenticateToken, removeTagFromTask);

export default router;

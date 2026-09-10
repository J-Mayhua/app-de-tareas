import { validationResult } from 'express-validator';
import pool from '../config/db.js';
//registrar una nueva tarea
export const createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, list_id, priority, due_at } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `INSERT INTO tasks (user_id, title, description, list_id, priority, due_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [userId, title, description || null, list_id || null, priority || 'medium', due_at || null]
        );

        return res.status(201).json({ message: 'Tarea creada exitosamente', task: result.rows[0] });

    } catch (error) {
        console.error('Error al crear tarea:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
//obtener todas las tareas del usuario autenticado
export const getTasks = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT
        t.*,
        COALESCE(
          json_agg(
            json_build_object('id', tg.id, 'name', tg.name)
          ) FILTER (WHERE tg.id IS NOT NULL),
          '[]'
        ) AS tags
       FROM tasks t
       LEFT JOIN task_tags tt ON t.id = tt.task_id
       LEFT JOIN tags tg ON tt.tag_id = tg.id
       WHERE t.user_id = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
            [userId]
        );

        return res.status(200).json({ tasks: result.rows });
    } catch (error) {
        console.error('Error al obtener tareas:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
//actualizar una tarea existente
export const updateTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, description, status, priority, due_at, list_id } = req.body;

    try {
        const result = await pool.query(
            `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority),
           due_at = COALESCE($5, due_at),
           list_id = COALESCE($6, list_id),
           updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
            [title, description, status, priority, due_at, list_id, taskId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        return res.status(200).json({ message: 'Tarea actualizada', task: result.rows[0] });

    } catch (error) {
        console.error('Error al actualizar tarea:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

//eliminar una tarea existente
export const deleteTask = async (req, res) => {
    const userId = req.user.id;
    const taskId = req.params.id;

    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
            [taskId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        return res.status(200).json({ message: 'Tarea eliminada', id: result.rows[0].id });

    } catch (error) {
        console.error('Error al eliminar tarea:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
export const addTagToTask = async (req, res) => {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { tag_id } = req.body;

    try {
        // Verificar que la tarea le pertenece al usuario
        const taskCheck = await pool.query(
            'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
            [taskId, userId]
        );

        if (taskCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        // Insertar la relación en la tabla intermedia
        await pool.query(
            'INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [taskId, tag_id]
        );

        return res.status(201).json({ message: 'Etiqueta agregada a la tarea' });
    } catch (error) {
        console.error('Error al agregar etiqueta:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const removeTagFromTask = async (req, res) => {
    const userId = req.user.id;
    const { id: taskId, tagId } = req.params;

    try {
        const taskCheck = await pool.query(
            'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
            [taskId, userId]
        );

        if (taskCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        await pool.query(
            'DELETE FROM task_tags WHERE task_id = $1 AND tag_id = $2',
            [taskId, tagId]
        );

        return res.status(200).json({ message: 'Etiqueta removida de la tarea' });
    } catch (error) {
        console.error('Error al remover etiqueta:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

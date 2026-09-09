import { validationResult } from 'express-validator';
import pool from '../config/db.js';

export const createList = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'INSERT INTO lists (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
            [userId, name, description || null]
        );

        return res.status(201).json({ message: 'Libreta creada exitosamente', list: result.rows[0] });
    } catch (error) {
        console.error('Error al crear libreta:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getLists = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'SELECT * FROM lists WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        return res.status(200).json({ lists: result.rows });
    } catch (error) {
        console.error('Error al obtener libretas:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const updateList = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const listId = req.params.id;
    const { name, description } = req.body;

    try {
        const result = await pool.query(
            `UPDATE lists
       SET name = COALESCE($1, name),
           description = COALESCE($2, description)
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
            [name, description, listId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Libreta no encontrada' });
        }

        return res.status(200).json({ message: 'Libreta actualizada', list: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar libreta:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const deleteList = async (req, res) => {
    const userId = req.user.id;
    const listId = req.params.id;

    try {
        const result = await pool.query(
            'DELETE FROM lists WHERE id = $1 AND user_id = $2 RETURNING id',
            [listId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Libreta no encontrada' });
        }

        return res.status(200).json({ message: 'Libreta eliminada', id: result.rows[0].id });
    } catch (error) {
        console.error('Error al eliminar libreta:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

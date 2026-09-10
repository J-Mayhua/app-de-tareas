import { validationResult } from 'express-validator';
import pool from '../config/db.js';

export const createTag = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'INSERT INTO tags (user_id, name) VALUES ($1, $2) RETURNING *',
            [userId, name]
        );

        return res.status(201).json({ message: 'Etiqueta creada', tag: result.rows[0] });
    } catch (error) {
        console.error('Error al crear etiqueta:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getTags = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'SELECT * FROM tags WHERE user_id = $1 ORDER BY name ASC',
            [userId]
        );

        return res.status(200).json({ tags: result.rows });
    } catch (error) {
        console.error('Error al obtener etiquetas:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

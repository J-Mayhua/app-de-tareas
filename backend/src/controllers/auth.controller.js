import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

export const register = async (req, res) => {
    // 1. Verificar si hubo errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // 2. Verificar si el email ya existe
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }

        // 3. Hashear la contraseña
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 4. Insertar el nuevo usuario
        const result = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email, passwordHash]
        );

        const newUser = result.rows[0];

        // 5. Responder (sin exponer password_hash)
        return res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });

    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

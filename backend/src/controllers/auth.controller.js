import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

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

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // 1. Buscar al usuario por email
        const result = await pool.query(
            'SELECT id, email, password_hash FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = result.rows[0];

        // 2. Comparar la contraseña ingresada con el hash guardado
        const passwordMatches = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatches) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 3. Generar el token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // 4. Responder con el token
        return res.status(200).json({
            message: 'Login exitoso',
            token,
            user: { id: user.id, email: user.email },
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

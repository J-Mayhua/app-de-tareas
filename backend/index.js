import 'dotenv/config';
import express from 'express';
import authRoutes from './src/routes/auth_routes.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // ← nueva línea: habilita lectura de JSON en el body
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

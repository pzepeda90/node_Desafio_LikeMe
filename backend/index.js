const express = require('express');
const cors = require('cors');
const postsRoutes = require('./routes/posts');

// Configuración de variables de entorno
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS (Requerimiento 1)
app.use(cors());

// Middlewares
app.use(express.json());

// Rutas
app.use('/posts', postsRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Like Me funcionando correctamente');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 
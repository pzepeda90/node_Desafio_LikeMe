const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Ruta GET para obtener todos los posts
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los posts:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta POST para crear un nuevo post
router.post('/', async (req, res) => {
  try {
    const { titulo, url, descripcion } = req.body;
    
    // Validar que se reciban todos los campos necesarios
    if (!titulo || !url || !descripcion) {
      return res.status(400).json({ error: 'Se requieren todos los campos: titulo, url, descripcion' });
    }
    
    // Insertar el nuevo post en la base de datos (likes comienza en 0)
    const query = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *';
    const values = [titulo, url, descripcion];
    
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear el post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 
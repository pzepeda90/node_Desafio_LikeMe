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

// Ruta PUT para dar like a un post
router.put('/like/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el ID sea un número válido
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID de post inválido' });
    }
    
    // Incrementar el contador de likes del post
    const query = 'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *';
    const values = [id];
    
    const { rows } = await pool.query(query, values);
    
    // Verificar si se encontró el post
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al dar like al post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta DELETE para eliminar un post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el ID sea un número válido
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID de post inválido' });
    }
    
    // Eliminar el post de la base de datos
    const query = 'DELETE FROM posts WHERE id = $1 RETURNING *';
    const values = [id];
    
    const { rows } = await pool.query(query, values);
    
    // Verificar si se encontró el post
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    res.json({ message: 'Post eliminado con éxito', post: rows[0] });
  } catch (error) {
    console.error('Error al eliminar el post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 
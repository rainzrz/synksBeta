
const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all tools for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tools WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get tools error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create tool
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, url, description, icon, category } = req.body;
    
    const result = await pool.query(
      'INSERT INTO tools (name, url, description, icon, category, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, url, description, icon, category, req.user.userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create tool error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update tool
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, url, description, icon, category } = req.body;
    
    const result = await pool.query(
      'UPDATE tools SET name = $1, url = $2, description = $3, icon = $4, category = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
      [name, url, description, icon, category, req.params.id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update tool error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete tool
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM tools WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Delete tool error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

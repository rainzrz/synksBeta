
const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all links for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM links WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get links by company
router.get('/company/:companyId', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM links WHERE company_id = $1 AND user_id = $2 ORDER BY created_at DESC',
      [req.params.companyId, req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get company links error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create link
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, url, description, company_id } = req.body;
    
    const result = await pool.query(
      'INSERT INTO links (name, url, description, company_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, url, description, company_id, req.user.userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update link
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, url, description } = req.body;
    
    const result = await pool.query(
      'UPDATE links SET name = $1, url = $2, description = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [name, url, description, req.params.id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete link
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check link status
router.post('/:id/check', authenticateToken, async (req, res) => {
  try {
    const linkResult = await pool.query(
      'SELECT * FROM links WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );
    
    if (linkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    const link = linkResult.rows[0];
    const startTime = Date.now();
    
    try {
      const response = await fetch(link.url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(10000)
      });
      
      const responseTime = Date.now() - startTime;
      const status = response.ok ? 'online' : 'offline';
      
      const updateResult = await pool.query(
        'UPDATE links SET status = $1, response_time = $2, last_checked = NOW() WHERE id = $3 RETURNING *',
        [status, responseTime, req.params.id]
      );
      
      res.json(updateResult.rows[0]);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      const updateResult = await pool.query(
        'UPDATE links SET status = $1, response_time = $2, last_checked = NOW() WHERE id = $3 RETURNING *',
        ['error', responseTime, req.params.id]
      );
      
      res.json(updateResult.rows[0]);
    }
  } catch (error) {
    console.error('Check link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

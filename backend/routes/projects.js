const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

let pool; 
const setPool = (dbPool) => {
  pool = dbPool;
};


router.get('/', authenticateToken, async (req, res) => {
  if (!pool) return res.status(500).send('Database pool not configured');
  const studentId = req.user.student_id;
  try {
    
    const result = await pool.query(
      'SELECT * FROM student_projects WHERE student_id = $1 ORDER BY created_at DESC', 
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
});


router.post('/', authenticateToken, async (req, res) => {
  if (!pool) return res.status(500).send('Database pool not configured');
  const studentId = req.user.student_id;
  const { title, description, technologies, project_url, image_url } = req.body;

  // Basic validation
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    
    const result = await pool.query(
      `INSERT INTO student_projects (student_id, title, description, technologies, project_url, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [studentId, title, description, technologies, project_url, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ message: 'Failed to create project', error: err.message });
  }
});


router.put('/:projectId', authenticateToken, async (req, res) => {
  if (!pool) return res.status(500).send('Database pool not configured');
  const studentId = req.user.student_id;
  const { projectId } = req.params;
  const { title, description, technologies, project_url, image_url } = req.body;

  // Basic validation
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    
    
    const result = await pool.query(
      `UPDATE student_projects 
       SET title = $1, description = $2, technologies = $3, project_url = $4, image_url = $5, updated_at = NOW()
       WHERE project_id = $6 AND student_id = $7
       RETURNING *`,
      [title, description, technologies, project_url, image_url, projectId, studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found or you do not have permission to update it.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ message: 'Failed to update project', error: err.message });
  }
});


router.delete('/:projectId', authenticateToken, async (req, res) => {
  if (!pool) return res.status(500).send('Database pool not configured');
  const studentId = req.user.student_id;
  const { projectId } = req.params;

  try {
    
    
    const result = await pool.query(
      'DELETE FROM student_projects WHERE project_id = $1 AND student_id = $2 RETURNING project_id',
      [projectId, studentId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Project not found or you do not have permission to delete it.' });
    }
    res.status(200).json({ message: 'Project deleted successfully' }); 
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Failed to delete project', error: err.message });
  }
});


module.exports = { router, setPool };

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database connection checks env var first for deployment flexibility
const dbPath = process.env.DB_PATH || path.join(__dirname, '../database.db');
const db = new Database(dbPath, { verbose: console.log });

// Search API
app.get('/api/search', (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.json([]);
    }

    const query = `%${q}%`;

    try {
        const stmt = db.prepare(`
      SELECT DISTINCT r.* 
      FROM restaurants r
      LEFT JOIN dishes d ON r.id = d.restaurant_id
      WHERE r.name LIKE ? 
         OR r.cuisine LIKE ? 
         OR d.name LIKE ?
      ORDER BY r.rating DESC
      LIMIT 50
    `);

        const results = stmt.all(query, query, query);
        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production' || true) {
    const distPath = path.join(__dirname, '../client/dist');
    app.use(express.static(distPath));

    // Fallback for SPA
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            return res.sendFile(path.join(distPath, 'index.html'));
        }
        next();
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

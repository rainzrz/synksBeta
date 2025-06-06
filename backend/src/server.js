const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/links', require('./routes/links'));
app.use('/api/tools', require('./routes/tools'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/upload', require('./routes/upload'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://recipe-platform-frontend.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Request Logger (Alignment with "Internal Platform" theme)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/recipe-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('[DATABASE] MongoDB Connection Established');
}).catch(err => {
  console.error('[DATABASE] Connection Error:');
  if (err.message.includes('MongooseServerSelectionError')) {
    console.error('  CRITICAL: Potential IP Whitelisting issue on MongoDB Atlas.');
    console.error('  Please ensure your current IP is allowed in Network Access.');
  } else {
    console.error(err);
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the KitchenMate Internal API!');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/social', require('./routes/social'));
app.use('/api/mealplanner', require('./routes/mealPlanner'));

// Start server
app.listen(PORT, () => {
  console.log(`[STATUS] KitchenMate Backend Active on http://localhost:${PORT}`);
});
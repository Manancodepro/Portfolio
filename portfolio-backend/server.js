require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || '*'
        : '*',
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Routes ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Portfolio API is running 🚀' });
});

app.use('/api/contact', contactRoutes);

// ── Error Handling ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

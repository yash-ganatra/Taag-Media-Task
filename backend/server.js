require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

const matchRoutes = require('./src/routes/Match.routes');
const billingRoutes = require('./src/routes/Billing.routes');
const authRoutes = require("./src/routes/Auth");
const invoiceRoutes = require("./src/routes/invoice");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

connectDB(process.env.MONGO_URI);
console.log('Database connected');
app.use("/api/auth", authRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/billing', billingRoutes);

app.use("/api/invoice", invoiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./src/middleware/logger')
const cookieParser = require('cookie-parser')

const app = express();

// Middlewares
app.use(cors({
    origin: ['http://localhost:3000'],
    methods:["GET", "POST" , "PUT" , "DELETE" , "PATCH"],
    credentials : true,
    allowedHeaders: ['Content-Type' , "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

// All routes
app.use('/api/login' , require('./src/routes/LoginRoutes'));


app.use('/api/index', authMiddleware ,require('./src/routes/indexRoutes'));
app.use('/api/customizelead',authMiddleware , require('./src/routes/CustomizeLeadRoutes'));
app.use('/api/lead',authMiddleware , require('./src/routes/LeadRoutes'));
app.use('/api/activity',authMiddleware , require('./src/routes/ActivityRoutes'));
app.use('/api/coordinator', authMiddleware ,require('./src/routes/CoordinatorRoutes'));
app.use('/api/hotel',authMiddleware , require('./src/routes/HotelRoutes'));
app.use('/api/localsupport',authMiddleware , require('./src/routes/LocalSupportRoutes'));
app.use('/api/transport',authMiddleware , require('./src/routes/TransportRoutes'));
app.use('/api/invoice',authMiddleware , require('./src/routes/InvoiceRoutes'));
app.use('/api/ledger',authMiddleware , require('./src/routes/LedgerRoutes'));
app.use('/api/payment',authMiddleware , require('./src/routes/PaymentRoutes'));
app.use('/api/vendor',authMiddleware , require('./src/routes/VendorRoutes'));
app.use('/api/booking',authMiddleware , require('./src/routes/BookingRoutes'));
app.use('/api/category',authMiddleware , require('./src/routes/CategoryRoutes'));
app.use('/api/content',authMiddleware , require('./src/routes/ContentRoutes'));
app.use('/api/itinerary',authMiddleware , require('./src/routes/ItineraryRoutes'));
app.use('/api/location', authMiddleware ,require('./src/routes/LocationRoutes'));
app.use('/api/review' ,require('./src/routes/ReviewRoutes'));
app.use('/api/customer', authMiddleware ,require('./src/routes/CustomerRoutes'));
app.use('/api/batch', authMiddleware ,require('./src/routes/BatchRoute'));
app.use('/api/googleReview', require('./src/routes/GoogleReviewRoutes'))
app.use('/api/user' , require('./src/routes/UserRoutes'));
app.use('/api/index' , authMiddleware  , require('./src/routes/indexRoutes'));
app.use('/api/common', require('./src/routes/CommonRoutes'))

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
})
.then(() => console.log("✅ DB Connected"))
.catch(err => console.error("❌ DB Error:", err));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

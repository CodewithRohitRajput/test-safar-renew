// Website Models
const Itinerary = require('./website/Itinerary');
const Category = require('./website/Category');
const Location = require('./website/Location');
const Review = require('./website/Review');
const Booking = require('./website/Booking');
const Content = require('./website/Content');

// Leads Models
const Lead = require('./leads/Lead');
const CustomizeLead = require('./leads/CustomizeLead');

// Sales Models
const Invoice = require('./sales/Invoice');
const Payment = require('./sales/Payment');
const Ledger = require('./sales/Ledger');
const Vendor = require('./sales/Vendor');

// Library Models
const Hotel = require('./library/Hotel');
const Activity = require('./library/Activity');
const Transport = require('./library/Transport');
const Coordinator = require('./library/Coordinator');
const LocalSupport = require('./library/LocalSupport');
const Batch = require('./library/Batch')

// User

const User = require('./user/user');

module.exports = {
  // Website
  Itinerary,
  Category,
  Location,
  Review,
  Booking,
  Content,
  // Leads
  Lead,
  CustomizeLead,
  // Sales
  Invoice,
  Payment,
  Ledger,
  Vendor,
  // Library
  Hotel,
  Activity,
  Transport,
  Coordinator,
  LocalSupport,
  Batch,
  //User
  
  User
};
const { CommonHelper } = require("../../utils/common.helper");
const Constant = require("../../configs/constant");
const BookingServices = require("../services/booking_services");

// Helper function to normalize and parse PayU callback data
const normalizePayUData = (rawData) => {
  const normalized = {};
  
  // First, check if the entire data is in a malformed format (Thunder Client issue)
  for (const [key, value] of Object.entries(rawData)) {
    const trimmedKey = key.trim();
    
    // Check if the KEY itself contains the malformed "Key: ...\nValue: ..." pattern
    if (trimmedKey.includes('Key:') && trimmedKey.includes('Value:')) {
      // Parse the key string which contains all the form data
      // Format: "Key: txnid\nValue: txn_123\n\nKey: status\nValue: success\n..."
      const allPairs = trimmedKey.match(/Key:\s*([^\n]+)\nValue:\s*([^\n]+)/g);
      if (allPairs) {
        for (const pair of allPairs) {
          const match = pair.match(/Key:\s*([^\n]+)\nValue:\s*([^\n]+)/);
          if (match) {
            const fieldKey = match[1].trim();
            const fieldValue = match[2].trim();
            normalized[fieldKey] = fieldValue;
          }
        }
      }
    }
    // Check if the VALUE is a string containing multiple fields
    else if (typeof value === 'string' && (value.includes('Key:') || value.includes('\n'))) {
      // Parse format: "Key: fieldname\nValue: fieldvalue\n\nKey: ..."
      const pairs = value.match(/Key:\s*([^\n]+)\nValue:\s*([^\n]+)/g);
      if (pairs) {
        for (const pair of pairs) {
          const match = pair.match(/Key:\s*([^\n]+)\nValue:\s*([^\n]+)/);
          if (match) {
            const fieldKey = match[1].trim();
            const fieldValue = match[2].trim();
            normalized[fieldKey] = fieldValue;
          }
        }
      }
      // Also try parsing as "fieldname=fieldvalue" format
      else if (value.includes('=')) {
        const lines = value.split('\n');
        for (const line of lines) {
          const match = line.match(/^([^=]+?)\s*=\s*(.+)$/);
          if (match) {
            const fieldKey = match[1].trim();
            const fieldValue = match[2].trim();
            normalized[fieldKey] = fieldValue;
          }
        }
      }
    }
    // Normal case: key-value pair
    else {
      normalized[trimmedKey] = value;
    }
  }
  
  return normalized;
};

// Helper function to extract txnid from various possible field names
const extractTxnid = (data) => {
  // Try various possible field names
  return data.txnid || 
         data.txn_id || 
         data.TXNID || 
         data['txnid '] || 
         data['txnid'] ||
         null;
};

const AddBooking = async (req, res) => {
  try {
    const data = await BookingServices.AddBooking(req.body);

    return CommonHelper.sendSuccess(
      res,
      true,
      Constant.STATUS_CODE.HTTP_200_OK,
      "BOOKING_ADDED",
      data
    );
  } catch (err) {
    console.error("AddBooking error:", err.message);
    return CommonHelper.sendError(
      res,
      false,
      Constant.STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR,
      err.message.trim().split("\n").pop()
    );
  }
};

const bookingFailed = async (req, res) => {
  try {
    const rawData = {
      ...req.body,
      ...req.query,
    };
    
    const callbackData = normalizePayUData(rawData);
    const txnid = extractTxnid(callbackData);
    
    if (!txnid) {
      console.error("Missing txnid in PayU failure callback");
      const redirectUrl = `${process.env.FAILURE_REDIRECT}?status=failure`;
      return res.redirect(redirectUrl);
    }
    
    await BookingServices.PaymentFailure(callbackData);
    
    const { status, amount } = callbackData;
    const redirectUrl = `${process.env.FAILURE_REDIRECT}?txnid=${txnid}&status=${status || 'failure'}&amount=${amount || ''}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Payment failure callback error:", err.message);
    
    const rawData = { ...req.body, ...req.query };
    const callbackData = normalizePayUData(rawData);
    const txnid = extractTxnid(callbackData);
    const { status, amount } = callbackData;
    const redirectUrl = `${process.env.FAILURE_REDIRECT}?txnid=${txnid || ''}&status=${status || 'failure'}&amount=${amount || ''}`;
    res.redirect(redirectUrl);
  }
};

const bookingSuccess = async (req, res) => {
  try {
    // Merge body and query data
    const rawData = {
      ...req.body,
      ...req.query,
    };
    
    // Normalize the data (handle malformed data, trim keys, parse nested strings)
    const callbackData = normalizePayUData(rawData);
    
    // Extract txnid using helper function
    const txnid = extractTxnid(callbackData);
    
    if (!txnid) {
      console.error("Missing txnid in PayU success callback");
      // Still redirect even if txnid is missing
      const redirectUrl = `${process.env.SUCCESS_REDIRECT}?status=success`;
      return res.redirect(redirectUrl);
    }
    
    // Process the payment success - this updates the database
    await BookingServices.PaymentSuccess(callbackData);
    
    // Redirect user to frontend success page
    const { status, amount } = callbackData;
    const redirectUrl = `${process.env.SUCCESS_REDIRECT}?txnid=${txnid}&status=${status || 'success'}&amount=${amount || ''}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Payment success callback error:", err.message);
    
    // Still redirect to success page even if callback processing fails
    const rawData = { ...req.body, ...req.query };
    const callbackData = normalizePayUData(rawData);
    const txnid = extractTxnid(callbackData);
    const { status, amount } = callbackData;
    const redirectUrl = `${process.env.SUCCESS_REDIRECT}?txnid=${txnid || ''}&status=${status || 'success'}&amount=${amount || ''}`;
    res.redirect(redirectUrl);
  }
};

module.exports = {
  AddBooking,
  bookingFailed,
  bookingSuccess,
};
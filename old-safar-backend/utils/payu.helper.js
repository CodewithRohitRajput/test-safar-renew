const crypto = require("crypto");

const generateHash = (params) => {
  const { key, txnid, amount, productinfo, firstname, email, udf1 } = params;
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${process.env.PAYU_SALT}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

module.exports = {
  generateHash,
};

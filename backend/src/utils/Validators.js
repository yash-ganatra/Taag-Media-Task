const PAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const GSTIN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const UPI = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;

function isValidPAN(pan){ return PAN.test(pan); }
function isValidGSTIN(gstin){ return GSTIN.test(gstin); }
function isValidIFSC(ifsc){ return IFSC.test(ifsc); }
function isValidUPI(upi){ return UPI.test(upi); }

module.exports = { isValidPAN, isValidGSTIN, isValidIFSC, isValidUPI };

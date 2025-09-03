const express = require("express");
const generateInvoice = require("../utils/Pdfgenetrator");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const invoiceData = req.body;
    console.log('Received invoice data:', JSON.stringify(invoiceData, null, 2));

    // Define the directory and file path for the invoice
    const invoicesDir = path.join(__dirname, "../../invoices");
    const fileName = `invoice-${Date.now()}.pdf`;
    const filePath = path.join(invoicesDir, fileName);

    // Ensure the invoices directory exists
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
      console.log('Created invoices directory:', invoicesDir);
    }

    console.log('Generating PDF at:', filePath);

    // Generate the invoice
    await generateInvoice(invoiceData, filePath);

    // Check if file was created and has content
    if (!fs.existsSync(filePath)) {
      throw new Error('PDF file was not created');
    }

    const fileStats = fs.statSync(filePath);
    console.log('PDF file size:', fileStats.size, 'bytes');

    if (fileStats.size === 0) {
      throw new Error('PDF file is empty');
    }

    // Send the generated PDF file as a response
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to send the invoice" });
        }
      } else {
        console.log('PDF sent successfully');
        // Optionally delete the file after sending
        // fs.unlinkSync(filePath);
      }
    });
  } catch (err) {
    console.error('Invoice generation error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate invoice: " + err.message });
    }
  }
});

module.exports = router;
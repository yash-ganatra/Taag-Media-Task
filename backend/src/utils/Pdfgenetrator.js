const PDFDocument = require("pdfkit");
const fs = require("fs");

function generateInvoice(invoiceData, path) {
  return new Promise((resolve, reject) => {
    try {
      console.log('PDF Generator - Received data:', JSON.stringify(invoiceData, null, 2));
      
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(path);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text("INVOICE", { align: "center" });
      doc.moveDown();

      // Company Header
      doc.fontSize(16).text("TaagMedia", { align: "left" });
      doc.fontSize(10).text("Digital Marketing & Creator Management", { align: "left" });
      doc.moveDown();

      // Invoice Details
      doc.fontSize(12);
      doc.text(`Invoice Number: ${invoiceData.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`}`, { align: "right" });
      doc.text(`Date: ${invoiceData.date || new Date().toLocaleDateString()}`, { align: "right" });
      doc.moveDown();

      // Brand Information
      if (invoiceData.brandData) {
        doc.fontSize(14).text("Bill To:", { underline: true });
        doc.fontSize(12);
        doc.text(`Company: ${invoiceData.brandData.company || invoiceData.brandName}`);
        if (invoiceData.brandData.GSTIN) doc.text(`GSTIN: ${invoiceData.brandData.GSTIN}`);
        if (invoiceData.brandData.email) doc.text(`Email: ${invoiceData.brandData.email}`);
        if (invoiceData.brandData.phone) doc.text(`Phone: ${invoiceData.brandData.phone}`);
        if (invoiceData.brandData.address) {
          doc.text(`Address: ${invoiceData.brandData.address}`);
          if (invoiceData.brandData.city) doc.text(`${invoiceData.brandData.city}, ${invoiceData.brandData.state || ''} ${invoiceData.brandData.pincode || ''}`);
        }
        doc.moveDown();
      }

      // Creator Information
      if (invoiceData.creatorData) {
        doc.fontSize(14).text("Creator Details:", { underline: true });
        doc.fontSize(12);
        doc.text(`Name: ${invoiceData.creatorData.name || invoiceData.creatorName}`);
        if (invoiceData.creatorData.PAN) doc.text(`PAN: ${invoiceData.creatorData.PAN}`);
        if (invoiceData.creatorData.UPI) doc.text(`UPI: ${invoiceData.creatorData.UPI}`);
        if (invoiceData.creatorData.bankName) doc.text(`Bank: ${invoiceData.creatorData.bankName}`);
        doc.moveDown();
      }

      // Service Details
      doc.fontSize(14).text("Service Details:", { underline: true });
      doc.fontSize(12);
      
      // Table Header
      const tableTop = doc.y;
      doc.text("Description", 50, tableTop);
      doc.text("Amount", 400, tableTop);
      
      // Table Line
      doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
      doc.moveDown();

      // Service Line
      const amount = Number(invoiceData.amount) || 0;
      const gst = Number(invoiceData.gst) || 0;
      const total = Number(invoiceData.total) || 0;
      
      console.log('PDF Generator - Calculated amounts:', { amount, gst, total });
      
      doc.text("Digital Marketing Services", 50, doc.y);
      doc.text(`₹${amount.toLocaleString('en-IN')}`, 400, doc.y);
      doc.moveDown();

      // GST Line
      doc.text("GST (18%)", 50, doc.y);
      doc.text(`₹${gst.toLocaleString('en-IN')}`, 400, doc.y);
      doc.moveDown();

      // Total Line
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      doc.fontSize(14).text("Total Amount", 50, doc.y);
      doc.text(`₹${total.toLocaleString('en-IN')}`, 400, doc.y);
      doc.moveDown(2);

      // Terms & Conditions
      doc.fontSize(12).text("Terms & Conditions:", { underline: true });
      doc.fontSize(10);
      doc.text("• Payment is due within 30 days of invoice date");
      doc.text("• All prices are inclusive of GST where applicable");
      doc.text("• Creator payouts will be processed within 7 business days");
      doc.text("• Any disputes must be raised within 15 days of invoice date");
      
      // Finalize the PDF and end the stream
      doc.end();

      // Wait for the stream to finish writing
      stream.on('finish', () => {
        resolve("Invoice generated successfully");
      });

      stream.on('error', (err) => {
        reject(err);
      });

    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateInvoice;

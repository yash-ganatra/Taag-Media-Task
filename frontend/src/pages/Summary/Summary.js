import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { invoiceAPI } from '../../services/api';
import './Summary.css';

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { brandData, creatorData, activeTab } = location.state || {};
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const calculateGST = (amount) => {
    const baseAmount = parseFloat(amount) || 0;
    const gst = baseAmount * 0.18;
    const total = baseAmount + gst;
    return { baseAmount, gst, total };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = async () => {
    if (!brandData && !creatorData) {
      alert('No data available to generate PDF');
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      // Prepare invoice data for the backend
      const gstCalc = brandData?.budgetINR ? calculateGST(brandData.budgetINR) : { baseAmount: 0, gst: 0, total: 0 };
      
      const invoiceData = {
        brandName: brandData?.company || 'TaagMedia Client',
        creatorName: creatorData?.name || 'Creator',
        amount: gstCalc.baseAmount,
        gst: gstCalc.gst,
        total: gstCalc.total,
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString(),
        brandData: brandData,
        creatorData: creatorData,
        type: activeTab
      };

      console.log('Generating PDF for invoice data:', invoiceData);

      // Call the backend API to generate PDF
      const response = await invoiceAPI.generateAndDownload(invoiceData);
      
      console.log('PDF response received:', response);
      console.log('Response data size:', response.data?.size || 'unknown');
      
      // Ensure we have a valid blob
      if (!response.data || response.data.size === 0) {
        throw new Error('Received empty PDF data');
      }
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceData.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      alert('PDF generated and downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error response:', error.response);
      alert(`Failed to generate PDF: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownload = () => {
    const data = {
      brandData,
      creatorData,
      timestamp: new Date().toISOString(),
      type: activeTab
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billing-summary-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const gstCalculation = brandData?.budgetINR ? calculateGST(brandData.budgetINR) : null;

  if (!brandData && !creatorData) {
    return (
      <div className="summary">
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h2 className="empty-title">No Data Available</h2>
          <p className="empty-text">
            Please complete the billing form first to view the summary.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/billing')}>
            Go to Billing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="summary fade-in">
      <div className="page-header no-print">
        <h1 className="page-title">Billing Summary</h1>
        <p className="page-subtitle">
          Review and confirm all billing information
        </p>
      </div>

      <div className="summary-container">
        <div className="summary-header">
          <div className="company-info">
            <h2 className="company-name">
              {brandData?.company || 'TaagMedia'}
            </h2>
            <div className="invoice-details">
              <div className="invoice-number">
                Invoice #{Date.now().toString().slice(-6)}
              </div>
              <div className="invoice-date">
                Date: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="logo">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">TaagMedia</span>
          </div>
        </div>

        {brandData && (
          <div className="summary-section">
            <h3 className="section-title">Brand Billing Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Company Name:</span>
                <span className="info-value">{brandData.company}</span>
              </div>
              <div className="info-item">
                <span className="info-label">GSTIN:</span>
                <span className="info-value">{brandData.GSTIN}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{brandData.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{brandData.phone}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Address:</span>
                <span className="info-value">
                  {brandData.address}
                  {brandData.city && `, ${brandData.city}`}
                  {brandData.state && `, ${brandData.state}`}
                  {brandData.pincode && ` - ${brandData.pincode}`}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Payment Method:</span>
                <span className="info-value">
                  {brandData.paymentMethod.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {gstCalculation && (
              <div className="billing-summary">
                <h4 className="billing-title">Payment Breakdown</h4>
                <div className="billing-table">
                  <div className="billing-row">
                    <span className="billing-label">Service Amount:</span>
                    <span className="billing-value">₹{gstCalculation.baseAmount.toLocaleString()}</span>
                  </div>
                  <div className="billing-row">
                    <span className="billing-label">GST (18%):</span>
                    <span className="billing-value">₹{gstCalculation.gst.toLocaleString()}</span>
                  </div>
                  <div className="billing-row total">
                    <span className="billing-label">Total Amount:</span>
                    <span className="billing-value">₹{gstCalculation.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {creatorData && (
          <div className="summary-section">
            <h3 className="section-title">Creator Payout Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Full Name:</span>
                <span className="info-value">{creatorData.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">PAN:</span>
                <span className="info-value">{creatorData.PAN}</span>
              </div>
              <div className="info-item">
                <span className="info-label">UPI ID:</span>
                <span className="info-value">{creatorData.UPI}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Bank Name:</span>
                <span className="info-value">{creatorData.bankName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Account Number:</span>
                <span className="info-value">
                  {creatorData.accountNumber?.replace(/\d(?=\d{4})/g, '*')}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">IFSC Code:</span>
                <span className="info-value">{creatorData.IFSC}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Payout Amount:</span>
                <span className="info-value">₹{parseFloat(creatorData.amountINR || 0).toLocaleString()}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Address:</span>
                <span className="info-value">
                  {creatorData.address}
                  {creatorData.city && `, ${creatorData.city}`}
                  {creatorData.state && `, ${creatorData.state}`}
                  {creatorData.pincode && ` - ${creatorData.pincode}`}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="summary-footer">
          <div className="terms">
            <h4 className="terms-title">Terms & Conditions</h4>
            <ul className="terms-list">
              <li>Payment is due within 30 days of invoice date</li>
              <li>All prices are inclusive of GST where applicable</li>
              <li>Creator payouts will be processed within 7 business days</li>
              <li>Any disputes must be raised within 15 days of invoice date</li>
              <li>TaagMedia reserves the right to modify terms with prior notice</li>
            </ul>
          </div>
          
          <div className="signature-section">
            <div className="signature">
              <div className="signature-line"></div>
              <p className="signature-label">Authorized Signature</p>
            </div>
            <div className="company-seal">
              <div className="seal">
                <span className="seal-text">TaagMedia<br/>Official Seal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons no-print">
        <div className="button-group">
          <button className="btn btn-secondary" onClick={() => navigate('/billing')}>
            ← Back to Billing
          </button>
          <button className="btn btn-secondary" onClick={handleDownload}>
            📥 Download Data
          </button>
        </div>
        
        <div className="button-group">
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSavePDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? '⏳ Generating...' : '📄 Save as PDF'}
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            🏠 Go to Dashboard
          </button>
        </div>
      </div>

      <div className="confirmation-message">
        <div className="success-icon">✅</div>
        <h3 className="confirmation-title">Information Saved Successfully!</h3>
        <p className="confirmation-text">
          Your billing information has been saved and is ready for processing.
          You can print this summary or save it as PDF for your records.
        </p>
      </div>
    </div>
  );
};

export default Summary;

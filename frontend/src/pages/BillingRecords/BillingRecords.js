import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billingAPI, invoiceAPI } from '../../services/api';
import './BillingRecords.css';

const BillingRecords = () => {
  const navigate = useNavigate();
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingPDF, setDownloadingPDF] = useState(null);

  useEffect(() => {
    fetchBillings();
  }, []);

  const fetchBillings = async () => {
    setLoading(true);
    setError('');
    
    console.log('fetchBillings: Starting API call...');
    
    try {
      console.log('fetchBillings: Calling billingAPI.getAllBillings()...');
      const response = await billingAPI.getAllBillings();
      
      console.log('fetchBillings: API response received:', response);
      console.log('fetchBillings: Response data:', response.data);
      console.log('fetchBillings: Billings array:', response.data.billings);
      
      const billings = response.data.billings || [];
      console.log('fetchBillings: Setting billings state:', billings);
      
      setBillings(billings);
    } catch (error) {
      console.error('fetchBillings: Error caught:', error);
      console.error('fetchBillings: Error response:', error.response);
      console.error('fetchBillings: Error message:', error.message);
      
      if (error.response) {
        console.error('fetchBillings: Status:', error.response.status);
        console.error('fetchBillings: Data:', error.response.data);
      }
      
      setError('Failed to load billing records: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleViewSummary = (billingId) => {
    // Navigate to summary with billing ID
    navigate(`/summary/${billingId}`);
  };

  const handleCreatePayout = (billingId) => {
    // Navigate to billing page with creator tab and pre-selected billing ID
    navigate('/billing', { 
      state: { 
        activeTab: 'creator', 
        selectedBillingId: billingId 
      } 
    });
  };

  const handleDownloadPDF = async (billing) => {
    setDownloadingPDF(billing.billingId);
    
    try {
      // Calculate GST
      const baseAmount = billing.budget || 0;
      const gst = baseAmount * 0.18;
      const total = baseAmount + gst;
      
      const invoiceData = {
        brandName: billing.company,
        creatorName: 'Creator Services',
        amount: baseAmount,
        gst: gst,
        total: total,
        invoiceNumber: `INV-${billing.billingId.slice(-6)}`,
        date: new Date(billing.date).toLocaleDateString(),
        brandData: {
          company: billing.company,
          email: billing.email || '',
          phone: billing.phone || '',
          address: billing.address || '',
          GSTIN: billing.GSTIN || ''
        },
        type: 'billing'
      };

      console.log('Requesting PDF for invoice data:', invoiceData);

      const response = await invoiceAPI.generateAndDownload(invoiceData);
      
      console.log('PDF response received:', response);
      console.log('Response headers:', response.headers);
      console.log('Response data type:', typeof response.data);
      console.log('Response data size:', response.data?.size || 'unknown');
      
      // Ensure we have a valid blob
      if (!response.data || response.data.size === 0) {
        throw new Error('Received empty PDF data');
      }
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceData.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('PDF download triggered successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      console.error('Error response:', error.response);
      alert(`Failed to download PDF: ${error.response?.data?.error || error.message}`);
    } finally {
      setDownloadingPDF(null);
    }
  };

  if (loading) {
    return (
      <div className="billing-records">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading billing records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-records fade-in">
      <div className="page-header">
        <h1 className="page-title">Billing Records</h1>
        <p className="page-subtitle">
          View and manage all billing records and creator payouts
        </p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="records-container">
        <div className="records-header">
          <div className="records-info">
            <h2 className="records-title">All Billing Records ({billings.length})</h2>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-secondary" 
              onClick={fetchBillings}
            >
              🔄 Refresh
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/billing')}
            >
              ➕ New Billing
            </button>
          </div>
        </div>

        {billings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">No Billing Records Found</h3>
            <p className="empty-text">
              Create your first billing record to get started.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/billing')}
            >
              Create First Billing
            </button>
          </div>
        ) : (
          <div className="records-grid">
            {billings.map((billing) => (
              <div key={billing.billingId} className="billing-card">
                <div className="card-header">
                  <div className="company-info">
                    <h3 className="company-name">{billing.company}</h3>
                    <span className="billing-id">ID: {billing.billingId.slice(-6)}</span>
                  </div>
                  <div className="billing-status">
                    {billing.hasCreatorPayout ? (
                      <span className="status-badge completed">✅ Payout Created</span>
                    ) : (
                      <span className="status-badge pending">⏳ Pending Payout</span>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <div className="billing-details">
                    <div className="detail-item">
                      <span className="detail-label">Budget:</span>
                      <span className="detail-value">₹{billing.budget.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total (with GST):</span>
                      <span className="detail-value total">₹{billing.total.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {new Date(billing.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewSummary(billing.billingId)}
                  >
                    👁️ View Summary
                  </button>
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => handleDownloadPDF(billing)}
                    disabled={downloadingPDF === billing.billingId}
                  >
                    {downloadingPDF === billing.billingId ? '⏳ Generating...' : '📄 Download PDF'}
                  </button>
                  {!billing.hasCreatorPayout && (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleCreatePayout(billing.billingId)}
                    >
                      💰 Create Payout
                    </button>
                  )}
                  {billing.hasCreatorPayout && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleCreatePayout(billing.billingId)}
                    >
                      ✏️ Edit Payout
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BillingRecords;

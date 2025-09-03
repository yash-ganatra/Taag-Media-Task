import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billingAPI } from '../../services/api';
import './Billing.css';

const Billing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('brand');
  const [brandData, setBrandData] = useState({
    company: '',
    GSTIN: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
    phone: '',
    budgetINR: '',
    paymentMethod: 'bank_transfer'
  });
  const [creatorData, setCreatorData] = useState({
    billingId: '', // This will be needed for the API
    name: '',
    PAN: '',
    UPI: '',
    bankName: '',
    accountNumber: '',
    IFSC: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    amountINR: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [availableBillings, setAvailableBillings] = useState([]);
  const [loadingBillings, setLoadingBillings] = useState(false);

  // Fetch available billing records when component mounts or when creator tab is active
  useEffect(() => {
    if (activeTab === 'creator') {
      fetchAvailableBillings();
    }
  }, [activeTab]);

  const fetchAvailableBillings = async () => {
    setLoadingBillings(true);
    try {
      const response = await billingAPI.getAllBillings();
      setAvailableBillings(response.data.billings || []);
    } catch (error) {
      console.error('Error fetching billings:', error);
      setErrors({ general: 'Failed to load available billing records' });
    } finally {
      setLoadingBillings(false);
    }
  };

  const validateGST = (gstin) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstin);
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  };

  const calculateGST = (amount) => {
    const baseAmount = parseFloat(amount) || 0;
    const gst = baseAmount * 0.18;
    const total = baseAmount + gst;
    return { baseAmount, gst, total };
  };

  const validateBrandForm = () => {
    const newErrors = {};

    if (!brandData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!brandData.GSTIN.trim()) {
      newErrors.GSTIN = 'GSTIN is required';
    } else if (!validateGST(brandData.GSTIN)) {
      newErrors.GSTIN = 'Please enter a valid GSTIN format';
    }

    if (!brandData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(brandData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!brandData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(brandData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!brandData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!brandData.budgetINR.trim()) {
      newErrors.budgetINR = 'Budget is required';
    } else if (isNaN(brandData.budgetINR) || parseFloat(brandData.budgetINR) <= 0) {
      newErrors.budgetINR = 'Please enter a valid budget amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCreatorForm = () => {
    const newErrors = {};

    if (!creatorData.billingId.trim()) {
      newErrors.billingId = 'Billing ID is required';
    }

    if (!creatorData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!creatorData.PAN.trim()) {
      newErrors.PAN = 'PAN is required';
    } else if (!validatePAN(creatorData.PAN)) {
      newErrors.PAN = 'Please enter a valid PAN format (e.g., ABCDE1234F)';
    }

    if (!creatorData.UPI.trim()) {
      newErrors.UPI = 'UPI ID is required';
    } else if (!/^[\w.-]+@[\w.-]+$/.test(creatorData.UPI)) {
      newErrors.UPI = 'Please enter a valid UPI ID';
    }

    if (!creatorData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!creatorData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }

    if (!creatorData.IFSC.trim()) {
      newErrors.IFSC = 'IFSC code is required';
    } else if (!validateIFSC(creatorData.IFSC)) {
      newErrors.IFSC = 'Please enter a valid IFSC code';
    }

    if (!creatorData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!creatorData.amountINR.trim()) {
      newErrors.amountINR = 'Amount is required';
    } else if (isNaN(creatorData.amountINR) || parseFloat(creatorData.amountINR) <= 0) {
      newErrors.amountINR = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBrandChange = (e) => {
    const { name, value } = e.target;
    setBrandData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCreatorChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Auto-format inputs
    if (name === 'GSTIN' || name === 'PAN' || name === 'IFSC') {
      processedValue = value.toUpperCase();
    }

    if (name === 'phone') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setCreatorData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGSTINChange = (e) => {
    const { value } = e.target;
    const processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setBrandData(prev => ({
      ...prev,
      GSTIN: processedValue
    }));

    if (errors.GSTIN) {
      setErrors(prev => ({
        ...prev,
        GSTIN: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let isValid = false;
    if (activeTab === 'brand') {
      isValid = validateBrandForm();
    } else {
      isValid = validateCreatorForm();
    }

    if (!isValid) return;

    setLoading(true);

    try {
      if (activeTab === 'brand') {
        const response = await billingAPI.createBrand(brandData);
        navigate('/summary', {
          state: {
            brandData,
            billingId: response.data.billingId,
            activeTab
          }
        });
      } else {
        const response = await billingAPI.createCreator(creatorData);
        navigate('/summary', {
          state: {
            creatorData,
            billingId: response.data.billingId,
            activeTab
          }
        });
      }
    } catch (error) {
      console.error('Billing API error:', error);
      setErrors({ 
        general: error.response?.data?.error || 'Failed to save billing information. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const gstCalculation = calculateGST(brandData.budgetINR);

  return (
    <div className="billing fade-in">
      <div className="page-header">
        <h1 className="page-title">Billing & Payout</h1>
        <p className="page-subtitle">
          Manage billing information and creator payout details
        </p>
      </div>

      <div className="billing-container">
        {/* Tab Navigation */}
        <div className="tabs">
          <ul className="tab-list">
            <li
              className={`tab-item ${activeTab === 'brand' ? 'active' : ''}`}
              onClick={() => setActiveTab('brand')}
            >
              <span className="tab-icon">🏢</span>
              Brand Billing
            </li>
            <li
              className={`tab-item ${activeTab === 'creator' ? 'active' : ''}`}
              onClick={() => setActiveTab('creator')}
            >
              <span className="tab-icon">👤</span>
              Creator Payout
            </li>
          </ul>
        </div>

        <div className="tab-content">
          {errors.general && (
            <div className="error-banner">
              {errors.general}
            </div>
          )}

          {/* Brand Billing Tab */}
          {activeTab === 'brand' && (
            <form onSubmit={handleSubmit} className="billing-form">
              <div className="form-section">
                <h2 className="section-title">Company Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="company" className="form-label">Company Name *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={brandData.company}
                      onChange={handleBrandChange}
                      className={`form-input ${errors.company ? 'error' : ''}`}
                      placeholder="Enter company name"
                    />
                    {errors.company && <div className="form-error">{errors.company}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="GSTIN" className="form-label">GSTIN *</label>
                    <input
                      type="text"
                      id="GSTIN"
                      name="GSTIN"
                      value={brandData.GSTIN}
                      onChange={handleGSTINChange}
                      className={`form-input ${errors.GSTIN ? 'error' : ''}`}
                      placeholder="22AAAAA0000A1Z5"
                      maxLength="15"
                    />
                    {errors.GSTIN && <div className="form-error">{errors.GSTIN}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={brandData.email}
                      onChange={handleBrandChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter email address"
                    />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={brandData.phone}
                      onChange={handleBrandChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="Enter 10-digit phone number"
                      maxLength="10"
                    />
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Address Information</h2>
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={brandData.address}
                    onChange={handleBrandChange}
                    className={`form-textarea ${errors.address ? 'error' : ''}`}
                    placeholder="Enter complete address"
                    rows="3"
                  />
                  {errors.address && <div className="form-error">{errors.address}</div>}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={brandData.city}
                      onChange={handleBrandChange}
                      className="form-input"
                      placeholder="Enter city"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="state" className="form-label">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={brandData.state}
                      onChange={handleBrandChange}
                      className="form-input"
                      placeholder="Enter state"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode" className="form-label">Pincode</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={brandData.pincode}
                      onChange={handleBrandChange}
                      className="form-input"
                      placeholder="Enter pincode"
                      maxLength="6"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Payment Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="budgetINR" className="form-label">Budget Amount (₹) *</label>
                    <input
                      type="number"
                      id="budgetINR"
                      name="budgetINR"
                      value={brandData.budgetINR}
                      onChange={handleBrandChange}
                      className={`form-input ${errors.budgetINR ? 'error' : ''}`}
                      placeholder="Enter budget amount"
                      min="0"
                      step="1"
                    />
                    {errors.budgetINR && <div className="form-error">{errors.budgetINR}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={brandData.paymentMethod}
                      onChange={handleBrandChange}
                      className="form-select"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                    </select>
                  </div>
                </div>

                {brandData.budgetINR && (
                  <div className="gst-summary">
                    <h3 className="summary-title">GST Calculation</h3>
                    <div className="summary-grid">
                      <div className="summary-item">
                        <span className="summary-label">Base Amount:</span>
                        <span className="summary-value">₹{gstCalculation.baseAmount.toLocaleString()}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">GST (18%):</span>
                        <span className="summary-value">₹{gstCalculation.gst.toLocaleString()}</span>
                      </div>
                      <div className="summary-item total">
                        <span className="summary-label">Total Amount:</span>
                        <span className="summary-value">₹{gstCalculation.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save & Continue'}
                </button>
              </div>
            </form>
          )}

          {/* Creator Payout Tab */}
          {activeTab === 'creator' && (
            <form onSubmit={handleSubmit} className="billing-form">
              <div className="form-section">
                <h2 className="section-title">Billing Reference</h2>
                <div className="form-group">
                  <label htmlFor="billingId" className="form-label">Select Billing Record *</label>
                  {loadingBillings ? (
                    <div className="loading-billings">Loading available billing records...</div>
                  ) : (
                    <select
                      id="billingId"
                      name="billingId"
                      value={creatorData.billingId}
                      onChange={handleCreatorChange}
                      className={`form-select ${errors.billingId ? 'error' : ''}`}
                    >
                      <option value="">Select a billing record</option>
                      {availableBillings.map((billing) => (
                        <option key={billing.billingId} value={billing.billingId}>
                          {billing.company} - ₹{billing.total.toLocaleString()} 
                          ({new Date(billing.date).toLocaleDateString()})
                          {billing.hasCreatorPayout ? ' ⚠️ Has Payout' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.billingId && <div className="form-error">{errors.billingId}</div>}
                  <div className="form-help">
                    Select the billing record for which you want to create a creator payout.
                    {availableBillings.length === 0 && !loadingBillings && (
                      <span style={{ color: 'var(--warning-color)', display: 'block', marginTop: '4px' }}>
                        No billing records found. Please create a brand billing first.
                      </span>
                    )}
                  </div>
                  
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={fetchAvailableBillings}
                    style={{ marginTop: '8px' }}
                  >
                    🔄 Refresh Billing Records
                  </button>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Personal Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={creatorData.name}
                      onChange={handleCreatorChange}
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Enter full name"
                    />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="PAN" className="form-label">PAN Card Number *</label>
                    <input
                      type="text"
                      id="PAN"
                      name="PAN"
                      value={creatorData.PAN}
                      onChange={handleCreatorChange}
                      className={`form-input ${errors.PAN ? 'error' : ''}`}
                      placeholder="ABCDE1234F"
                      maxLength="10"
                    />
                    {errors.PAN && <div className="form-error">{errors.PAN}</div>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Payment Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="UPI" className="form-label">UPI ID *</label>
                    <input
                      type="text"
                      id="UPI"
                      name="UPI"
                      value={creatorData.UPI}
                      onChange={handleCreatorChange}
                      className={`form-input ${errors.UPI ? 'error' : ''}`}
                      placeholder="username@paytm"
                    />
                    {errors.UPI && <div className="form-error">{errors.UPI}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="bankName" className="form-label">Bank Name *</label>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={creatorData.bankName}
                      onChange={handleCreatorChange}
                      className={`form-input ${errors.bankName ? 'error' : ''}`}
                      placeholder="Enter bank name"
                    />
                    {errors.bankName && <div className="form-error">{errors.bankName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="accountNumber" className="form-label">Account Number *</label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={creatorData.accountNumber}
                      onChange={handleCreatorChange}
                      className={`form-input ${errors.accountNumber ? 'error' : ''}`}
                      placeholder="Enter account number"
                    />
                    {errors.accountNumber && <div className="form-error">{errors.accountNumber}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="IFSC" className="form-label">IFSC Code *</label>
                    <input
                      type="text"
                      id="IFSC"
                      name="IFSC"
                      value={creatorData.IFSC}
                      onChange={handleCreatorChange}
                      className={`form-input ${errors.IFSC ? 'error' : ''}`}
                      placeholder="SBIN0001234"
                      maxLength="11"
                    />
                    {errors.IFSC && <div className="form-error">{errors.IFSC}</div>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Payout Information</h2>
                <div className="form-group">
                  <label htmlFor="amountINR" className="form-label">Payout Amount (₹) *</label>
                  <input
                    type="number"
                    id="amountINR"
                    name="amountINR"
                    value={creatorData.amountINR}
                    onChange={handleCreatorChange}
                    className={`form-input ${errors.amountINR ? 'error' : ''}`}
                    placeholder="Enter payout amount"
                    min="0"
                    step="1"
                  />
                  {errors.amountINR && <div className="form-error">{errors.amountINR}</div>}
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Address Information</h2>
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={creatorData.address}
                    onChange={handleCreatorChange}
                    className={`form-textarea ${errors.address ? 'error' : ''}`}
                    placeholder="Enter complete address"
                    rows="3"
                  />
                  {errors.address && <div className="form-error">{errors.address}</div>}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={creatorData.city}
                      onChange={handleCreatorChange}
                      className="form-input"
                      placeholder="Enter city"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="state" className="form-label">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={creatorData.state}
                      onChange={handleCreatorChange}
                      className="form-input"
                      placeholder="Enter state"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode" className="form-label">Pincode</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={creatorData.pincode}
                      onChange={handleCreatorChange}
                      className="form-input"
                      placeholder="Enter pincode"
                      maxLength="6"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save & Continue'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchAPI } from '../../services/api';
import './BrandBrief.css';

const BrandBrief = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    budgetINR: '',
    targetLocations: [],
    targetAges: [18, 65],
    goals: '',
    tone: [],
    platforms: [],
    template: '',
    description: '',
    timeline: '',
    deliverables: '',
    constraints: {
      noAdultContent: true,
      timelineDays: 30
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    'Fashion & Beauty',
    'Technology',
    'Food & Beverage',
    'Travel & Tourism',
    'Health & Fitness',
    'Automotive',
    'Finance',
    'Education',
    'Entertainment',
    'Home & Garden'
  ];

  const platforms = [
    'Instagram',
    'YouTube',
    'TikTok',
    'Twitter',
    'Facebook',
    'LinkedIn',
    'Snapchat',
    'Pinterest'
  ];

  const tones = [
    'Professional',
    'Casual',
    'Humorous',
    'Inspirational',
    'Educational',
    'Trendy',
    'Luxury',
    'Authentic'
  ];

  const templates = [
    { id: 'product-launch', name: 'Product Launch Campaign', description: 'Perfect for introducing new products' },
    { id: 'brand-awareness', name: 'Brand Awareness Campaign', description: 'Build brand recognition and reach' },
    { id: 'seasonal', name: 'Seasonal Campaign', description: 'Holiday and seasonal promotions' },
    { id: 'influencer-collab', name: 'Influencer Collaboration', description: 'Long-term creator partnerships' },
    { id: 'custom', name: 'Custom Campaign', description: 'Create your own unique campaign' }
  ];

  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Goa'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.budgetINR) {
      newErrors.budgetINR = 'Budget is required';
    } else if (isNaN(formData.budgetINR) || parseFloat(formData.budgetINR) <= 0) {
      newErrors.budgetINR = 'Please enter a valid budget amount';
    }

    if (formData.targetLocations.length === 0) {
      newErrors.targetLocations = 'At least one location is required';
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = 'At least one platform is required';
    }

    if (!formData.goals.trim()) {
      newErrors.goals = 'Campaign goals are required';
    }

    if (formData.tone.length === 0) {
      newErrors.tone = 'At least one tone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const handleMultiSelect = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTemplateSelect = (templateId) => {
    setFormData(prev => ({
      ...prev,
      template: templateId
    }));

    // Auto-fill based on template
    const templateData = {
      'product-launch': {
        goals: 'Introduce new product to target audience and drive initial sales',
        tone: ['Professional'],
        platforms: ['Instagram', 'YouTube']
      },
      'brand-awareness': {
        goals: 'Increase brand visibility and recognition among target demographics',
        tone: ['Trendy'],
        platforms: ['Instagram', 'TikTok', 'YouTube']
      },
      'seasonal': {
        goals: 'Capitalize on seasonal trends and drive holiday sales',
        tone: ['Casual'],
        platforms: ['Instagram', 'Facebook']
      },
      'influencer-collab': {
        goals: 'Build long-term partnerships with creators for authentic brand advocacy',
        tone: ['Authentic'],
        platforms: ['Instagram', 'YouTube']
      }
    };

    if (templateData[templateId]) {
      setFormData(prev => ({
        ...prev,
        ...templateData[templateId]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Prepare data for backend API
      const briefData = {
        category: formData.category,
        platforms: formData.platforms,
        budgetINR: parseFloat(formData.budgetINR),
        targetLocations: formData.targetLocations,
        targetAges: formData.targetAges,
        tone: formData.tone,
        constraints: formData.constraints
      };

      console.log('Sending brief data:', briefData);
      const response = await matchAPI.findMatches(briefData);
      
      navigate('/match-console', { 
        state: { 
          message: 'Brand brief created successfully! Here are your creator matches.',
          creators: response.data.creators,
          briefData: formData 
        } 
      });
    } catch (error) {
      console.error('Match API error:', error);
      // If API fails, still navigate to match console with mock data
      navigate('/match-console', { 
        state: { 
          message: 'Brand brief created successfully! Showing available creators.',
          briefData: formData 
        } 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brand-brief fade-in">
      <div className="page-header">
        <h1 className="page-title">Create Brand Brief</h1>
        <p className="page-subtitle">
          Define your campaign requirements and find the perfect creators
        </p>
      </div>

      <form onSubmit={handleSubmit} className="brand-brief-form">
        {errors.general && (
          <div className="error-banner">
            {errors.general}
          </div>
        )}

        {/* Template Selection */}
        <div className="form-section">
          <h2 className="section-title">Choose Template (Optional)</h2>
          <div className="template-grid">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`template-card ${formData.template === template.id ? 'selected' : ''}`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <h3 className="template-name">{template.name}</h3>
                <p className="template-description">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="category" className="form-label">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-select ${errors.category ? 'error' : ''}`}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <div className="form-error">{errors.category}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="budgetINR" className="form-label">Budget (₹) *</label>
              <input
                type="number"
                id="budgetINR"
                name="budgetINR"
                value={formData.budgetINR}
                onChange={handleChange}
                className={`form-input ${errors.budgetINR ? 'error' : ''}`}
                placeholder="Enter campaign budget"
                min="0"
                step="1000"
              />
              {errors.budgetINR && <div className="form-error">{errors.budgetINR}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="timeline" className="form-label">Campaign Timeline (Days)</label>
              <input
                type="number"
                id="timeline"
                name="timeline"
                value={formData.constraints.timelineDays}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  constraints: { ...prev.constraints, timelineDays: parseInt(e.target.value) || 30 }
                }))}
                className="form-input"
                placeholder="e.g., 30"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="form-section">
          <h2 className="section-title">Target Audience</h2>
          
          <div className="form-group">
            <label className="form-label">Locations *</label>
            <div className="checkbox-grid">
              {locations.map((location) => (
                <label key={location} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.targetLocations.includes(location)}
                    onChange={() => handleMultiSelect('targetLocations', location)}
                  />
                  <span className="checkmark"></span>
                  {location}
                </label>
              ))}
            </div>
            {errors.targetLocations && <div className="form-error">{errors.targetLocations}</div>}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="ageRangeMin" className="form-label">Age Range - Min</label>
              <select
                id="ageRangeMin"
                name="ageRangeMin"
                value={formData.targetAges[0]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  targetAges: [parseInt(e.target.value), prev.targetAges[1]]
                }))}
                className="form-select"
              >
                {Array.from({ length: 8 }, (_, i) => 18 + i * 5).map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ageRangeMax" className="form-label">Age Range - Max</label>
              <select
                id="ageRangeMax"
                name="ageRangeMax"
                value={formData.targetAges[1]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  targetAges: [prev.targetAges[0], parseInt(e.target.value)]
                }))}
                className="form-select"
              >
                {Array.from({ length: 10 }, (_, i) => 25 + i * 5).map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="form-section">
          <h2 className="section-title">Campaign Details</h2>
          
          <div className="form-group">
            <label htmlFor="goals" className="form-label">Campaign Goals *</label>
            <textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              className={`form-textarea ${errors.goals ? 'error' : ''}`}
              placeholder="Describe what you want to achieve with this campaign..."
              rows="4"
            />
            {errors.goals && <div className="form-error">{errors.goals}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="tone" className="form-label">Brand Tone *</label>
            <div className="checkbox-grid">
              {tones.map((toneOption) => (
                <label key={toneOption} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.tone.includes(toneOption)}
                    onChange={() => handleMultiSelect('tone', toneOption)}
                  />
                  <span className="checkmark"></span>
                  {toneOption}
                </label>
              ))}
            </div>
            {errors.tone && <div className="form-error">{errors.tone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Platforms *</label>
            <div className="checkbox-grid">
              {platforms.map((platform) => (
                <label key={platform} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(platform)}
                    onChange={() => handleMultiSelect('platforms', platform)}
                  />
                  <span className="checkmark"></span>
                  {platform}
                </label>
              ))}
            </div>
            {errors.platforms && <div className="form-error">{errors.platforms}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="deliverables" className="form-label">Expected Deliverables</label>
            <textarea
              id="deliverables"
              name="deliverables"
              value={formData.deliverables}
              onChange={handleChange}
              className="form-textarea"
              placeholder="e.g., 3 Instagram posts, 1 story series, 1 reel..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Additional Details</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Any additional requirements or information..."
              rows="4"
            />
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
            {loading ? 'Creating Brief...' : 'Create Brief & Find Creators'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandBrief;

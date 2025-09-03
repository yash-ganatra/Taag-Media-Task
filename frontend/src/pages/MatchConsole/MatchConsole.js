import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { matchAPI } from '../../services/api';
import './MatchConsole.css';

const MatchConsole = () => {
  const location = useLocation();
  const [creators, setCreators] = useState([]);
  const [filteredCreators, setFilteredCreators] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    budget: '',
    location: '',
    scoreRange: [0, 100],
    platform: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedCreators, setSelectedCreators] = useState([]);

  // Mock creators data
  const mockCreators = [
    {
      id: 1,
      name: 'Priya Sharma',
      username: '@priya_fashion',
      avatar: '👩‍💼',
      category: 'Fashion & Beauty',
      followers: '125K',
      engagement: '4.2%',
      location: 'Mumbai',
      platforms: ['Instagram', 'YouTube'],
      score: 95,
      budget: 25000,
      reasons: ['High Engagement', 'Brand Fit', 'Audience Match'],
      bio: 'Fashion influencer specializing in sustainable fashion and lifestyle content.',
      recentWork: ['Brand A Campaign', 'Fashion Week Coverage'],
      demographics: { age: '18-34', gender: '75% Female' }
    },
    {
      id: 2,
      name: 'Arjun Kumar',
      username: '@tech_arjun',
      avatar: '👨‍💻',
      category: 'Technology',
      followers: '89K',
      engagement: '3.8%',
      location: 'Bangalore',
      platforms: ['YouTube', 'LinkedIn'],
      score: 88,
      budget: 35000,
      reasons: ['Tech Expertise', 'Professional Content', 'B2B Audience'],
      bio: 'Tech reviewer and software engineer creating educational content.',
      recentWork: ['Tech Product Reviews', 'Coding Tutorials'],
      demographics: { age: '25-45', gender: '80% Male' }
    },
    {
      id: 3,
      name: 'Sneha Patel',
      username: '@foodie_sneha',
      avatar: '👩‍🍳',
      category: 'Food & Beverage',
      followers: '156K',
      engagement: '5.1%',
      location: 'Delhi',
      platforms: ['Instagram', 'TikTok'],
      score: 92,
      budget: 20000,
      reasons: ['Food Content', 'High Engagement', 'Visual Appeal'],
      bio: 'Food blogger and chef sharing recipes and restaurant reviews.',
      recentWork: ['Restaurant Collaborations', 'Recipe Videos'],
      demographics: { age: '22-40', gender: '65% Female' }
    },
    {
      id: 4,
      name: 'Rahul Mehta',
      username: '@fitness_rahul',
      avatar: '🏋️‍♂️',
      category: 'Health & Fitness',
      followers: '78K',
      engagement: '4.5%',
      location: 'Pune',
      platforms: ['Instagram', 'YouTube'],
      score: 85,
      budget: 18000,
      reasons: ['Fitness Focus', 'Male Audience', 'Consistent Content'],
      bio: 'Certified trainer promoting healthy lifestyle and fitness.',
      recentWork: ['Supplement Reviews', 'Workout Programs'],
      demographics: { age: '20-35', gender: '60% Male' }
    },
    {
      id: 5,
      name: 'Kavya Reddy',
      username: '@travel_kavya',
      avatar: '✈️',
      category: 'Travel & Tourism',
      followers: '203K',
      engagement: '4.8%',
      location: 'Hyderabad',
      platforms: ['Instagram', 'YouTube', 'TikTok'],
      score: 90,
      budget: 40000,
      reasons: ['Travel Content', 'Visual Storytelling', 'Multi-platform'],
      bio: 'Travel blogger documenting adventures across India and abroad.',
      recentWork: ['Tourism Board Campaigns', 'Hotel Collaborations'],
      demographics: { age: '25-45', gender: '70% Female' }
    },
    {
      id: 6,
      name: 'Amit Singh',
      username: '@finance_amit',
      avatar: '💼',
      category: 'Finance',
      followers: '92K',
      engagement: '3.5%',
      location: 'Mumbai',
      platforms: ['LinkedIn', 'YouTube'],
      score: 82,
      budget: 30000,
      reasons: ['Financial Expertise', 'Professional Network', 'Educational Content'],
      bio: 'Financial advisor creating content about investment and personal finance.',
      recentWork: ['Investment Webinars', 'Financial Literacy Campaigns'],
      demographics: { age: '28-50', gender: '55% Male' }
    }
  ];

  useEffect(() => {
    // Check if creators data was passed from BrandBrief
    if (location.state?.creators) {
      setCreators(location.state.creators);
      setFilteredCreators(location.state.creators);
      setLoading(false);
    } else {
      // Load creators from API
      loadCreators();
    }
  }, [location.state]);

  const loadCreators = async () => {
    try {
      const response = await matchAPI.getCreators();
      const creatorsData = response.data.creators || [];
      
      // Transform backend data to frontend format
      const transformedCreators = creatorsData.map((creator, index) => ({
        id: creator._id || index + 1,
        name: creator.handle || `Creator ${index + 1}`,
        username: `@${creator.handle || 'creator'}`,
        avatar: getRandomAvatar(),
        category: creator.verticals?.[0] || 'General',
        followers: formatFollowers(creator.avgViews),
        engagement: `${(creator.engagementRate * 100 || 0).toFixed(1)}%`,
        location: getRandomLocation(),
        platforms: creator.platforms || ['Instagram'],
        score: Math.floor(Math.random() * 20) + 80, // Random score for demo
        budget: creator.basePriceINR || 25000, // Ensure budget is always a number
        reasons: getMatchReasons(creator),
        bio: `Content creator specializing in ${creator.verticals?.join(', ') || 'various topics'}.`,
        recentWork: ['Recent Campaign 1', 'Recent Campaign 2'],
        demographics: { age: '25-35', gender: '60% Mixed' }
      }));

      setCreators(transformedCreators);
      setFilteredCreators(transformedCreators);
    } catch (error) {
      console.error('Error loading creators:', error);
      // Fallback to mock data
      setCreators(mockCreators);
      setFilteredCreators(mockCreators);
    } finally {
      setLoading(false);
    }
  };

  const getRandomAvatar = () => {
    const avatars = ['👩‍💼', '👨‍💻', '👩‍🍳', '🏋️‍♂️', '✈️', '💼'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const formatFollowers = (views) => {
    if (!views) return '0';
    if (views > 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views > 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  const getRandomLocation = () => {
    const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getMatchReasons = (creator) => {
    const reasons = [];
    if (creator.engagementRate > 0.04) reasons.push('High Engagement');
    if (creator.verticals?.length > 0) reasons.push('Category Match');
    if (creator.platforms?.includes('Instagram')) reasons.push('Platform Match');
    return reasons.length > 0 ? reasons : ['Content Quality', 'Audience Fit'];
  };

  useEffect(() => {
    filterCreators();
  }, [filters, creators]);

  const filterCreators = () => {
    let filtered = creators;

    if (filters.category) {
      filtered = filtered.filter(creator => creator.category === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter(creator => creator.location === filters.location);
    }

    if (filters.platform) {
      filtered = filtered.filter(creator => creator.platforms.includes(filters.platform));
    }

    if (filters.budget) {
      const budgetLimit = parseInt(filters.budget);
      filtered = filtered.filter(creator => creator.budget <= budgetLimit);
    }

    filtered = filtered.filter(creator => 
      creator.score >= filters.scoreRange[0] && creator.score <= filters.scoreRange[1]
    );

    // Sort by score
    filtered.sort((a, b) => b.score - a.score);

    setFilteredCreators(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleScoreRangeChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      scoreRange: [value, 100]
    }));
  };

  const toggleCreatorSelection = (creatorId) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      budget: '',
      location: '',
      scoreRange: [0, 100],
      platform: ''
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'warning';
    return 'danger';
  };

  const categories = ['Fashion & Beauty', 'Technology', 'Food & Beverage', 'Health & Fitness', 'Travel & Tourism', 'Finance'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];
  const platforms = ['Instagram', 'YouTube', 'TikTok', 'LinkedIn', 'Facebook'];

  if (loading) {
    return (
      <div className="match-console">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Finding perfect creator matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="match-console fade-in">
      {location.state?.message && (
        <div className="success-banner">
          {location.state.message}
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">Creator Match Console</h1>
        <p className="page-subtitle">
          Discover creators that perfectly match your brand requirements
        </p>
      </div>

      <div className="match-console-content">
        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-header">
            <h2 className="filters-title">Filters</h2>
            <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="form-select"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Platform</label>
              <select
                value={filters.platform}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
                className="form-select"
              >
                <option value="">All Platforms</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Max Budget (₹)</label>
              <select
                value={filters.budget}
                onChange={(e) => handleFilterChange('budget', e.target.value)}
                className="form-select"
              >
                <option value="">Any Budget</option>
                <option value="20000">Under ₹20,000</option>
                <option value="30000">Under ₹30,000</option>
                <option value="40000">Under ₹40,000</option>
                <option value="50000">Under ₹50,000</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                Min Score: {filters.scoreRange[0]}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.scoreRange[0]}
                onChange={handleScoreRangeChange}
                className="score-range"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <div className="results-header">
            <div className="results-info">
              <h2 className="results-title">
                {filteredCreators.length} Creator{filteredCreators.length !== 1 ? 's' : ''} Found
              </h2>
              {selectedCreators.length > 0 && (
                <span className="selected-count">
                  {selectedCreators.length} selected
                </span>
              )}
            </div>
            
            {selectedCreators.length > 0 && (
              <button className="btn btn-primary">
                Contact Selected ({selectedCreators.length})
              </button>
            )}
          </div>

          <div className="creators-grid">
            {filteredCreators.map((creator) => (
              <div
                key={creator.id}
                className={`creator-card ${selectedCreators.includes(creator.id) ? 'selected' : ''}`}
                onClick={() => toggleCreatorSelection(creator.id)}
              >
                <div className="creator-header">
                  <div className="creator-avatar">
                    {creator.avatar}
                  </div>
                  <div className="creator-info">
                    <h3 className="creator-name">{creator.name}</h3>
                    <p className="creator-username">{creator.username}</p>
                    <div className="creator-stats">
                      <span className="stat">{creator.followers}</span>
                      <span className="stat">{creator.engagement} eng.</span>
                      <span className="stat">{creator.location}</span>
                    </div>
                  </div>
                  <div className="creator-score">
                    <div className={`score-badge score-${getScoreColor(creator.score)}`}>
                      {creator.score}
                    </div>
                  </div>
                </div>

                <div className="creator-body">
                  <p className="creator-bio">{creator.bio}</p>
                  
                  <div className="creator-platforms">
                    {creator.platforms.map(platform => (
                      <span key={platform} className="platform-tag">
                        {platform}
                      </span>
                    ))}
                  </div>

                  <div className="match-reasons">
                    <h4 className="reasons-title">Match Reasons:</h4>
                    <div className="reasons-list">
                      {creator.reasons.map((reason, index) => (
                        <span key={index} className="reason-chip">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="progress-section">
                    <div className="progress-header">
                      <span className="progress-label">Match Score</span>
                      <span className="progress-value">{creator.score}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${creator.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="creator-footer">
                  <div className="budget-info">
                    <span className="budget-label">Estimated Cost:</span>
                    <span className="budget-amount">₹{(creator.budget || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="creator-actions">
                    <button className="btn btn-secondary btn-sm">
                      View Profile
                    </button>
                    <button className="btn btn-primary btn-sm">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCreators.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3 className="no-results-title">No creators found</h3>
              <p className="no-results-text">
                Try adjusting your filters to find more creator matches.
              </p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchConsole;

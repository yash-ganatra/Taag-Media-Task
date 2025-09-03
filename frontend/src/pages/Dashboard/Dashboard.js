import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const navigationCards = [
    {
      title: 'Brand Brief Form',
      description: 'Create and manage brand campaign briefs with detailed requirements',
      icon: '📝',
      path: '/brand-brief',
      color: 'blue',
      stats: '3 Active Briefs'
    },
    {
      title: 'Match Console',
      description: 'Discover and match with creators based on your brand requirements',
      icon: '🎯',
      path: '/match-console',
      color: 'green',
      stats: '127 Creators Available'
    },
    {
      title: 'Billing & Payout',
      description: 'Manage billing information and creator payouts seamlessly',
      icon: '💳',
      path: '/billing',
      color: 'purple',
      stats: '2 Pending Invoices'
    },
    {
      title: 'Billing Records',
      description: 'View all billing records and manage creator payouts',
      icon: '📋',
      path: '/billing-records',
      color: 'blue',
      stats: 'View All Records'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'brief_created',
      title: 'New brand brief created',
      description: 'Fashion Summer Campaign 2024',
      time: '2 hours ago',
      icon: '📝'
    },
    {
      id: 2,
      type: 'match_found',
      title: 'New creator match found',
      description: '@fashionista_jane - 95% match score',
      time: '5 hours ago',
      icon: '🎯'
    },
    {
      id: 3,
      type: 'payment_processed',
      title: 'Payment processed',
      description: 'Invoice #INV-001 - ₹25,000',
      time: '1 day ago',
      icon: '💳'
    }
  ];

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="dashboard-title">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your campaigns today
          </p>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">12</div>
            <div className="stat-label">Active Campaigns</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">89</div>
            <div className="stat-label">Creator Matches</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">₹2.4L</div>
            <div className="stat-label">Total Budget</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <section className="quick-actions">
          <div className="nav-cards-grid">
            {navigationCards.map((card) => (
              <Link
                key={card.path}
                to={card.path}
                className={`nav-card nav-card-${card.color}`}
              >
                <div className="nav-card-header">
                  <div className="nav-card-icon">{card.icon}</div>
                  <div className="nav-card-stats">{card.stats}</div>
                </div>
                <div className="nav-card-body">
                  <h3 className="nav-card-title">{card.title}</h3>
                  <p className="nav-card-description">{card.description}</p>
                </div>
                <div className="nav-card-footer">
                  <span className="nav-card-action">Get Started →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="recent-activity">
            <div className="section-header">
              <h2 className="section-title">Recent Activity</h2>
              <button className="btn btn-secondary btn-sm">View All</button>
            </div>
            
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <h4 className="activity-title">{activity.title}</h4>
                    <p className="activity-description">{activity.description}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="quick-insights">
            <div className="section-header">
              <h2 className="section-title">Quick Insights</h2>
            </div>
            
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-header">
                  <span className="insight-label">Campaign Performance</span>
                  <span className="insight-value">+12%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-header">
                  <span className="insight-label">Creator Engagement</span>
                  <span className="insight-value">8.4/10</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '84%' }}></div>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-header">
                  <span className="insight-label">Budget Utilization</span>
                  <span className="insight-value">67%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

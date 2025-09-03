// App Configuration
export const APP_CONFIG = {
  name: 'TaagMedia',
  version: '1.0.0',
  description: 'Creator-Brand Collaboration Platform',
  supportEmail: 'support@taagmedia.com',
  website: 'https://taagmedia.com',
};

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  brandBrief: {
    base: '/brand-brief',
    create: '/brand-brief',
    getAll: '/brand-brief',
    getById: (id) => `/brand-brief/${id}`,
    update: (id) => `/brand-brief/${id}`,
    delete: (id) => `/brand-brief/${id}`,
  },
  creators: {
    base: '/creators',
    getAll: '/creators',
    getById: (id) => `/creators/${id}`,
    getMatches: (briefId) => `/creators/matches/${briefId}`,
    contact: (id) => `/creators/${id}/contact`,
  },
  billing: {
    base: '/billing',
    invoice: '/billing/invoice',
    invoices: '/billing/invoices',
    getInvoiceById: (id) => `/billing/invoices/${id}`,
    updatePayment: (id) => `/billing/invoices/${id}/payment`,
    downloadInvoice: (id) => `/billing/invoices/${id}/download`,
  },
  payout: {
    base: '/payout',
    create: '/payout',
    getAll: '/payout',
    getById: (id) => `/payout/${id}`,
    updateStatus: (id) => `/payout/${id}/status`,
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    campaigns: (id) => `/analytics/campaigns/${id}`,
    creators: (id) => `/analytics/creators/${id}`,
  },
  files: {
    upload: '/files/upload',
    delete: (id) => `/files/${id}`,
  },
  notifications: {
    base: '/notifications',
    markAsRead: (id) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    delete: (id) => `/notifications/${id}`,
  },
};

// Form Validation Rules
export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    required: true,
    pattern: /^[6-9]\d{9}$/,
    message: 'Please enter a valid 10-digit phone number',
    minLength: 10,
    maxLength: 10,
  },
  pan: {
    required: true,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: 'Please enter a valid PAN format (e.g., ABCDE1234F)',
    minLength: 10,
    maxLength: 10,
  },
  gst: {
    required: true,
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    message: 'Please enter a valid GST format',
    minLength: 15,
    maxLength: 15,
  },
  ifsc: {
    required: true,
    pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    message: 'Please enter a valid IFSC code',
    minLength: 11,
    maxLength: 11,
  },
  upi: {
    required: true,
    pattern: /^[\w.-]+@[\w.-]+$/,
    message: 'Please enter a valid UPI ID',
  },
  pincode: {
    pattern: /^[1-9][0-9]{5}$/,
    message: 'Please enter a valid 6-digit pincode',
    minLength: 6,
    maxLength: 6,
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Password must be at least 6 characters long',
  },
};

// Business Categories
export const CATEGORIES = [
  'Fashion & Beauty',
  'Technology',
  'Food & Beverage',
  'Travel & Tourism',
  'Health & Fitness',
  'Automotive',
  'Finance',
  'Education',
  'Entertainment',
  'Home & Garden',
  'Sports',
  'Gaming',
  'Art & Design',
  'Music',
  'Books & Literature',
];

// Social Media Platforms
export const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'snapchat', name: 'Snapchat', icon: '👻' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌' },
];

// Content Tones
export const CONTENT_TONES = [
  'Professional',
  'Casual',
  'Humorous',
  'Inspirational',
  'Educational',
  'Trendy',
  'Luxury',
  'Authentic',
  'Bold',
  'Minimalist',
];

// Indian Cities
export const INDIAN_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Kochi',
  'Goa',
  'Chandigarh',
  'Coimbatore',
  'Indore',
  'Bhopal',
  'Nagpur',
  'Visakhapatnam',
  'Thiruvananthapuram',
  'Vadodara',
];

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
  { id: 'upi', name: 'UPI', icon: '📱' },
  { id: 'credit_card', name: 'Credit Card', icon: '💳' },
  { id: 'debit_card', name: 'Debit Card', icon: '💳' },
  { id: 'wallet', name: 'Digital Wallet', icon: '👛' },
];

// Campaign Status
export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Invoice Status
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
};

// Payout Status
export const PAYOUT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

// File Types
export const ALLOWED_FILE_TYPES = {
  images: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  documents: ['pdf', 'doc', 'docx', 'txt'],
  videos: ['mp4', 'avi', 'mov', 'wmv'],
  all: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'txt', 'mp4', 'avi', 'mov', 'wmv'],
};

// File Size Limits (in bytes)
export const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Creator Score Ranges
export const SCORE_RANGES = {
  EXCELLENT: { min: 90, max: 100, label: 'Excellent', color: '#10b981' },
  GOOD: { min: 80, max: 89, label: 'Good', color: '#f59e0b' },
  AVERAGE: { min: 70, max: 79, label: 'Average', color: '#6b7280' },
  POOR: { min: 0, max: 69, label: 'Poor', color: '#ef4444' },
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'short',
  LONG: 'long',
  TIME: 'time',
  DATETIME: 'datetime',
  ISO: 'iso',
};

// Currency Settings
export const CURRENCY = {
  code: 'INR',
  symbol: '₹',
  locale: 'en-IN',
};

// GST Rate
export const GST_RATE = 18; // 18%

// Breakpoints for responsive design
export const BREAKPOINTS = {
  xs: '480px',
  sm: '768px',
  md: '1024px',
  lg: '1200px',
  xl: '1400px',
};

// Z-Index layers
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal_backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'userPreferences',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Data saved successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  CREATED: 'Created successfully!',
  SENT: 'Sent successfully!',
  UPLOADED: 'Uploaded successfully!',
};

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  NOTIFICATIONS: true,
  ANALYTICS: true,
  FILE_UPLOAD: true,
  REAL_TIME_CHAT: false,
  ADVANCED_FILTERS: true,
  BULK_OPERATIONS: false,
};

export default {
  APP_CONFIG,
  API_ENDPOINTS,
  VALIDATION_RULES,
  CATEGORIES,
  PLATFORMS,
  CONTENT_TONES,
  INDIAN_CITIES,
  PAYMENT_METHODS,
  CAMPAIGN_STATUS,
  INVOICE_STATUS,
  PAYOUT_STATUS,
  ALLOWED_FILE_TYPES,
  FILE_SIZE_LIMITS,
  NOTIFICATION_TYPES,
  SCORE_RANGES,
  DATE_FORMATS,
  CURRENCY,
  GST_RATE,
  BREAKPOINTS,
  Z_INDEX,
  ANIMATION_DURATION,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
};

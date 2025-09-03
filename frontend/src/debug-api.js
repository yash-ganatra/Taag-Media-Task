// Debug script to test API calls
import { billingAPI } from './services/api';

export const testBillingAPI = async () => {
  console.log('Testing billing API...');
  
  try {
    console.log('Making API call to fetch all billings...');
    const response = await billingAPI.getAllBillings();
    console.log('API Response:', response);
    console.log('Response data:', response.data);
    console.log('Billings:', response.data.billings);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error response:', error.response);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request:', error.request);
    }
    
    throw error;
  }
};

// Test immediately when imported
testBillingAPI().then(data => {
  console.log('Test successful:', data);
}).catch(err => {
  console.error('Test failed:', err);
});

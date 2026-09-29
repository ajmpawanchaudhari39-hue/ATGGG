const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('interrogate_auth_token') || 'demo-token';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    throw err;
  }
};

export const negotiationApi = {
  start: (jobTitle = "Software Development Engineer - I") => 
    apiRequest('/negotiation/start', {
      method: 'POST',
      body: JSON.stringify({ jobTitle })
    }),

  submitTurn: (payload) => 
    apiRequest('/negotiation/turn', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getHistory: (sessionId) => 
    apiRequest(`/negotiation/history/${sessionId}`)
};

export const stressTestApi = {
  start: (track = 'ENGINEERING') => 
    apiRequest('/stress-test/start', {
      method: 'POST',
      body: JSON.stringify({ track })
    }),

  submit: (payload) => 
    apiRequest('/stress-test/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export const resumeApi = {
  roast: (resumeText) => 
    apiRequest('/resume/roast', {
      method: 'POST',
      body: JSON.stringify({ resumeText })
    })
};

export const dashboardApi = {
  getStats: () => apiRequest('/dashboard/stats')
};

export const checkHealth = () => apiRequest('/health');

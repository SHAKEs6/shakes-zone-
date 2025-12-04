// config.js - Environment-aware backend URL
export const getBackendURL = () => {
  // Check if we're in production (Render/hosted environment)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://shakes-zone-backend.onrender.com';
  }
  // Local development
  return 'http://localhost:5000';
};

export const BACKEND_URL = getBackendURL();

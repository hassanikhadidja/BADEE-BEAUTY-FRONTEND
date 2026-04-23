import axios from 'axios';

/**
 * API origin (no trailing slash).
 * Set REACT_APP_API_BASE_URL in .env — use your public production URL.
 * Preview URLs with Vercel "Deployment Protection" block browsers until you disable protection or use Production.
 */
const rawBase =
  (typeof process !== "undefined" && process.env.REACT_APP_API_BASE_URL) ||
  "https://badee-beauty-backend-14n4.vercel.app";

export const API_BASE_URL = String(rawBase).replace(/\/+$/, "");

/** Override image host with REACT_APP_MEDIA_BASE_URL in .env if uploads are served elsewhere. */

const api = axios.create({
  baseURL: API_BASE_URL,
  // NO default Content-Type — set per-request in interceptor
});

api.interceptors.request.use((config) => {
  // Attach token
  const token = localStorage.getItem('jt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Set Content-Type only for non-FormData requests
  if (config.data instanceof FormData) {
    // DELETE the header entirely so axios auto-sets:
    // "multipart/form-data; boundary=----WebKitXYZ"
    // Any manual value here would strip the boundary and break multer
    delete config.headers['Content-Type'];
    delete config.headers['content-type'];
    if (config.headers.common) {
      delete config.headers.common['Content-Type'];
    }
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jt_token');
      localStorage.removeItem('jt_user');
    }
    return Promise.reject(err);
  }
);

export default api;

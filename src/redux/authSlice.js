import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../services/authApi';
import { normalizeUser } from '../utils/normalizeUser';
import { apiUnreachableMessage, isLikelyHtmlGatewayBody } from '../utils/apiErrors';

function authErr(err) {
  const data = err.response?.data;
  if (isLikelyHtmlGatewayBody(data)) return apiUnreachableMessage();
  if (typeof data === 'string' && data.length > 200 && data.includes('<')) return apiUnreachableMessage();
  return data?.msg || data?.message || 'Login failed. Check your credentials.';
}

// ── Thunks ──────────────────────────────────────────────────────

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // returns { token, user }  (assembled in authApi.js)
      const data = await loginUser(credentials);
      localStorage.setItem('jt_token', data.token);
      localStorage.setItem('jt_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(authErr(err));
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // returns { token, user }  (register then auto-login in authApi.js)
      const data = await registerUser(userData);
      localStorage.setItem('jt_token', data.token);
      localStorage.setItem('jt_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(authErr(err, "Inscription impossible."));
    }
  }
);

// ── Rehydrate from localStorage on page reload ───────────────────
const storedUser = (() => {
  try {
    const raw = JSON.parse(localStorage.getItem('jt_user'));
    return normalizeUser(raw);
  } catch {
    return null;
  }
})();

// ── Slice ────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    token: localStorage.getItem('jt_token') || null,
    isAuthenticated: !!localStorage.getItem('jt_token'),
    loading: false,
    error: null,
  },
  reducers: {
    /** Demo / offline login (e.g. email contains "admin" → isAdmin). */
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.user = normalizeUser(user);
      state.token = token ?? null;
      state.isAuthenticated = !!token;
      state.loading = false;
      state.error = null;
      if (token) localStorage.setItem("jt_token", token);
      else localStorage.removeItem("jt_token");
      if (user) localStorage.setItem("jt_user", JSON.stringify(normalizeUser(user)));
      else localStorage.removeItem("jt_user");
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('jt_token');
      localStorage.removeItem('jt_user');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending,   (s)    => { s.loading = true;  s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.user = normalizeUser(a.payload.user);
        s.token = a.payload.token;
        s.isAuthenticated = true;
      })
      .addCase(login.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      // Register
      .addCase(register.pending,   (s)    => { s.loading = true;  s.error = null; })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false;
        s.user = normalizeUser(a.payload.user);
        s.token = a.payload.token;
        s.isAuthenticated = true;
      })
      .addCase(register.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

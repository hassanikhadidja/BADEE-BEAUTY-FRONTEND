// src/redux/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderApi from '../services/orderApi';

function extractCreatedOrder(data) {
  if (!data || typeof data !== "object") return null;
  if (data._id || data.id) return data;
  if (data.orderId) return { _id: data.orderId };
  if (data.order && (data.order._id || data.order.id)) return data.order;
  if (data.data && (data.data._id || data.data.id)) return data.data;
  return null;
}

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await orderApi.createOrder(orderData);
      return { serverOrder: extractCreatedOrder(data), raw: data };
    } catch (e) {
      return rejectWithValue(e.response?.data?.msg || "Failed to place order");
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try { return await orderApi.getAllOrders(); }
    catch (e) { return rejectWithValue(e.response?.data?.msg || 'Failed to load orders'); }
  }
);

const getErr = (e) =>
  e.response?.data?.msg || e.response?.data?.message || e.message || 'Failed';

/** Backend may return only `{ msg }` (no order). Thunk always returns data the reducer can apply. */
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await orderApi.patchOrderStatus(id, status);
      const order =
        data?.order ||
        data?.data ||
        (data && (data._id || data.id) ? data : null);
      if (order && (order._id || order.id)) {
        return { mode: 'full', order: { ...order, _id: order._id || order.id } };
      }
      return { mode: 'patch', id, status };
    } catch (e) {
      return rejectWithValue(getErr(e));
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/delete',
  async (id, { rejectWithValue }) => {
    try {
      await orderApi.deleteOrder(id);
      return id;
    } catch (e) {
      return rejectWithValue(getErr(e));
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders:       [],
    loading:      false,
    placing:      false,
    error:        null,
    lastOrder:    null,
  },
  reducers: {
    clearLastOrder(state) { state.lastOrder = null; },
    clearError(state)     { state.error = null; },
    setLastOrder(state, action) {
      state.lastOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending,   (s) => { s.placing = true;  s.error = null; })
      .addCase(placeOrder.fulfilled, (s, a) => {
        s.placing = false;
        const so = a.payload?.serverOrder;
        s.lastOrder = so && (so._id || so.id) ? so : null;
      })
      .addCase(placeOrder.rejected,  (s, a) => { s.placing = false; s.error = a.payload; })

      .addCase(fetchAllOrders.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchAllOrders.fulfilled, (s, a) => { s.loading = false; s.orders = a.payload; })
      .addCase(fetchAllOrders.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateOrderStatus.pending, (s) => { s.error = null; })
      .addCase(updateOrderStatus.fulfilled, (s, a) => {
        const p = a.payload;
        if (p.mode === 'full' && p.order) {
          const oid = String(p.order._id);
          const idx = s.orders.findIndex(o => String(o._id) === oid);
          if (idx !== -1) s.orders[idx] = { ...s.orders[idx], ...p.order };
        } else if (p.mode === 'patch' && p.id) {
          const idx = s.orders.findIndex(o => String(o._id) === String(p.id));
          if (idx !== -1) s.orders[idx] = { ...s.orders[idx], status: p.status };
        }
      })
      .addCase(updateOrderStatus.rejected, (s, a) => { s.error = a.payload; })

      .addCase(deleteOrder.fulfilled, (s, a) => {
        const rid = String(a.payload);
        s.orders = s.orders.filter(o => String(o._id) !== rid);
      })
      .addCase(deleteOrder.rejected, (s, a) => { s.error = a.payload; });
  },
});

export const { clearLastOrder, clearError, setLastOrder } = orderSlice.actions;
export default orderSlice.reducer;
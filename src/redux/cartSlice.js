import { createSlice } from "@reduxjs/toolkit";
import { productRequiresOptionSelection } from "../utils/productVariants";

const getId = (item) => item?._id || item?.id;

/** Unique cart line: product id + selected option (empty string if none). */
export function getCartLineId(item) {
  const id = String(getId(item) ?? "");
  const opt = String(item?.selectedOption ?? "").trim();
  return `${id}::${opt}`;
}

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addToCart(state, action) {
      const p = { ...action.payload };
      const pid = getId(p);
      if (!pid) return;
      const opt = String(p.selectedOption ?? "").trim();
      p.selectedOption = opt;
      if (productRequiresOptionSelection(p) && !opt) return;

      const lineId = getCartLineId(p);
      const existing = state.items.find((i) => getCartLineId(i) === lineId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...p, _id: pid, id: pid, quantity: 1, selectedOption: opt });
      }
    },
    removeFromCart(state, action) {
      const lineId = action.payload;
      state.items = state.items.filter((i) => getCartLineId(i) !== lineId);
    },
    updateQuantity(state, action) {
      const { cartLineId, quantity } = action.payload;
      const item = state.items.find((i) => getCartLineId(i) === cartLineId);
      if (item) item.quantity = Math.max(0, quantity);
      state.items = state.items.filter((i) => i.quantity > 0);
    },
    /** UI helper: +/- 1 (used by CartDrawer). */
    updateQty(state, action) {
      const { cartLineId, delta } = action.payload;
      const item = state.items.find((i) => getCartLineId(i) === cartLineId);
      if (!item) return;
      const q = item.quantity + delta;
      if (q <= 0) {
        state.items = state.items.filter((i) => getCartLineId(i) !== cartLineId);
      } else {
        item.quantity = q;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

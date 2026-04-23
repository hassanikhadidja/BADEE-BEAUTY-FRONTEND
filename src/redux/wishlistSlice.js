import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "badee_wishlist_ids";

function readStoredIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw.map(String) : [];
  } catch {
    return [];
  }
}

function persist(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { ids: readStoredIds() },
  reducers: {
    toggleWishlist(state, action) {
      const id = String(action.payload);
      const idx = state.ids.indexOf(id);
      if (idx >= 0) state.ids.splice(idx, 1);
      else state.ids.push(id);
      persist(state.ids);
    },
    removeFromWishlist(state, action) {
      const id = String(action.payload);
      state.ids = state.ids.filter((x) => x !== id);
      persist(state.ids);
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

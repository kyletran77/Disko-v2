import { createSlice } from "@reduxjs/toolkit";

const initialState = { allFeed: [] };

const allFeedSlice = createSlice({
  name: "allFeed",
  initialState,
  reducers: {
    setAllFeed: (state, action) => {
      state.allFeed = action.payload;
    },
  },
});

export const { setAllFeed } = allFeedSlice.actions;
export default allFeedSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCircles: [],
};

const allCirclesSlice = createSlice({
  name: "allCircles",
  initialState,
  reducers: {
    setAllCircles: (state, action) => {
      state.allCircles = action.payload;
    },
  },
});

export const { setAllCircles } = allCirclesSlice.actions;
export default allCirclesSlice.reducer;

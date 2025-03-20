import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WeightsState {
  [key: string]: number;
}

const defaultState: WeightsState = {};

const weightsSlice = createSlice({
  name: "weights",
  initialState: defaultState,
  reducers: {
    markCaseCorrect: (state, action: PayloadAction<string>) => {
      if (action.payload === "") return;
      if (action.payload in state) {
        state[action.payload] *= 0.5;
      } else {
        state[action.payload] = 0.5;
      }
    },
    markCaseIncorrect: (state, action: PayloadAction<string>) => {
      if (action.payload === "") return;
      if (!(action.payload in state)) {
        state[action.payload] = 1;
      }
      state[action.payload] *= 2;
      if (state[action.payload] < 2) {
        state[action.payload] = 2;
      }
    },
  },
});

export const { markCaseCorrect, markCaseIncorrect } = weightsSlice.actions;
export default weightsSlice.reducer;

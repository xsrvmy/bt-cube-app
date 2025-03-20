import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WeightsState {
  data: {
    [key: string]: number;
  };
  previous?: {
    key: string;
    oldWeight: number;
  };
}

const defaultState: WeightsState = { data: {} };

const weightsSlice = createSlice({
  name: "weights",
  initialState: defaultState,
  reducers: {
    markCaseCorrect: (state, action: PayloadAction<string | 0>) => {
      const key = action.payload === 0 ? state.previous?.key : action.payload;
      if (!key) return;
      if (action.payload === 0) {
        // By the time the code reaches here,
        // state.previous is necessarily defined
        if (state.previous) state.data[key] = state.previous.oldWeight;
      }

      const weight = key in state.data ? state.data[key] : 1;
      state.previous = {
        key,
        oldWeight: weight,
      };

      state.data[key] = 0.5 * weight;
    },
    markCaseIncorrect: (state, action: PayloadAction<string | 0>) => {
      const key = action.payload === 0 ? state.previous?.key : action.payload;
      if (!key) return;
      if (action.payload === 0) {
        // By the time the code reaches here,
        // state.previous is necessarily defined
        if (state.previous) state.data[key] = state.previous.oldWeight;
      }

      const weight = key in state.data ? state.data[key] : 1;
      state.previous = {
        key,
        oldWeight: weight,
      };

      state.data[key] = weight * 2;
      if (state.data[key] < 2) {
        state.data[key] = 2;
      }
    },
    clearPrevious: (state) => {
      delete state.previous;
    },
    undoPrevious: (state) => {
      if (state.previous) {
        state.data[state.previous.key] = state.previous.oldWeight;
      }
    },
  },
});

export const {
  markCaseCorrect,
  markCaseIncorrect,
  clearPrevious,
  undoPrevious,
} = weightsSlice.actions;
export default weightsSlice.reducer;

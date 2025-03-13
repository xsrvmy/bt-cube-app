import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Corners } from "../utils/cube";

export interface WeightedCase {
  case_: [number, number, number, number, number, number];
  weight: number;
  index: number;
}

interface CasesState {
  corners: WeightedCase[];
}

const defaultState: CasesState = {
  corners: enumerateCycleCases(Corners.UFR, 0, 8, 3).map((x, i) => ({
    case_: x,
    weight: 1,
    index: i,
  })),
};

function enumerateCycleCases(
  buffer: number,
  bo: number,
  pieceCount: number,
  oLimit: number
): [number, number, number, number, number, number][] {
  const cases: [number, number, number, number, number, number][] = [];
  for (let i = 0; i < pieceCount; ++i) {
    if (i === buffer) continue;
    for (let j = 0; j < pieceCount; ++j) {
      if (j === i || j === buffer) continue;
      for (let o1 = 0; o1 < oLimit; ++o1) {
        for (let o2 = 0; o2 < oLimit; ++o2) {
          cases.push([buffer, bo, i, o1, j, o2]);
        }
      }
    }
  }
  return cases;
}

const casesSlice = createSlice({
  name: "cases",
  initialState: defaultState,
  reducers: {
    markCornersCaseCorrect: (state, action: PayloadAction<number>) => {
      state.corners[action.payload].weight *= 0.5;
    },
    markCornersCaseIncorrect: (state, action: PayloadAction<number>) => {
      state.corners[action.payload].weight *= 2;
      if (state.corners[action.payload].weight < 2) {
        state.corners[action.payload].weight = 2;
      }
    },
  },
});

export const { markCornersCaseCorrect, markCornersCaseIncorrect } =
  casesSlice.actions;
export default casesSlice.reducer;

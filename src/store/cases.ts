import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Corners } from "../utils/cube";

export interface WeightedCase {
  case_: [number, number, number, number, number, number];
  weight: number;
  index: number;
  name: string;
  tags: string[];
}

interface Tag {
  key: string;
  name: string;
  parent?: string;
}
interface CasesState {
  tags: {
    [key: string]: Tag;
  };
  corners: WeightedCase[];
}

const defaultState: CasesState = {
  corners: enumerateCycleCases(Corners.UFR, 0, 8, 3).map((x, i) => ({
    case_: x,
    name: `{corner-${x[2]}-${x[3]}}{corner-${x[4]}-${x[5]}}`,
    weight: 1,
    index: i,
    tags: [`corner-${x[2]}-${x[3]}`, `corner-${x[4]}-${x[5]}`],
  })),
  tags: getCycleTags(Corners.UFR, 8, 3),
};

function getCycleTags(buffer: number, pieceCount: number, oLimit: number) {
  const tags: CasesState["tags"] = {};
  for (let i = 0; i < pieceCount; ++i) {
    for (let o = 0; o < oLimit; ++o) {
      if (i !== buffer) {
        const key = `corner-${i}-${o}`;
        tags[key] = {
          key,
          name: `{corner-${i}-${o}}`,
        };
      }
    }
  }
  return tags;
}

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
      if (action.payload < 0) return;
      state.corners[action.payload].weight *= 0.5;
    },
    markCornersCaseIncorrect: (state, action: PayloadAction<number>) => {
      if (action.payload < 0) return;
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

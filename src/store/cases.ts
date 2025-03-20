import { createSlice } from "@reduxjs/toolkit";
import { Corners } from "../utils/cube";

export interface BaseCase {
  key: string;
  name: string;
  tags: string[];
}

export type UnknownCase = BaseCase & {
  case_: unknown;
  type: "unknown";
};

export type BldCase = BaseCase & {
  case_: [number, number, number, number, number, number];
  type: "bld";
};

export type CubeCase = UnknownCase | BldCase;

interface Tag {
  key: string;
  name: string;
  parent?: string;
}
interface CasesState {
  tags: {
    [key: string]: Tag;
  };
  cases: {
    [key: string]: CubeCase;
  };
}

const defaultState: CasesState = {
  cases: (() => {
    const output: CasesState["cases"] = {};
    enumerateCycleCases(Corners.UFR, 0, 8, 3).forEach((x) => {
      const key = `corner-${x[0]}-${x[1]}-${x[2]}-${x[3]}-${x[4]}-${x[5]}`;
      output[key] = {
        case_: x,
        name: `{corner-${x[2]}-${x[3]}}{corner-${x[4]}-${x[5]}}`,
        key,
        tags: [`corner-${x[2]}-${x[3]}`, `corner-${x[4]}-${x[5]}`],
        type: "bld",
      };
    });
    return output;
  })(),
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
  reducers: {},
});

export default casesSlice.reducer;

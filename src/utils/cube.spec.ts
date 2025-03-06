import { combineStates, compareStates } from "./cube";
import { expect, test } from "vitest";

const state1 = {
  co: [2, 0, 2, 0, 1, 1, 0, 0],
  cp: [6, 0, 4, 5, 1, 7, 2, 3],
  eo: [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  ep: [7, 4, 5, 6, 9, 2, 10, 1, 3, 11, 0, 8],
};

const state1_copy = {
  co: [2, 0, 2, 0, 1, 1, 0, 0],
  cp: [6, 0, 4, 5, 1, 7, 2, 3],
  eo: [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  ep: [7, 4, 5, 6, 9, 2, 10, 1, 3, 11, 0, 8],
};

const state2 = {
  co: [2, 1, 0, 0, 1, 0, 2, 0],
  cp: [4, 7, 2, 0, 3, 5, 6, 1],
  eo: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  ep: [1, 11, 5, 9, 4, 10, 2, 3, 6, 0, 8, 7],
};
const state3 = {
  co: [0, 1, 2, 2, 1, 1, 2, 0],
  cp: [1, 3, 4, 6, 5, 7, 2, 0],
  eo: [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  ep: [4, 8, 2, 11, 9, 0, 5, 6, 10, 7, 3, 1],
};

test("combineStates", () => {
  expect(combineStates(state1, state2)).toEqual(state3);
});

test("compareStates", () => {
  expect(compareStates(state1, state1_copy)).toBe(true);
})

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { applyMove, type Cube, solvedCube } from "../utils/cube";

interface CubeSliceState {
  facelets: string;
  cubeState: Cube;
  connected: boolean;
  connecting: boolean;
  battery: number;
}

const defaultCube: CubeSliceState = {
  facelets: "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB",
  cubeState: solvedCube,
  connected: false,
  connecting: false,
  battery: -1,
};

const cubeSlice = createSlice({
  name: "cube",
  initialState: defaultCube,
  reducers: {
    move: (
      state,
      action: PayloadAction<{ face: number; direction: number }>,
    ) => {
      state.cubeState = applyMove(
        state.cubeState,
        action.payload.face,
        action.payload.direction,
      );
    },
    setFacelets: (
      state,
      action: PayloadAction<{ facelets: string; cubeState: Cube }>,
    ) => {
      state.facelets = action.payload.facelets;
      state.cubeState = action.payload.cubeState;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connect: (state, _: PayloadAction<string>) => {
      state.connecting = true;
    },
    weilongV10Connect: (state, _: PayloadAction<string>) => {
      state.connecting = true;
    },
    connected: (state) => {
      state.connected = true;
      state.connecting = false;
    },
    setBattery: (state, action: PayloadAction<number>) => {
      state.battery = action.payload;
    },
    resetState: (state) => {
      state.cubeState = solvedCube;
    },
  },
});

export const {
  move,
  setFacelets,
  connect,
  connected,
  resetState,
  weilongV10Connect,
  setBattery,
} = cubeSlice.actions;
export default cubeSlice.reducer;

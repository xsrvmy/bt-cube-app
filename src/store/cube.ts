import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { applyMove, Cube, solvedCube } from "../utils/cube";

interface CubeSliceState {
  facelets: string;
  cubeState: Cube;
  connected: boolean;
  connecting: boolean;
}

const defaultCube: CubeSliceState = {
  facelets: "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB",
  cubeState: solvedCube,
  connected: false,
  connecting: false,
};

const cubeSlice = createSlice({
  name: "cube",
  initialState: defaultCube,
  reducers: {
    move: (
      state,
      action: PayloadAction<{ face: number; direction: number }>
    ) => {
      state.cubeState = applyMove(
        state.cubeState,
        action.payload.face,
        action.payload.direction
      );
    },
    setFacelets: (
      state,
      action: PayloadAction<{ facelets: string; cubeState: Cube }>
    ) => {
      state.facelets = action.payload.facelets;
      state.cubeState = action.payload.cubeState;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connect: (state, _: PayloadAction<string>) => {
      state.connecting = true;
    },
    connected: (state) => {
      state.connected = true;
      state.connecting = false;
    },
    resetState: (state) => {
      state.cubeState = solvedCube;
    },
  },
});

export const { move, setFacelets, connect, connected, resetState } =
  cubeSlice.actions;
export default cubeSlice.reducer;

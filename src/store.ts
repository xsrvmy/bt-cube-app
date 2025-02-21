import { configureStore, Middleware, Tuple } from "@reduxjs/toolkit";
import { connectGanCube, GanCubeConnection } from "gan-web-bluetooth";
import { applyMove, solvedCube } from "./cube";

const defaultCube = {
  facelets: "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB",
  cubeState: solvedCube,
  connected: false,
  connecting: false,
};

const cubeReducer = (state = defaultCube, action) => {
  if (action.type === "MOVE") {
    return {
      ...state,
      cubeState: applyMove(state.cubeState, action.face, action.direction),
    };
  }
  if (action.type === "FACELETS") {
    return { ...state, facelets: action.facelets, cubeState: action.cubeState };
  }
  if (action.type === "CONNECT") {
    return { ...state, connecting: true };
  }
  if (action.type === "CONNECTED") {
    return { ...state, connected: true, connecting: false };
  }
  if (action.type === "RESET_STATE") {
    return { ...state, cubeState: solvedCube };
  }
  return state;
};

const cubeMiddleware: Middleware = (store) => (next) => {
  let connection: GanCubeConnection | null = null;

  return (action) => {
    if (action.type === "CONNECT" && !connection) {
      console.log("Attempting to connect to gan cube");
      const conn = connectGanCube(
        () => new Promise((resolve) => resolve(action.mac))
      );
      conn.then((c) => {
        connection = c;
        connection.events$.subscribe((e) => {
          console.log(e);
          if (e.type === "FACELETS") {
            store.dispatch({
              type: "FACELETS",
              facelets: e.facelets,
              cubeState: {
                co: [...e.state.CO],
                cp: [...e.state.CP],
                eo: [...e.state.EO],
                ep: [...e.state.EP],
              },
            });
          }
          if (e.type === "MOVE") {
            store.dispatch({
              type: "MOVE",
              face: e.face,
              direction: e.direction,
            });
          }
        });
        store.dispatch({
          type: "CONNECTED",
        });
      });
    }
    if (action.type === "RESET_STATE" && connection) {
      connection.sendCubeCommand({ type: "REQUEST_RESET" });
    }

    return next(action);
  };
};

const store = configureStore({
  reducer: {
    cube: cubeReducer,
  },
  middleware: () => new Tuple(cubeMiddleware),
});
export default store;

import {
  combineReducers,
  configureStore,
  Middleware,
  Tuple,
} from "@reduxjs/toolkit";
import { connectGanCube, GanCubeConnection } from "gan-web-bluetooth";
import cubeReducer, {
  connect,
  connected,
  move,
  resetState,
  setFacelets,
} from "./cube.ts";

// const cubeReducer = (state = defaultCube, action) => {
//   if (action.type === "MOVE") {
//     return {
//       ...state,
//       cubeState: applyMove(state.cubeState, action.face, action.direction),
//     };
//   }
//   if (action.type === "FACELETS") {
//     return { ...state, facelets: action.facelets, cubeState: action.cubeState };
//   }
//   if (action.type === "CONNECT") {
//     return { ...state, connecting: true };
//   }
//   if (action.type === "CONNECTED") {
//     return { ...state, connected: true, connecting: false };
//   }
//   if (action.type === "RESET_STATE") {
//     return { ...state, cubeState: solvedCube };
//   }
//   return state;
// };

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const cubeMiddleware: Middleware<{}, RootState> = (store) => (next) => {
  let connection: GanCubeConnection | null = null;

  return (action) => {
    if (connect.match(action) && !connection) {
      console.log("Attempting to connect to gan cube");
      const conn = connectGanCube(
        () => new Promise((resolve) => resolve(action.payload))
      );
      conn.then((c) => {
        connection = c;
        connection.events$.subscribe((e) => {
          console.log(e);
          if (e.type === "FACELETS") {
            store.dispatch(
              setFacelets({
                facelets: e.facelets,
                cubeState: {
                  co: [...e.state.CO],
                  cp: [...e.state.CP],
                  eo: [...e.state.EO],
                  ep: [...e.state.EP],
                },
              })
            );
          }
          if (e.type === "MOVE") {
            store.dispatch(
              move({
                face: e.face,
                direction: e.direction,
              })
            );
          }
        });
        store.dispatch(connected());
      });
    }
    if (resetState.match(action) && connection) {
      connection.sendCubeCommand({ type: "REQUEST_RESET" });
    }

    return next(action);
  };
};

const rootReducer = combineReducers({
  cube: cubeReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: () => new Tuple(cubeMiddleware),
});
export default store;
export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];

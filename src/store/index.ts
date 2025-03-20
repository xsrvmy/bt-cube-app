import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  Middleware,
} from "@reduxjs/toolkit";
import { connectGanCube, GanCubeConnection } from "gan-web-bluetooth";
import cubeReducer, {
  connect,
  connected,
  move,
  resetState,
  setFacelets,
} from "./cube.ts";
import casesReducer from "./cases.ts";
import settingsReducer from "./settings.ts";
import weightsReducer from "./weights.ts";

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

const saveStoreMiddleware = createListenerMiddleware();
saveStoreMiddleware.startListening.withTypes<RootState>()({
  // matcher: isAnyOf(markCaseCorrect, markCaseIncorrect),
  predicate(_action, currentState, originalState) {
    return currentState.weights.data != originalState.weights.data;
  },
  effect: (_, api) => {
    console.log(api.getState().weights.data);
    localStorage.setItem(
      "weights",
      JSON.stringify(api.getState().weights.data)
    );
  },
});

const rootReducer = combineReducers({
  cube: cubeReducer,
  cases: casesReducer,
  settings: settingsReducer,
  weights: weightsReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(cubeMiddleware)
      .concat(saveStoreMiddleware.middleware),
  preloadedState: {
    weights: {
      data: JSON.parse(localStorage.getItem("weights") || "{}"),
    },
  },
});
export default store;
export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];

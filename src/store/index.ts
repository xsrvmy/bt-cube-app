import { combineReducers, configureStore } from "@reduxjs/toolkit";
import cubeReducer from "./cube.ts";
import casesReducer from "./cases.ts";
import settingsReducer from "./settings.ts";
import weightsReducer from "./weights.ts";
import weilongV10CubeMiddleware from "./middleware/weilong-cube.ts";
import ganCubeMiddleware from "./middleware/gan-cube.ts";
import saveStoreMiddleware from "./middleware/save-store.ts";

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
      .concat(ganCubeMiddleware)
      .concat(weilongV10CubeMiddleware)
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

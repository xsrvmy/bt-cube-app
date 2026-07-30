import type { Middleware } from "@reduxjs/toolkit";
import { connectGanCube, type GanCubeConnection } from "gan-web-bluetooth";
import { connect, connected, move, resetState, setFacelets } from "../cube.ts";
import type { RootState } from "../index.ts";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const ganCubeMiddleware: Middleware<{}, RootState> = (store) => (next) => {
  let connection: GanCubeConnection | null = null;

  return (action) => {
    if (connect.match(action) && !connection) {
      console.log("Attempting to connect to gan cube");
      const conn = connectGanCube(
        () => new Promise((resolve) => resolve(action.payload)),
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
              }),
            );
          }
          if (e.type === "MOVE") {
            store.dispatch(
              move({
                face: e.face,
                direction: e.direction,
              }),
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

export default ganCubeMiddleware;

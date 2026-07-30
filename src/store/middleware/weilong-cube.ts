/// <reference types="web-bluetooth" />
import { Middleware } from "@reduxjs/toolkit";
import { connected, move, weilongV10Connect } from "../cube.ts";
import { WeilongV10CubeEncrypter } from "../../utils/encrypter.ts";
import { Faces } from "../../utils/cube.ts";
import { RootState } from "../index.ts";

const weilongV10CubeMiddleware: Middleware<{}, RootState> =
  (store) => (next) => {
    return (action) => {
      if (weilongV10Connect.match(action)) {
        console.log("Attempting to connect to Weilong V10");
        (async () => {
          const mac = action.payload;
          const salt: Uint8Array = Uint8Array.fromHex(
            mac.replaceAll(":", "").trim(),
          ).reverse();
          console.log(salt.toString());
          const device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: "WCU_MY32" }],
            optionalServices: ["0783b03e-7735-b5a0-1760-a305d2795cb0"],
          });
          await device.gatt?.connect();
          const service = await device.gatt?.getPrimaryService(
            "0783b03e-7735-b5a0-1760-a305d2795cb0",
          );
          const notifyCharacteristic = await service?.getCharacteristic(
            "0783b03e-7735-b5a0-1760-a305d2795cb1",
          );
          const writeCharacteristic = await service?.getCharacteristic(
            "0783b03e-7735-b5a0-1760-a305d2795cb2",
          );

          console.log("Bluetooth connected");

          // start listening to the puzzle
          const encrypter = new WeilongV10CubeEncrypter(salt);
          const initMsg = encrypter.encrypt(
            Uint8Array.fromHex("A100000000000000000000000000000000000000"),
          );
          if (initMsg.byteLength != 20) {
            throw new Error(
              "Message has incorrect length. Not going to try to send it for safety",
            );
          }
          // @ts-expect-error incorrect typing from bluetooth upstream
          writeCharacteristic?.writeValueWithoutResponse(initMsg);

          store.dispatch(connected());

          await notifyCharacteristic?.startNotifications();
          await notifyCharacteristic?.addEventListener(
            "characteristicvaluechanged",
            (event) => {
              // @ts-expect-error event type missing
              const data: DataView = event.target!.value;
              if (data.byteLength != 20) {
                console.log("Response ignored due to incorrect length");
                return;
              }
              const bytes = encrypter.decrypt(new Uint8Array(data.buffer));

              if (bytes[0] == 0xa5) {
                // I only care about the latest move, stored in the last bit
                const moveId = bytes[12] >> 3;
                if (moveId > 11) {
                  console.log("Response ignored due to invalid move id");
                }
                console.log(move);
                // U -> 4, D -> 6, F -> 0, R -> 10, L -> 8, B -> 2
                const faceMap = [
                  Faces.F,
                  Faces.F,
                  Faces.B,
                  Faces.B,
                  Faces.U,
                  Faces.U,
                  Faces.D,
                  Faces.D,
                  Faces.L,
                  Faces.L,
                  Faces.R,
                  Faces.R,
                ];
                store.dispatch(
                  move({
                    face: faceMap[moveId],
                    direction: moveId % 2,
                  }),
                );
              }
            },
          );
        })();
      }

      return next(action);
    };
  };

export default weilongV10CubeMiddleware;

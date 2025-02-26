import { useState } from "react";
import "./App.css";
import FaceletCube from "./FaceletCube";
import { getFacelets } from "./cube";
import { useAppDispatch, useAppSelector } from "./hooks";
import { connect, resetState } from "./cube.slice";

function App() {
  const dispatch = useAppDispatch();
  const facelets = useAppSelector((state) => state.cube.facelets);
  const connecting = useAppSelector((state) => state.cube.connecting);
  const connected = useAppSelector((state) => state.cube.connected);
  const cubeState = useAppSelector((state) => state.cube.cubeState);
  const [mac, setMac] = useState("");

  return (
    <>
      {connected ? (
        <button onClick={() => dispatch(resetState())}>Reset</button>
      ) : (
        <>
          <form>
            <input
              autoComplete="current-password"
              type="password"
              value={mac}
              onChange={(e) => setMac(e.target.value)}
            />
            {mac}
            <button
              onClick={() => dispatch(connect(mac))}
              disabled={connecting}
            >
              Connect{connecting && "ing"}
            </button>
          </form>
        </>
      )}
      Facelets
      <FaceletCube facelets={facelets}></FaceletCube>
      Pieces
      <FaceletCube facelets={getFacelets(cubeState)}></FaceletCube>
      <footer>
        &copy; 2025 Rui Ming (Max) Xiong
        <br />
        <a href="https://github.com/xsrvmy/bt-cube-app">Source code</a>
        <br />
        Thanks to smartcube implementation by{" "}
        <a href="https://github.com/afedotov/gan-web-bluetooth">
          gan-web-bluetooth
        </a>
        <br />
        <a href="third-party.txt">Third party licenses</a>
      </footer>
    </>
  );
}

export default App;

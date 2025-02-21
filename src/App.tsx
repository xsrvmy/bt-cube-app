import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import FaceletCube from "./FaceletCube";
import { getFacelets } from "./cube";

function App() {
  const dispatch = useDispatch();
  const facelets = useSelector((state) => state.cube.facelets);
  const connecting = useSelector((state) => state.cube.connecting);
  const connected = useSelector((state) => state.cube.connected);
  const cubeState = useSelector((state) => state.cube.cubeState);
  const [mac, setMac] = useState("");

  return (
    <>
      {connected ? (
        <button onClick={() => dispatch({ type: "RESET_STATE" })}>Reset</button>
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
              onClick={() => dispatch({ type: "CONNECT", mac: mac })}
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

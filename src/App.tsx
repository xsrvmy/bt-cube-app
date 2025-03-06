import { useState } from "react";
import "./App.css";
import FaceletCube from "./FaceletCube";
import { getFacelets } from "./utils/cube";
import { useAppDispatch, useAppSelector } from "./hooks";
import { connect, resetState } from "./store/cube";

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
      <footer className="footer footer-center">
        <div>
          <div>&copy; 2025 Rui Ming (Max) Xiong</div>
          <a
            href="https://github.com/xsrvmy/bt-cube-app"
            className="link link-primary"
          >
            Source code
          </a>
          <div>
            Thanks to smartcube implementation by{" "}
            <a
              href="https://github.com/afedotov/gan-web-bluetooth"
              className="link link-primary"
            >
              gan-web-bluetooth
            </a>
          </div>
          <a href="third-party.txt" className="link link-primary">
            Third party licenses
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;

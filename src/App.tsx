import { useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./hooks";
import { connect, resetState } from "./store/cube";
import Debug from "./Debug";
import BldTrainer from "./BldTrainer";

function App() {
  const dispatch = useAppDispatch();
  const connecting = useAppSelector((state) => state.cube.connecting);
  const connected = useAppSelector((state) => state.cube.connected);
  const [mac, setMac] = useState("");

  return (
    <>
      <div className="flex-auto">
        <BldTrainer />
      </div>
      <div>
        <Debug />
      </div>
      <div>
        {connected ? (
          <button
            className="btn btn-primary"
            onClick={() => dispatch(resetState())}
          >
            Reset
          </button>
        ) : (
          <>
            <form>
              <input
                className="input"
                autoComplete="current-password"
                type="password"
                value={mac}
                onChange={(e) => setMac(e.target.value)}
              />
              {mac}
              <button
                className="btn btn-primary"
                onClick={() => dispatch(connect(mac))}
                disabled={connecting}
              >
                Connect{connecting && "ing"}
              </button>
            </form>
          </>
        )}
      </div>
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
          <div>
            Third party licenses{" "}
            <a href="third-party.txt" className="link link-primary">
              npm packages
            </a>{" "}
            <a href="rubik-ofl.txt" className="link link-primary">
              font
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;

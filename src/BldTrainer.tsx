import { useEffect, useState } from "react";
import { useAppSelector } from "./hooks";
import {
  combineStates,
  compareStates,
  Corners,
  Cube,
  solvedCube,
} from "./utils/cube";

const tperm = {
  co: [0, 0, 0, 0, 0, 0, 0, 0],
  cp: [3, 1, 2, 0, 4, 5, 6, 7],
  eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ep: [2, 1, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

const CORNER_LETTER_SCHEME = ["CDABVUXW", "MIEQKGSO", "JFRNPLHT"];

function generateCornerCase(): [Cube, string] {
  const buffer = Corners.UFR;
  const bo = 0;

  let corners = [0, 1, 2, 3, 4, 5, 6, 7].filter((x) => x !== buffer);
  const c1 = corners[Math.floor(Math.random() * corners.length)];
  corners = corners.filter((x) => x !== c1);
  const c2 = corners[Math.floor(Math.random() * corners.length)];
  const co1 = Math.floor(Math.random() * 3);
  const co2 = Math.floor(Math.random() * 3);
  const co = [0, 0, 0, 0, 0, 0, 0, 0];
  const cp = [0, 1, 2, 3, 4, 5, 6, 7];

  co[c1] = (bo + bo + co1) % 3;
  co[c2] = (co1 + co1 + co2) % 3;
  co[buffer] = (co2 + co2 + bo) % 3; // ?

  cp[c1] = buffer;
  cp[buffer] = c2;
  cp[c2] = c1;
  return [
    {
      co,
      cp,
      eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    },
    CORNER_LETTER_SCHEME[co1][c1] + CORNER_LETTER_SCHEME[co2][c2],
  ];
}

export default function BldTrainer() {
  const cubeState = useAppSelector((state) => state.cube.cubeState);
  const [startState, setStartState] = useState(cubeState);
  const [targetState, setTargetState] = useState(solvedCube);
  const [lock, setLock] = useState(false);
  const [caseName, setCaseName] = useState("loading");
  const correct = compareStates(
    combineStates(startState, targetState),
    cubeState
  );

  useEffect(() => {
    if (correct && !lock) {
      console.log("locking");
      setLock(true);
      setTimeout(() => {
        const [state, name] = generateCornerCase();
        setLock(false);
        setTargetState(state);
        setCaseName(name);
        setStartState(cubeState);
        // TODO there is a bug here where the latest cube state is not read
        // TODO need to clean up this timeout somehow
        // this should be fixed when I switch to redux and the cube state
        // sync becomes a
      }, 1000);
    }
  }, [correct, lock, cubeState]);

  return (
    <div className="flex flex-col text-center h-80">
      <div className="flex-auto" />
      <div className="text-6xl font-mono">
        {lock ? "Locked" : correct ? "Solved" : caseName}
      </div>
      <div className="flex-auto" />
      <button
        className="btn btn-primary"
        disabled={lock}
        onClick={() => {
          const [state, name] = generateCornerCase();
          setTargetState(state);
          setCaseName(name);
          setStartState(cubeState);
        }}
      >
        Reset
      </button>
    </div>
  );
}

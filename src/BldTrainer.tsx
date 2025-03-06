import { useState } from "react";
import { useAppSelector } from "./hooks";
import { combineStates, compareStates } from "./utils/cube";

const tperm = {
  co: [0, 0, 0, 0, 0, 0, 0, 0],
  cp: [3, 1, 2, 0, 4, 5, 6, 7],
  eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ep: [2, 1, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

export default function BldTrainer() {
  const cubeState = useAppSelector((state) => state.cube.cubeState);
  const [startState, setStartState] = useState(cubeState);
  const [targetState, setTargetState] = useState(tperm);
  const correct = compareStates(
    combineStates(startState, targetState),
    cubeState
  );

  return <div>
    {correct ? "Solved" : "Unsolved"}
    <button onClick={() => setStartState(cubeState)}>Reset</button>
  </div>
}

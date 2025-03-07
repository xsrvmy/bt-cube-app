import { useEffect, useState } from "react";
import { useAppSelector } from "./hooks";
import {
  combineStates,
  compareStates,
  Corners,
  Cube,
  solvedCube,
} from "./utils/cube";

const CORNER_LETTER_SCHEME = ["CDABVUXW", "MIEQKGSO", "JFRNPLHT"];

function enumerateCycleCases(
  buffer: number,
  bo: number,
  pieceCount: number,
  oLimit: number
): [number, number, number, number, number, number][] {
  const cases: [number, number, number, number, number, number][] = [];
  for (let i = 0; i < pieceCount; ++i) {
    if (i === buffer) continue;
    for (let j = 0; j < pieceCount; ++j) {
      if (j === i || j === buffer) continue;
      for (let o1 = 0; o1 < oLimit; ++o1) {
        for (let o2 = 0; o2 < oLimit; ++o2) {
          cases.push([buffer, bo, i, o1, j, o2]);
        }
      }
    }
  }
  return cases;
}

function generateCornerCase(
  caseList: [number, number, number, number, number, number][]
): [Cube, string] {
  const [buffer, bo, c1, co1, c2, co2] =
    caseList[Math.floor(Math.random() * caseList.length)];

  // let corners = [0, 1, 2, 3, 4, 5, 6, 7].filter((x) => x !== buffer);
  // const c1 = corners[Math.floor(Math.random() * corners.length)];
  // corners = corners.filter((x) => x !== c1);
  // const c2 = corners[Math.floor(Math.random() * corners.length)];
  // const co1 = Math.floor(Math.random() * 3);
  // const co2 = Math.floor(Math.random() * 3);
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

const cornerCases = enumerateCycleCases(Corners.UFR, 0, 8, 3);

function filterCases(filter: [number, number][]): typeof cornerCases {
  if (filter.length === 0) {
    return cornerCases;
  }
  return cornerCases.filter(([, , c1, co1, c2, co2]) => {
    return filter.some(
      ([c, o]) => (c1 === c && co1 === o) || (c2 === c && co2 === o)
    );
  });
}

export default function BldTrainer() {
  const cubeState = useAppSelector((state) => state.cube.cubeState);
  const [startState, setStartState] = useState(cubeState);
  const [targetState, setTargetState] = useState(solvedCube);
  const [lock, setLock] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [caseName, setCaseName] = useState("loading");
  const [caseFilter, setCaseFilter] = useState<[number, number][]>([[1, 0]]);
  const correct = compareStates(
    combineStates(startState, targetState),
    cubeState
  );

  useEffect(() => {
    if ((correct && !lock) || wrong) {
      console.log("locking");
      setLock(true);
      setWrong(false);
      setTimeout(() => {
        const [state, name] = generateCornerCase(filterCases(caseFilter));
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
  }, [correct, lock, wrong, caseFilter, cubeState]);

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
          setWrong(true);
        }}
      >
        Reset
      </button>
    </div>
  );
}

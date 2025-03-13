import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  combineStates,
  compareStates,
  Corners,
  Cube,
  solvedCube,
} from "./utils/cube";
import CaseFilter from "./CaseFilter";
import {
  markCornersCaseCorrect,
  markCornersCaseIncorrect,
  WeightedCase,
} from "./store/cases";

const CORNER_LETTER_SCHEME = ["CDABVUXW", "MIEQKGSO", "JFRNPLHT"];

function selectCase(cases: WeightedCase[]): WeightedCase {
  const sum = cases.map((x) => x.weight).reduce((x, y) => x + y, 0);
  let rand = Math.random() * sum;

  for (const c of cases) {
    rand -= c.weight;
    if (rand <= 0) {
      return c;
    }
  }
  return cases[cases.length - 1];
}

function generateCornerCase(case_: WeightedCase): [Cube, string] {
  const [buffer, bo, c1, co1, c2, co2] = case_.case_;

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

function filterCases(
  cases: WeightedCase[],
  filter: [number, number][]
): typeof cases {
  if (filter.length === 0) {
    return cases;
  }
  return cases.filter(({ case_: [, , c1, co1, c2, co2] }) => {
    return filter.some(
      ([c, o]) => (c1 === c && co1 === o) || (c2 === c && co2 === o)
    );
  });
}

export default function BldTrainer() {
  const dispatch = useAppDispatch();
  const buffer = Corners.UFR;
  const bo = 0;
  const corners = true;
  const cubeState = useAppSelector((state) => state.cube.cubeState);
  const cases = useAppSelector((state) => state.cases);
  const [currentCase, setCurrentCase] = useState<WeightedCase>({
    case_: [0, 0, 1, 0, 2, 0],
    index: -1,
    weight: 0,
  });
  const [startState, setStartState] = useState(cubeState);
  // const [targetState, setTargetState] = useState(solvedCube);
  const [targetState, caseName] = generateCornerCase(currentCase);
  const [lock, setLock] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [reset, setReset] = useState(false);
  // const [caseName, setCaseName] = useState("loading");
  const [caseFilter, setCaseFilter] = useState<[number, number][]>([]);
  const correct = compareStates(
    combineStates(startState, targetState),
    cubeState
  );

  useEffect(() => {
    if ((correct && !lock) || wrong || reset) {
      console.log("locking");
      setLock(true);
      setWrong(false);
      setReset(false);
      if (correct) {
        dispatch(markCornersCaseCorrect(currentCase.index));
      } else if (wrong) {
        dispatch(markCornersCaseIncorrect(currentCase.index));
      }

      setTimeout(() => {
        const _case = selectCase(filterCases(cases.corners, caseFilter));
        // const [state, name] = generateCornerCase(
        //   _case
        // );
        setLock(false);
        setCurrentCase(_case);
        // setTargetState(state);
        // setCaseName(name);
        setStartState(cubeState);
        // TODO there is a bug here where the latest cube state is not read
        // TODO need to clean up this timeout somehow
        // this should be fixed when I switch to redux and the cube state
        // sync becomes a
      }, 200);
    }
  }, [
    correct,
    lock,
    wrong,
    caseFilter,
    cubeState,
    cases,
    reset,
    currentCase,
    dispatch,
  ]);

  const casesList: [string, boolean][] = [];

  if (corners) {
    for (let i = 0; i < 8; ++i) {
      if (i !== buffer) {
        for (let o = 0; o < 3; ++o) {
          casesList.push([
            CORNER_LETTER_SCHEME[o][i],
            caseFilter.some((x) => x[0] === i && x[1] === o),
          ]);
        }
      }
    }
  } else {
    throw new Error();
  }

  return (
    <div className="flex flex-col text-center h-96">
      <div className="flex-auto" />
      <div className="text-6xl font-mono">
        {lock ? "Locked" : correct ? "Solved" : caseName}
      </div>
      <div className="flex-auto">
        Wrong: {wrong ? "Y" : "N"}
        <br />
        Reset: {reset ? "Y" : "N"}
        <br />
        Right: {correct ? "Y" : "N"}
      </div>
      <div className="flex flex-row gap-4 p-4">
        <button
          className="btn btn-primary flex-auto"
          disabled={lock}
          onClick={() => {
            setReset(true);
          }}
        >
          Reset
        </button>

        <button
          className="btn btn-error flex-auto"
          disabled={lock}
          onClick={() => {
            setWrong(true);
          }}
        >
          Wrong
        </button>
      </div>
      <CaseFilter
        cases={casesList}
        onChange={(v) => {
          const filter: typeof caseFilter = [];
          for (const [c, t] of v) {
            if (t) {
              for (let co = 0; co < CORNER_LETTER_SCHEME.length; ++co) {
                const idx = CORNER_LETTER_SCHEME[co].indexOf(c);
                if (idx >= 0) {
                  filter.push([idx, co]);
                  break;
                }
              }
            }
          }
          setCaseFilter(filter);
        }}
      />
    </div>
  );
}

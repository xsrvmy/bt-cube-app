import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { combineStates, compareStates, Corners, Cube } from "./utils/cube";
import CaseFilter from "./CaseFilter";
import {
  markCornersCaseCorrect,
  markCornersCaseIncorrect,
  WeightedCase,
} from "./store/cases";
import { replaced } from "./utils/replace";

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

function generateCornerCase(case_: WeightedCase): Cube {
  const [buffer, bo, c1, co1, c2, co2] = case_.case_;

  const co = [0, 0, 0, 0, 0, 0, 0, 0];
  const cp = [0, 1, 2, 3, 4, 5, 6, 7];

  co[c1] = (bo + bo + co1) % 3;
  co[c2] = (co1 + co1 + co2) % 3;
  co[buffer] = (co2 + co2 + bo) % 3; // ?

  cp[c1] = buffer;
  cp[buffer] = c2;
  cp[c2] = c1;
  return {
    co,
    cp,
    eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  };
}

function filterCases(cases: WeightedCase[], filter: string[]): typeof cases {
  if (filter.length === 0) {
    return cases;
  }
  return cases.filter((c) => filter.some((f) => c.tags.indexOf(f) >= 0));
}

export default function BldTrainer() {
  const dispatch = useAppDispatch();
  const buffer = Corners.UFR;
  const bo = 0;
  const corners = true;
  const cubeState = useAppSelector((state) => state.cube.cubeState);
  const cases = useAppSelector((state) => state.cases);
  const filterList = useAppSelector((state) => Object.keys(state.cases.tags));
  const [currentCase, setCurrentCase] = useState<WeightedCase>({
    case_: [0, 0, 1, 0, 2, 0],
    name: "--",
    index: -1,
    weight: 0,
    tags: [],
  });
  const [startState, setStartState] = useState(cubeState);
  const targetState = generateCornerCase(currentCase);
  const caseName = replaced(currentCase.name);
  const [lock, setLock] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [reset, setReset] = useState(false);
  const [caseFilter, setCaseFilter] = useState<string[]>([]);
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
        setLock(false);
        setCurrentCase(_case);
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

  return (
    <div className="flex flex-col text-center h-96">
      <div className="flex-auto" />
      <div className="text-6xl font-mono">
        {lock ? "Locked" : correct ? "Solved" : caseName}
      </div>
      <div className="flex-auto">{caseFilter}</div>
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
        filters={filterList.map((x) => [x, caseFilter.indexOf(x) >= 0])}
        onChange={(v) => {
          setCaseFilter(v.filter((x) => x[1]).map((x) => x[0]));
        }}
      />
    </div>
  );
}

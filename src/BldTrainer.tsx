import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { combineStates, compareStates, Cube } from "./utils/cube";
import CaseFilter from "./CaseFilter";
import {
  clearPrevious,
  markCaseCorrect,
  markCaseIncorrect,
  undoPrevious,
} from "./store/weights";
import { replaced } from "./utils/replace";
import Settings from "./Settings";
import { BaseCase, BldCase } from "./store/cases";

function selectCase<P extends BaseCase>(
  cases: P[],
  weights: { [key: string]: number }
): P {
  const sum = cases.map((x) => weights[x.key] || 1).reduce((x, y) => x + y, 0);
  let rand = Math.random() * sum;

  for (const c of cases) {
    rand -= weights[c.key] || 1;
    if (rand <= 0) {
      return c;
    }
  }
  return cases[cases.length - 1];
}

function generateCornerCase(case_: BldCase): Cube {
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

function filterCases<P extends BaseCase>(cases: P[], filter: string[]): P[] {
  if (filter.length === 0) {
    return cases;
  }
  return cases.filter((c) => filter.some((f) => c.tags.indexOf(f) >= 0));
}

export default function BldTrainer() {
  const dispatch = useAppDispatch();

  const corners = true;
  const cubeState = useAppSelector((state) => state.cube.cubeState);
  const cases = useAppSelector((state) => state.cases);
  const tags = useAppSelector((state) => state.cases.tags);
  const weights = useAppSelector((state) => state.weights.data);
  const hasPrevious = useAppSelector((state) => !!state.weights.previous);
  const filterList = Object.keys(tags);
  const cornerScheme = useAppSelector((state) => state.settings.cornerScheme);
  const [currentCase, setCurrentCase] = useState<BldCase>({
    case_: [0, 0, 1, 0, 2, 0],
    name: "--",
    key: "",
    tags: [],
    type: "bld",
  });
  const [startState, setStartState] = useState(cubeState);
  const targetState = generateCornerCase(currentCase);
  const caseName = replaced(currentCase.name, cornerScheme);

  const [lock, setLock] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [reset, setReset] = useState(false);
  const [forceCorrect, setForceCorrect] = useState(false);

  const [caseFilter, setCaseFilter] = useState<string[]>([]);
  const correct = compareStates(
    combineStates(startState, targetState),
    cubeState
  );

  useEffect(() => {
    if ((correct && !lock) || forceCorrect || wrong || reset) {
      console.log("locking");
      setLock(true);
      setWrong(false);
      setReset(false);
      setForceCorrect(false);
      if (correct || forceCorrect) {
        dispatch(markCaseCorrect(currentCase.key));
      } else if (wrong) {
        dispatch(markCaseIncorrect(currentCase.key));
      }

      setTimeout(() => {
        const _case = selectCase(
          filterCases(
            Object.values(cases.cases)
              .filter((x) => x.type === "bld")
              .filter((x) => x.key.startsWith("corner")),
            caseFilter
          ),
          weights
        );
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
    forceCorrect,
    caseFilter,
    cubeState,
    cases,
    reset,
    currentCase,
    dispatch,
    weights,
  ]);

  return (
    <div className="flex flex-col text-center h-160">
      <div className="flex-1 flex flex-col">
        <div className="flex-auto"></div>
        <div>{corners ? "Corners" : "Edges"}</div>
      </div>
      <div className="text-6xl font-mono">
        {lock ? "Locked" : correct ? "Solved" : caseName}
      </div>
      <div className="flex-1"></div>
      <div className="flex flex-row gap-4 p-4">
        <button
          className="btn btn-primary flex-1"
          disabled={lock}
          onClick={() => {
            dispatch(clearPrevious());
            setReset(true);
          }}
        >
          Reset
        </button>

        <button
          className="btn btn-error flex-1"
          disabled={lock}
          onClick={() => {
            setWrong(true);
          }}
        >
          Wrong
        </button>

        <button
          className="btn btn-success flex-1"
          disabled={lock}
          onClick={() => {
            setForceCorrect(true);
          }}
        >
          Force Correct
        </button>
      </div>
      <div className="flex flex-row gap-4 p-4 pt-0">
        <button
          className="btn btn-primary flex-1"
          disabled={lock || !hasPrevious}
          onClick={() => {
            dispatch(undoPrevious());
            // setReset(true);
          }}
        >
          P Reset
        </button>

        <button
          className="btn btn-error flex-1"
          disabled={lock || !hasPrevious}
          onClick={() => {
            dispatch(markCaseIncorrect(0));
            // setReset(true);
          }}
        >
          P Wrong
        </button>

        <button
          className="btn btn-success flex-1"
          disabled={lock || !hasPrevious}
          onClick={() => {
            dispatch(markCaseCorrect(0));
            // setReset(true);
          }}
        >
          P Correct
        </button>
      </div>
      <CaseFilter
        filters={filterList.map((x) => [x, caseFilter.indexOf(x) >= 0])}
        onChange={(v) => {
          setCaseFilter(v.filter((x) => x[1]).map((x) => x[0]));
        }}
      />
      <Settings />
    </div>
  );
}

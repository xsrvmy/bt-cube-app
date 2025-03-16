import { useRef } from "react";
import { useAppSelector } from "./hooks";
import { replaced } from "./utils/replace";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";

interface P {
  filters: [string, boolean][];
  className?: string;
  onChange: (newValue: [string, boolean][]) => void;
}

export default function CaseFilter({ filters, className, onChange }: P) {
  const dialog = useRef<HTMLDialogElement>(null);
  const tags = useAppSelector((state) => state.cases.tags);
  const cornerScheme = useAppSelector((state) => state.settings.cornerScheme);

  return (
    <>
      <button
        className={`btn btn-primary ${className || ""}`}
        onClick={() => dialog.current?.showModal()}
      >
        Filter
      </button>
      <dialog className="modal" ref={dialog}>
        <div className="modal-box">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Filter</legend>
            {filters.map((c, i) => (
              <div className="join">
                <button
                  className={`btn btn-xs join-item ${
                    c[1] ? "btn-success" : ""
                  }`}
                  onClick={() => {
                    const newCases = [...filters];
                    newCases[i] = [newCases[i][0], !c[1]];
                    onChange(newCases);
                  }}
                >
                  <PlusIcon className="size-4" />
                </button>
                <span className="btn btn-xs join-item flex-auto">
                  {replaced(tags[c[0]].name, cornerScheme)}
                </span>
                <button className="btn btn-xs join-item">
                  <MinusIcon className="size-4" />
                </button>
              </div>
            ))}
          </fieldset>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
}

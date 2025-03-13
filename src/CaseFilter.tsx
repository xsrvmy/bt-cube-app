import { useRef } from "react";

interface P {
  cases: [string, boolean][];
  className?: string;
  onChange: (newValue: [string, boolean][]) => void;
}

export default function CaseFilter({ cases, className, onChange }: P) {
  const dialog = useRef<HTMLDialogElement>(null);
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
            {cases.map((c, i) => (
              <div className="join">
                <button
                  className={`btn btn-xs join-item ${
                    c[1] ? "btn-success" : ""
                  }`}
                  onClick={() => {
                    const newCases = [...cases];
                    newCases[i] = [newCases[i][0], !c[1]];
                    onChange(newCases);
                  }}
                >
                  +
                </button>
                <button className="btn btn-xs join-item flex-auto">
                  {c[0]}
                </button>
                <button className="btn btn-xs join-item">-</button>
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

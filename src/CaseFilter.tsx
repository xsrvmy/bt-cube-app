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
              <div>
                <label className="fieldset-label">
                  <input
                    type="checkbox"
                    key={i}
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={c[1]}
                    onChange={(e) => {
                      const newCases = [...cases];
                      newCases[i] = [newCases[i][0], e.target.checked];
                      onChange(newCases);
                    }}
                  />
                  {c[0]}
                </label>
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

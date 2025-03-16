import { useRef } from "react";
import { useAppDispatch } from "./hooks";
import { setCornersSchemeFromSpeffz } from "./store/settings";

interface P {
  className?: string;
}

export default function LetterSchemeEditor({ className }: P) {
  const dialog = useRef<HTMLDialogElement>(null);
  const dispatch = useAppDispatch();

  function changeCorners() {
    const scheme =
      prompt("Enter your letter scheme, following the speffz order:");
    if (!scheme) return;
    if (scheme.length !== 24) {
      alert("Invalid length");
      return;
    }
    dispatch(setCornersSchemeFromSpeffz(scheme));
  }

  return (
    <>
      <button
        className={`btn btn-primary ${className || ""}`}
        onClick={() => dialog.current?.showModal()}
      >
        Settings
      </button>
      <dialog className="modal" ref={dialog}>
        <div className="modal-box">
          <button className="btn btn-primary" onClick={changeCorners}>
            Change Corners
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
}

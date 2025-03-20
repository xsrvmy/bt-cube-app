import { useRef } from "react";
import FaceletCube from "./FaceletCube";
import { useAppSelector } from "./hooks";
import { dumpState, getFacelets } from "./utils/cube";

export default function Debug() {
  const facelets = useAppSelector((state) => state.cube.facelets);
  const cubeState = useAppSelector((state) => state.cube.cubeState);
  const dialog = useRef<HTMLDialogElement>(null);



  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={() => dialog.current?.showModal()}
      >
        Debug
      </button>
      <dialog className="modal" ref={dialog}>
        <div className="modal-box">
          Facelets
          <FaceletCube facelets={facelets} className="w-72"></FaceletCube>
          Pieces
          <FaceletCube
            facelets={getFacelets(cubeState)}
            className="w-72"
          ></FaceletCube>
          <textarea
            value={dumpState(cubeState)}
            className="textarea h-48 w-72"
            onFocus={(e) => e.target.select()}
            readOnly
          ></textarea>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
}

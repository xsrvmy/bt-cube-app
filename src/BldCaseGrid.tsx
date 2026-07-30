import { useRef } from "react";
import { useAppSelector } from "./hooks";
import { replaced } from "./utils/replace";

interface P {
  className?: string;
}

export default function BldCaseGrid({ className }: P) {
  const dialog = useRef<HTMLDialogElement>(null);

  const weights = useAppSelector((state) => state.weights.data);
  const cornerScheme = useAppSelector((state) => state.settings.cornerScheme);

  const corners: [number, number][] = [1, 2, 3, 4, 5, 6, 7].flatMap((x) => [
    [x, 0],
    [x, 1],
    [x, 2],
  ]);
  const getCornerName = (c: [number, number]) =>
    replaced(`{corner-${c[0]}-${c[1]}}`, cornerScheme);
  corners.sort(
    (c1, c2) =>
      getCornerName(c1).charCodeAt(0) - getCornerName(c2).charCodeAt(0),
  );

  const getWeight = ([a, b]: [number, number], [c, d]: [number, number]) => {
    if (a == c) return 0;
    return weights[`corner-0-0-${a}-${b}-${c}-${d}`] || 1;
  };
  const getBgClass = (c1: [number, number], c2: [number, number]) => {
    const w = getWeight(c1, c2);
    if (w <= 0) return "bg-gray-500";
    const n = Math.round(Math.log2(w));
    if (n == 0) return "bg-yellow-300";
    if (n > 0) return "bg-red-300";
    if (n == -1) return "bg-green-300";
    if (n < -1) return "bg-blue-300";
  };

  return (
    <>
      <button
        className={`btn btn-primary ${className || ""}`}
        onClick={() => dialog.current?.showModal()}
      >
        View Cases
      </button>
      <dialog className="modal" ref={dialog}>
        <div className="modal-box flex flex-col gap-4 font-mono">
          <table>
            <tbody>
              <tr>
                <th></th>
                {corners.map((c) => (
                  <th key={c.toString()}>{getCornerName(c)}</th>
                ))}
              </tr>
              {corners.map((c1) => (
                <tr key={c1.toString()}>
                  <th>{getCornerName(c1)}</th>
                  {corners.map((c2) => (
                    <td
                      key={c2.toString()}
                      className={getBgClass(c1, c2)}
                      title={`${getCornerName(c1)}${getCornerName(c2)}: ${getWeight(c1, c2)}`}
                    ></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
}

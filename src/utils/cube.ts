enum Edges {
  UR,
  UF,
  UL,
  UB,
  DR,
  DF,
  DL,
  DB,
  FR,
  FL,
  BL,
  BR,
}
const ES = ["UUUUDDDDFFBB", "RFLBRFLBRLLR", "UUUUDDDDFFBB", "RFLBRFLBRLLR"];

enum Corners {
  UFR,
  UFL,
  UBL,
  UBR,
  DFR,
  DFL,
  DBL,
  DBR,
}

const CS = [
  "UUUUDDDD",
  "FLBRRFLB",
  "RFLBFLBR",
  "UUUUDDDD",
  "FLBRRFLB",
  "RFLBFLBR",
];

enum Faces {
  U,
  R,
  F,
  D,
  L,
  B,
}

export interface Cube {
  co: number[];
  cp: number[];
  eo: number[];
  ep: number[];
}

export const solvedCube: Cube = {
  co: [0, 0, 0, 0, 0, 0, 0, 0],
  cp: [0, 1, 2, 3, 4, 5, 6, 7],
  eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

function cycle(arr: unknown[], i1: number, i2: number, i3: number, i4: number) {
  const t = arr[i1];
  arr[i1] = arr[i4];
  arr[i4] = arr[i3];
  arr[i3] = arr[i2];
  arr[i2] = t;
}

function fixCo(arr: number[], i1: number, i2: number, i3: number, i4: number) {
  arr[i1] = (arr[i1] + 1) % 3;
  arr[i2] = (arr[i2] + 2) % 3;
  arr[i3] = (arr[i3] + 1) % 3;
  arr[i4] = (arr[i4] + 2) % 3;
}

function fixEo(arr: number[], i1: number, i2: number, i3: number, i4: number) {
  arr[i1] = 1 - arr[i1];
  arr[i2] = 1 - arr[i2];
  arr[i3] = 1 - arr[i3];
  arr[i4] = 1 - arr[i4];
}

export function applyMove(cube: Cube, face: number, direction: number) {
  if (direction === 2) {
    return applyMove(applyMove(cube, face, 0), face, 0);
  }
  if (direction === 1) {
    return applyMove(applyMove(cube, face, 2), face, 0);
  }
  if (direction !== 0) {
    throw new Error();
  }

  const newCube: Cube = {
    co: [...cube.co],
    eo: [...cube.eo],
    cp: [...cube.cp],
    ep: [...cube.ep],
  };
  if (face === Faces.U) {
    cycle(newCube.co, Corners.UFR, Corners.UFL, Corners.UBL, Corners.UBR);
    cycle(newCube.cp, Corners.UFR, Corners.UFL, Corners.UBL, Corners.UBR);
    cycle(newCube.eo, Edges.UR, Edges.UF, Edges.UL, Edges.UB);
    cycle(newCube.ep, Edges.UR, Edges.UF, Edges.UL, Edges.UB);
  }
  if (face === Faces.D) {
    cycle(newCube.co, Corners.DFR, Corners.DBR, Corners.DBL, Corners.DFL);
    cycle(newCube.cp, Corners.DFR, Corners.DBR, Corners.DBL, Corners.DFL);
    cycle(newCube.eo, Edges.DR, Edges.DB, Edges.DL, Edges.DF);
    cycle(newCube.ep, Edges.DR, Edges.DB, Edges.DL, Edges.DF);
  }
  if (face === Faces.R) {
    fixCo(newCube.co, Corners.UFR, Corners.UBR, Corners.DBR, Corners.DFR);
    cycle(newCube.co, Corners.UFR, Corners.UBR, Corners.DBR, Corners.DFR);
    cycle(newCube.cp, Corners.UFR, Corners.UBR, Corners.DBR, Corners.DFR);
    cycle(newCube.eo, Edges.UR, Edges.BR, Edges.DR, Edges.FR);
    cycle(newCube.ep, Edges.UR, Edges.BR, Edges.DR, Edges.FR);
  }
  if (face === Faces.L) {
    fixCo(newCube.co, Corners.UBL, Corners.UFL, Corners.DFL, Corners.DBL);
    cycle(newCube.co, Corners.UBL, Corners.UFL, Corners.DFL, Corners.DBL);
    cycle(newCube.cp, Corners.UBL, Corners.UFL, Corners.DFL, Corners.DBL);
    cycle(newCube.eo, Edges.UL, Edges.FL, Edges.DL, Edges.BL);
    cycle(newCube.ep, Edges.UL, Edges.FL, Edges.DL, Edges.BL);
  }
  if (face === Faces.F) {
    fixCo(newCube.co, Corners.UFL, Corners.UFR, Corners.DFR, Corners.DFL);
    cycle(newCube.co, Corners.UFL, Corners.UFR, Corners.DFR, Corners.DFL);
    cycle(newCube.cp, Corners.UFL, Corners.UFR, Corners.DFR, Corners.DFL);
    fixEo(newCube.eo, Edges.FL, Edges.UF, Edges.FR, Edges.DF);
    cycle(newCube.eo, Edges.FL, Edges.UF, Edges.FR, Edges.DF);
    cycle(newCube.ep, Edges.FL, Edges.UF, Edges.FR, Edges.DF);
  }
  if (face === Faces.B) {
    fixCo(newCube.co, Corners.UBR, Corners.UBL, Corners.DBL, Corners.DBR);
    cycle(newCube.co, Corners.UBR, Corners.UBL, Corners.DBL, Corners.DBR);
    cycle(newCube.cp, Corners.UBR, Corners.UBL, Corners.DBL, Corners.DBR);
    fixEo(newCube.eo, Edges.BR, Edges.UB, Edges.BL, Edges.DB);
    cycle(newCube.eo, Edges.BR, Edges.UB, Edges.BL, Edges.DB);
    cycle(newCube.ep, Edges.BR, Edges.UB, Edges.BL, Edges.DB);
  }
  return newCube;
}

export function getFacelets(cube: Cube): string {
  const { co, cp, eo, ep } = cube;
  const cs = (c: Corners, o = 0) => CS[co[c] + o][cp[c]];
  const es = (e: Edges, o = 0) => ES[eo[e] + o][ep[e]];
  return (
    (
      (cs(Corners.UBL) + es(Edges.UB) + cs(Corners.UBR)) +
      (es(Edges.UL) + "U" + es(Edges.UR)) +
      (cs(Corners.UFL) + es(Edges.UF) + cs(Corners.UFR))
    ) + (
      (cs(Corners.UFR, 2) + es(Edges.UR, 1) + cs(Corners.UBR, 1)) +
      (es(Edges.FR, 1) + "R" + es(Edges.BR, 1)) +
      (cs(Corners.DFR, 1) + es(Edges.DR, 1) + cs(Corners.DBR, 2))
    ) + (
      (cs(Corners.UFL, 2) + es(Edges.UF, 1) + cs(Corners.UFR, 1)) +
      (es(Edges.FL) + "F" + es(Edges.FR)) +
      (cs(Corners.DFL, 1) + es(Edges.DF, 1) + cs(Corners.DFR, 2))
    ) + (
      (cs(Corners.DFL) + es(Edges.DF) + cs(Corners.DFR)) +
      (es(Edges.DL) + "D" + es(Edges.DR)) +
      (cs(Corners.DBL) + es(Edges.DB) + cs(Corners.DBR))
    ) + (
      (cs(Corners.UBL, 2) + es(Edges.UL, 1) + cs(Corners.UFL, 1)) +
      (es(Edges.BL, 1) + "L" + es(Edges.FL, 1)) +
      (cs(Corners.DBL, 1) + es(Edges.DL, 1) + cs(Corners.DFL, 2))
    ) + (
      (cs(Corners.UBR, 2) + es(Edges.UB, 1) + cs(Corners.UBL, 1)) +
      (es(Edges.BR) + "B" + es(Edges.BL)) +
      (cs(Corners.DBR, 1) + es(Edges.DB, 1) + cs(Corners.DBL, 2))
    )
  ); // prettier-ignore
}

export function dumpState({ co, cp, eo, ep }: Cube) {
  return `{
  co: [${co}],
  cp: [${cp}],
  eo: [${eo}],
  ep: [${ep}],
}`;
}

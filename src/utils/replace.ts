const CORNER_LETTER_SCHEME = ["CDABVUXW", "MIEQKGSO", "JFRNPLHT"];

function generateReplacements() {
  const output: { [key: string]: string } = {};
  for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 3; ++j) {
      output[`corner-${i}-${j}`] = CORNER_LETTER_SCHEME[j][i];
    }
  }
  return output;
}

const replacements = generateReplacements();

export function replaced(str: string): string {
  let s = str;
  for (const k in replacements) {
    s = s.replace(`{${k}}`, replacements[k]);
  }
  return s;
}

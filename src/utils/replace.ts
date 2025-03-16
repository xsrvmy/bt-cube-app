// const CORNER_LETTER_SCHEME = ["CDABVUXW", "MIEQKGSO", "JFRNPLHT"];

function generateReplacements(cornerScheme: [string, string, string]) {
  const output: { [key: string]: string } = {};
  for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 3; ++j) {
      output[`corner-${i}-${j}`] = cornerScheme[j][i];
    }
  }
  return output;
}


export function replaced(str: string, cornerScheme: [string, string, string]): string {
  const replacements = generateReplacements(cornerScheme);
  let s = str;
  for (const k in replacements) {
    s = s.replace(`{${k}}`, replacements[k]);
  }
  return s;
}

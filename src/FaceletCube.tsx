const colorMap = {
  U: "white",
  F: "green",
  R: "red",
  B: "blue",
  L: "orange",
  D: "yellow",
} as { [key: string]: string };

function Tile({ face }: { face: string }) {
  return (
    <td
      style={{
        backgroundColor: colorMap[face],
        width: 30,
        height: 30,
      }}
    ></td>
  );
}

function Empties() {
  return (
    <>
      <td></td>
      <td></td>
      <td></td>
    </>
  );
}

function FaceletCube({ facelets }: { facelets: string }) {
  return (
    <table>
      <tbody>
        {[0, 3, 6].map((i) => (
          <tr key={i}>
            <Empties />
            <Tile face={facelets[i]} />
            <Tile face={facelets[i + 1]} />
            <Tile face={facelets[i + 2]} />
            <Empties />
            <Empties />
          </tr>
        ))}
        {[0, 3, 6].map((i) => (
          <tr key={i}>
            <Tile face={facelets[36 + i]} />
            <Tile face={facelets[36 + i + 1]} />
            <Tile face={facelets[36 + i + 2]} />

            <Tile face={facelets[18 + i]} />
            <Tile face={facelets[18 + i + 1]} />
            <Tile face={facelets[18 + i + 2]} />

            <Tile face={facelets[9 + i]} />
            <Tile face={facelets[9 + i + 1]} />
            <Tile face={facelets[9 + i + 2]} />

            <Tile face={facelets[45 + i]} />
            <Tile face={facelets[45 + i + 1]} />
            <Tile face={facelets[45 + i + 2]} />
          </tr>
        ))}
        {[0, 3, 6].map((i) => (
          <tr key={i}>
            <Empties />
            <Tile face={facelets[27 + i]} />
            <Tile face={facelets[27 + i + 1]} />
            <Tile face={facelets[27 + i + 2]} />
            <Empties />
            <Empties />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FaceletCube;

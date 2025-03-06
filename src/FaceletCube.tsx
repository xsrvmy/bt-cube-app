const colorMap = {
  U: "bg-neutral-100",
  F: "bg-green-400",
  R: "bg-red-600",
  B: "bg-blue-600",
  L: "bg-orange-400",
  D: "bg-yellow-300",
  "": "",
} as { [key: string]: string };

function Tile({ face }: { face: string }) {
  return (
    <div
      style={{ borderRadius: "20%" }}
      className={`${colorMap[face]} aspect-square w-1/12 inline-block`}
    ></div>
  );
}

function Empties() {
  return (
    <>
      <Tile face="" />
      <Tile face="" />
      <Tile face="" />
    </>
  );
}

function FaceletCube({
  facelets,
  className,
}: {
  facelets: string;
  className?: string;
}) {
  return (
    <div className={`leading-0 ${className}`}>
      {[0, 3, 6].map((i) => (
        <div key={i}>
          <Empties />
          <Tile face={facelets[i]} />
          <Tile face={facelets[i + 1]} />
          <Tile face={facelets[i + 2]} />
          <Empties />
          <Empties />
        </div>
      ))}
      {[0, 3, 6].map((i) => (
        <div key={i}>
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
        </div>
      ))}
      {[0, 3, 6].map((i) => (
        <div key={i}>
          <Empties />
          <Tile face={facelets[27 + i]} />
          <Tile face={facelets[27 + i + 1]} />
          <Tile face={facelets[27 + i + 2]} />
          <Empties />
          <Empties />
        </div>
      ))}
    </div>
  );
}

export default FaceletCube;

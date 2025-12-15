const colorMap = {
  U: "bg-neutral-100",
  F: "bg-green-400",
  R: "bg-red-600",
  B: "bg-blue-600",
  L: "bg-orange-400",
  D: "bg-yellow-300",
  "": "",
} as { [key: string]: string };

export default function LastLayerCube({
  facelets,
  className,
}: {
  facelets: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col aspect-square ${className || ""}`}>
      <div className="flex flex-row flex-1">
        <div className="flex-1"></div>
        <div className={`w-1/4 ${colorMap[facelets[47]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[46]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[45]]}`}></div>
        <div className="flex-1"></div>
      </div>
      <div className="flex flex-row h-1/4">
        <div className={`flex-1 ${colorMap[facelets[36]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[0]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[1]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[2]]}`}></div>
        <div className={`flex-1 ${colorMap[facelets[11]]}`}></div>
      </div>
      <div className="flex flex-row h-1/4">
        <div className={`flex-1 ${colorMap[facelets[37]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[3]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[4]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[5]]}`}></div>
        <div className={`flex-1 ${colorMap[facelets[10]]}`}></div>
      </div>
      <div className="flex flex-row h-1/4">
        <div className={`flex-1 ${colorMap[facelets[38]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[6]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[7]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[8]]}`}></div>
        <div className={`flex-1 ${colorMap[facelets[9]]}`}></div>
      </div>
      <div className="flex flex-row flex-1">
        <div className="flex-1"></div>
        <div className={`w-1/4 ${colorMap[facelets[18]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[19]]}`}></div>
        <div className={`w-1/4 ${colorMap[facelets[20]]}`}></div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
}

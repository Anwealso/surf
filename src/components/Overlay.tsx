export default function Overlay({
  playerSpeed,
}: {
  playerSpeed: number;
}): JSX.Element {
  return (
    <>
      <div id="instructions" className="overlay-text">
        W,A,S,D to move.
        <br />
        Space to jump.
        <br />
        Press r to reset
      </div>
      <div id="speed-overlay" className="overlay-text">
        Speed: {playerSpeed.toFixed(2)}
      </div>
    </>
  );
}

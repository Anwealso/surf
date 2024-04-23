export default function Overlay({
  playerSpeed,
}: {
  playerSpeed: number;
}): JSX.Element {
  return (
    <div id="instructions">
      W,A,S,D to move.
      <br />
      Space to jump.
      <br />
      Press r to reset
      <br />
      Speed: {playerSpeed}
    </div>
  );
}

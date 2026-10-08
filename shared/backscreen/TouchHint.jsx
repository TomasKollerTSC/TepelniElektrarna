import { useEffect, useRef, useState } from 'react';

const MOVE_MS = 60_000;
const FADE_MS = 700;
// Matches the -20px of the bounce keyframes in each App.css.
const BOB_PX = 20;

// The hand is 100 mm tall on every panel and the frame corners are 80 mm arcs, so a quarter of its
// height clear of each edge keeps it whole inside the opening.
function randomSpot(area, hand, topShare) {
  const W = area.clientWidth, H = area.clientHeight;
  const w = hand.offsetWidth, h = hand.offsetHeight;
  const side = h / 4;
  const edge = Math.max(side, H * 0.08);
  const top = Math.max(edge, H * topShare) + BOB_PX;
  const bottom = Math.max(top, H - edge - h);
  const right = Math.max(side, W - side - w);
  return { left: side + Math.random() * (right - side), top: top + Math.random() * (bottom - top) };
}

// topShare: on the tall screens (2R, 7R) the hand stays in the bottom two thirds.
export default function TouchHint({ topShare = 0, src = './g/touch-hint.png' }) {
  const area = useRef(null);
  const hand = useRef(null);
  const [spot, setSpot] = useState(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let fade;
    const place = () => {
      if (!area.current || !hand.current) return;
      setSpot(randomSpot(area.current, hand.current, topShare));
      setShown(true);
    };
    place();
    const move = setInterval(() => {
      setShown(false);
      fade = setTimeout(place, FADE_MS);
    }, MOVE_MS);
    return () => { clearInterval(move); clearTimeout(fade); };
  }, [topShare]);

  return (
    <div ref={area} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div
        ref={hand}
        className="touch-hint"
        style={{
          position: 'absolute',
          left: spot ? spot.left : 0,
          top: spot ? spot.top : 0,
          opacity: shown ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease`,
        }}
      >
        <img src={src} alt="Touch hint" />
      </div>
    </div>
  );
}

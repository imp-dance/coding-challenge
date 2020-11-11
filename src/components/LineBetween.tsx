import React, { useState, useEffect } from "react";

type TLineBetween = {
  a: HTMLDivElement | null;
  b: HTMLDivElement | null;
  triggerRerender: boolean;
  push: () => void;
  pull: () => void;
};

const LineBetween: React.FC<TLineBetween> = ({
  a,
  b,
  triggerRerender,
  push,
  pull,
}) => {
  const [style, setStyle] = useState<React.CSSProperties>();
  const [distance, setDistance] = useState(0);

  const getOffset = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      width: rect.width || el.offsetWidth,
      height: rect.height || el.offsetHeight,
    };
  };

  useEffect(() => {
    /*
      Mostly grabbed from https://stackoverflow.com/questions/8672369/how-to-draw-a-line-between-two-divs
    */
    if (a && b) {
      const off1 = getOffset(a as HTMLElement);
      const off2 = getOffset(b as HTMLElement);
      const x1 = off1.left + off1.width / 2;
      const y1 = off1.top + off1.height / 2;
      const x2 = off2.left + off2.width / 2;
      const y2 = off2.top + off2.height / 2;
      const distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      setDistance(Math.floor(distance));
      const cx = (x1 + x2) / 2 - distance / 2;
      var cy = (y1 + y2) / 2 - 1;
      const angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);
      setStyle({
        "--cx": cx + "px",
        "--cy": cy + "px",
        "--distance": distance + "px",
        "--angle": angle + "deg",
      } as React.CSSProperties);
    }
  }, [triggerRerender, a, b]);

  const onInputChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.value > distance && push && pull) {
      push();
    } else {
      pull();
    }
  };

  return (
    <div className="line" style={style}>
      <input type="number" value={distance} onChange={onInputChange} />
    </div>
  );
};

export default LineBetween;

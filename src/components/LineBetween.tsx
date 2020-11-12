import React, { useState, useEffect } from "react";

type TLineBetween = {
  a: HTMLDivElement | null;
  b: HTMLDivElement | null;
  triggerRerender: boolean;
  push: () => void;
  pull: () => void;
  setDistance: (newDistance: number) => void;
};

const LineBetween: React.FC<TLineBetween> = ({
  a,
  b,
  triggerRerender,
  push,
  pull,
  setDistance: hoistDistance,
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

  const renderLine = () => {
    /*
      Mostly grabbed from https://stackoverflow.com/questions/8672369/how-to-draw-a-line-between-two-divs
    */
    if (a && b) {
      const off1 = getOffset(a as HTMLElement);
      const off2 = getOffset(b as HTMLElement);
      const x1 = off1.left + off1.width / 2; // middle left-right of a
      const y1 = off1.top + off1.height / 2; // middle top-bottom of a
      const x2 = off2.left + off2.width / 2; // middle left-right of b
      const y2 = off2.top + off2.height / 2; // middle top-bottom of b
      const distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)); // distance between middle of both circles
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
  };

  useEffect(() => {
    renderLine();
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRerender, a, b]);

  useEffect(() => {
    window.addEventListener("resize", renderLine);
    return () => window.removeEventListener("resize", renderLine);
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInputChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.value > distance && push && pull) {
      push();
    } else {
      pull();
    }
  };

  useEffect(() => {
    hoistDistance(distance);
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance]);

  return (
    <div className="line" style={style}>
      <input type="number" value={distance} onChange={onInputChange} />
    </div>
  );
};

export default LineBetween;

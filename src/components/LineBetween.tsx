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
    // For some reason, this won't work.
    // I've scratched my head at this for a while now and can't figure out why.
    // It seems to be related to the ref-element being passed, it becomes "null"
    // while the window is resizing...
    const listener = debounce(renderLine, 500);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
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

// https://github.com/chodorowicz/ts-debounce/blob/master/src/index.ts
type Procedure = (...args: any[]) => void;
type DebounceOptions = { isImmediate: boolean };
function debounce<F extends Procedure>(
  func: F,
  waitMilliseconds = 50,
  options: DebounceOptions = {
    isImmediate: false,
  }
): (this: ThisParameterType<F>, ...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this;

    const doLater = function () {
      timeoutId = undefined;
      if (!options.isImmediate) {
        func.apply(context, args);
      }
    };

    const shouldCallNow = options.isImmediate && timeoutId === undefined;

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(doLater, waitMilliseconds);

    if (shouldCallNow) {
      func.apply(context, args);
    }
  };
}

export default LineBetween;

import React, { useState, useEffect } from "react";
import { TCoordinates } from "../types/types";

type TCircle = {
  initialCoordinates?: TCoordinates;
  onPositionChanged?: () => void;
  doPush?: boolean;
  pushOrPull?: "push" | "pull";
};

const Circle = React.forwardRef<HTMLDivElement, TCircle>(
  (
    {
      initialCoordinates = { x: 0, y: 0 },
      onPositionChanged,
      doPush,
      pushOrPull,
    },
    ref
  ) => {
    const [coordinates, setCoordinates] = useState<TCoordinates>(
      initialCoordinates
    );
    const [startC, setStartC] = useState<TCoordinates>(initialCoordinates);
    const [SDC, setSDC] = useState<TCoordinates>(initialCoordinates);
    const [dragging, setDragging] = useState(false);
    const [initialRender, setInitialRender] = useState(true);

    const style = {
      "--x": coordinates.x,
      "--y": coordinates.y,
    } as React.CSSProperties;

    useEffect(() => {
      onPositionChanged && onPositionChanged();
    }, [coordinates]);

    const onMouseDown = (e: React.MouseEvent) => {
      setDragging(true);
      setSDC({
        x: e.pageX,
        y: e.pageY,
      });
      setStartC(coordinates);
    };

    const onMouseMove = (e: React.MouseEvent) => {
      if (dragging && ref) {
        const movedX = e.pageX - SDC.x;
        const movedY = e.pageY - SDC.y;
        setCoordinates({
          x: startC.x + movedX,
          y: startC.y + movedY,
        });
      }
    };

    const onMouseUp = () => {
      setDragging(false);
    };

    useEffect(() => {
      if (!initialRender) {
        // This is a truly wonky way to control state,
        // and mostly just a workaround around the fact
        // that the state is not hoisted up. But it works.
        if (pushOrPull === "push") {
          setCoordinates({
            x: coordinates.x + 1,
            y: coordinates.y + 1,
          });
        } else {
          setCoordinates({
            x: coordinates.x - 1,
            y: coordinates.y - 1,
          });
        }
      }
      setInitialRender(false);
    }, [doPush]);

    return (
      <div
        className="circle"
        style={style}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <label>
          X{" "}
          <input
            type="number"
            value={coordinates.x}
            onChange={(e) =>
              setCoordinates({ ...coordinates, x: parseInt(e.target.value) })
            }
            onMouseDown={(e) => {
              if (!dragging) e.stopPropagation();
            }}
          />
        </label>
        <label>
          Y
          <input
            type="number"
            value={coordinates.y}
            onChange={(e) =>
              setCoordinates({ ...coordinates, y: parseInt(e.target.value) })
            }
            onMouseDown={(e) => {
              if (!dragging) e.stopPropagation();
            }}
          />
        </label>
      </div>
    );
  }
);

export default Circle;

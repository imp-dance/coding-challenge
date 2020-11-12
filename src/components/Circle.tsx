import React from "react";
import { TCoordinates } from "../types/types";

type TCircle = {
  cords: TCoordinates;
  setCords: (newState: TCoordinates) => void;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  isDragging: boolean;
  id: string;
};

const Circle = React.forwardRef<HTMLDivElement, TCircle>(
  ({ cords, setCords, onMouseDown, id, isDragging }, ref) => {
    const style = {
      "--x": cords.x,
      "--y": cords.y,
    } as React.CSSProperties;

    return (
      <div
        className="circle"
        style={style}
        onMouseDown={(e) => onMouseDown(e, id)}
        ref={ref}
      >
        <label>
          X{" "}
          <input
            type="number"
            value={Math.floor(cords.x)}
            onChange={(e) =>
              setCords({ ...cords, x: parseInt(e.target.value) })
            }
            onMouseDown={(e) => {
              // this lets us more easily click on the input without dragging the box around
              if (!isDragging) e.stopPropagation();
            }}
          />
        </label>
        <label>
          Y
          <input
            type="number"
            value={Math.floor(cords.y)}
            onChange={(e) =>
              setCords({ ...cords, y: parseInt(e.target.value) })
            }
            onMouseDown={(e) => {
              // this lets us more easily click on the input without dragging the box around
              if (!isDragging) e.stopPropagation();
            }}
          />
        </label>
      </div>
    );
  }
);

export default Circle;

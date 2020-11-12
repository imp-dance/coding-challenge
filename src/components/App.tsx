import React, { useEffect, useRef, useState } from "react";
import LineBetween from "./LineBetween";
import Circle from "./Circle";
import Canvas from "./Canvas";
import { TCoordinates } from "../types/types";

/*
  In a real world project, I'd probably use a third party library for dragging and stuff
  but since this is a code challenge I thought I'd try to do as much as possible manually

  Things I'd like to fix if I had more time:
    * When changing the input on the line, it should take into consideration the angle when moving the circle
*/

function App() {
  const firstCircle = useRef<HTMLDivElement>(null);
  const secondCircle = useRef<HTMLDivElement>(null);
  const [c1Cords, setC1Cords] = useState<TCoordinates>({ x: 0, y: 0 });
  const [c2Cords, setC2Cords] = useState<TCoordinates>({ x: 400, y: 400 });
  const [dragging, setDragging] = useState<null | string>(null);
  const [distance, setDistance] = useState(0);
  const [dragMouseStart, setDragMouseStart] = useState<TCoordinates>({
    x: 0,
    y: 0,
  });
  const [dragCircleStart, setDragCircleStart] = useState<TCoordinates>({
    x: 0,
    y: 0,
  });
  const [rerenderLine, setRerenderline] = useState(false);

  const push = () => {
    const moveFrom = c1Cords;
    const moveTo = c2Cords;
    const addToX = (moveTo.x - moveFrom.x) / distance;
    const addToY = (moveTo.y - moveFrom.y) / distance;

    setC2Cords({
      x: c2Cords.x + addToX,
      y: c2Cords.y + addToY,
    });
  };

  const pull = () => {
    const moveFrom = c1Cords;
    const moveTo = c2Cords;
    const removeFromX = (moveTo.x - moveFrom.x) / distance;
    const removeFromY = (moveTo.y - moveFrom.y) / distance;

    setC2Cords({
      x: c2Cords.x - removeFromX,
      y: c2Cords.y - removeFromY,
    });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const movedX = e.pageX - dragMouseStart.x;
      const movedY = e.pageY - dragMouseStart.y;
      const newCords = {
        x: dragCircleStart.x + movedX,
        y: dragCircleStart.y + movedY,
      };
      if (dragging === "first") {
        setC1Cords(newCords);
      } else if (dragging === "second") {
        setC2Cords(newCords);
      }
    }
  };

  const onMouseDown = (e: React.MouseEvent, id: string) => {
    setDragMouseStart({
      x: e.pageX,
      y: e.pageY,
    });
    setDragging(id);
    // If we wanted more circles, we'd probably have an object with IDs and state
    // of each circle as a collective "circles"-state, but with just these two -
    // this solution works fine.
    if (id === "first") {
      setDragCircleStart(c1Cords);
    } else if (id === "second") {
      setDragCircleStart(c2Cords);
    }
  };

  const onMouseUp = () => setDragging(null);

  const positionChanged = () => {
    setRerenderline(!rerenderLine); // triggers line to re-render.
  };

  useEffect(() => {
    positionChanged();
  }, [c1Cords, c2Cords]);

  return (
    <div className="App" onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
      <Canvas>
        <Circle
          cords={c1Cords}
          setCords={setC1Cords}
          onMouseDown={onMouseDown}
          isDragging={dragging !== null}
          ref={firstCircle}
          id="first"
        />
        <Circle
          cords={c2Cords}
          setCords={setC2Cords}
          onMouseDown={onMouseDown}
          isDragging={dragging !== null}
          ref={secondCircle}
          id="second"
        />
      </Canvas>
      <LineBetween
        a={firstCircle.current}
        b={secondCircle.current}
        triggerRerender={rerenderLine}
        push={push}
        pull={pull}
        setDistance={setDistance}
      />
    </div>
  );
}

export default App;

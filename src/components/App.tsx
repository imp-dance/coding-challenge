import React, { useEffect, useRef, useState } from "react";
import LineBetween from "./LineBetween";
import Circle from "./Circle";
import Canvas from "./Canvas";

/*
  In a real world project, I'd probably use a third party library for dragging and stuff
  but since this is a code challenge I thought I'd try to do as much as possible manually

  Things I'd like to fix if I had more time:
    * Refactor more state up to App component to make rerendering the other components easier.
      - Alternatively use context
    * When resizing the window, the <LineBetween> component should update.
    * When changing the input on the line, it should take into consideration the angle when moving the circle
*/

function App() {
  const firstCircle = useRef<HTMLDivElement>(null);
  const secondCircle = useRef<HTMLDivElement>(null);
  const [rerenderCircle, setRerenderCircle] = useState(false);
  const [pushOrPull, setPushOrPull] = useState<"push" | "pull">("push");
  const [rerenderLine, setRerenderline] = useState(false);

  const positionChanged = () => {
    setRerenderline(!rerenderLine);
  };

  const push = () => {
    setPushOrPull("push");
    setRerenderCircle(!rerenderCircle);
  };

  const pull = () => {
    setPushOrPull("pull");
    setRerenderCircle(!rerenderCircle);
  };

  useEffect(() => {
    window.addEventListener("resize", positionChanged);
    return () => window.removeEventListener("resize", positionChanged);
  }, []);

  return (
    <div className="App">
      <Canvas>
        <Circle
          ref={firstCircle}
          initialCoordinates={{ x: 0, y: 0 }}
          onPositionChanged={positionChanged}
        />
        <Circle
          ref={secondCircle}
          initialCoordinates={{ x: 400, y: 400 }}
          onPositionChanged={positionChanged}
          doPush={rerenderCircle}
          pushOrPull={pushOrPull}
        />
      </Canvas>
      <LineBetween
        a={firstCircle.current}
        b={secondCircle.current}
        triggerRerender={rerenderLine}
        push={push}
        pull={pull}
      />
    </div>
  );
}

export default App;

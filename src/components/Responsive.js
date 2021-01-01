import { useEffect, useRef, useState } from "react";

export function Responsive({ render }) {
  const wrapperRef = useRef();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(wrapperRef.current.clientWidth);
      setHeight(wrapperRef.current.clientHeight);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }} ref={wrapperRef}>
      {render(width, height)}
    </div>
  );
}

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ProjectionView, WordBubbleView } from "./components";
import slice from "./slice.js";
import { loadData } from "./services";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const data = await loadData();
      dispatch(slice.actions.loadData(data));
    })();
  }, [dispatch]);

  return (
    <>
      <nav
        className="navbar is-info"
        role="navigation"
        aria-label="main navigation"
      ></nav>
      <main className="main has-background-info-light">
        <div className="main-contents">
          <div className="projection-view p-3">
            <div className="box is-paddingless is-radiusless">
              <ProjectionView />
            </div>
          </div>
          <div className="word-bubble-view p-3">
            <div className="box is-paddingless is-radiusless">
              <WordBubbleView />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;

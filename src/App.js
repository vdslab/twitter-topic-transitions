import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ProjectionView, TimelineView, WordBubbleView } from "./components";
import slice from "./slice.js";
import { loadData } from "./services";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const data = await loadData("data-covid19.json");
      dispatch(slice.actions.loadData(data));
    })();
  }, [dispatch]);

  return (
    <>
      <nav
        className="navbar is-info"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a className="navbar-item" href=".">
            <h1>Visualization of Twitter Topic Transitions</h1>
          </a>
        </div>
        <div className="navbar-menu">
          <div className="navbar-start">
            <a
              className="navbar-item"
              href="."
              onClick={(event) => {
                event.preventDefault();
                alert(
                  `Demo application for viaulization of twitter topic transitions.
Recommended display resolution: Over Full HD
Developed by: https://vdslab.jp`,
                );
              }}
            >
              About
            </a>
            <div className="navbar-item">
              <div className="field">
                <div className="control">
                  <div className="select">
                    <select
                      defaultValue="data-covid19.json"
                      onChange={async (event) => {
                        const data = await loadData(event.target.value);
                        dispatch(slice.actions.loadData(data));
                      }}
                    >
                      <option value="data-fukushima.json">
                        2011 Fukushima Dataset
                      </option>
                      <option value="data-covid19.json">
                        2020 Covid19 Dataset
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <button
                  className="button"
                  onClick={() => {
                    dispatch(slice.actions.selectTopics([]));
                  }}
                >
                  Clear Selection
                </button>
                <button
                  className="button"
                  onClick={() => {
                    document.querySelector("#content").requestFullscreen();
                  }}
                >
                  <span className="icon">
                    <i className="fas fa-expand" />
                  </span>
                </button>
                <button
                  className="button"
                  onClick={() => {
                    alert("TBD");
                  }}
                >
                  <span className="icon">
                    <i className="fas fa-cogs" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="main has-background-info-light">
        <div className="main-contents">
          <div className="timeline-view p-3">
            <div className="box is-paddingless is-radiusless">
              <TimelineView />
            </div>
          </div>
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

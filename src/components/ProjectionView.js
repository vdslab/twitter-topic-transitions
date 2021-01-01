import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { dbscan } from "../services";
import slice from "../slice.js";
import { Responsive } from "./Responsive.js";
import { HorizontalField } from "./HorizontalField.js";

function scale(topics, screenWidth, screenHeight) {
  if (topics.length === 0) {
    return {
      x: 0,
      y: 0,
      s: 1,
    };
  }
  const left = Math.min(...topics.map(({ x, r }) => x - r));
  const right = Math.max(...topics.map(({ x, r }) => x + r));
  const top = Math.min(...topics.map(({ y, r }) => y - r));
  const bottom = Math.max(...topics.map(({ y, r }) => y + r));
  const width = right - left;
  const height = bottom - top;
  return {
    x: left + width / 2,
    y: top + height / 2,
    s: Math.min(screenWidth / width, screenHeight / height),
  };
}

function ProjectionChart({ width, height }) {
  const dispatch = useDispatch();
  const topics = useSelector(({ topics }) => topics);
  const selectionRadius = useSelector(({ selectionRadius }) => selectionRadius);
  const selectedTopics = useSelector(
    ({ selectedTopics }) => new Set(selectedTopics)
  );

  const margin = { left: 10, right: 10, top: 10, bottom: 10 };
  const contentWidth = width - margin.left - margin.right;
  const contentHeight = height - margin.top - margin.bottom;

  const line = d3
    .line()
    .x((item) => item.x)
    .y((item) => item.y);
  const { x, y, s } = scale(topics, contentWidth, contentHeight);

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g transform={`translate(${contentWidth / 2},${contentHeight / 2})`}>
          <g transform={`scale(${s})`}>
            <g transform={`translate(${-x},${-y})`}>
              <g>
                <path
                  fill="none"
                  stroke="lightgray"
                  opacity="0.7"
                  d={line(topics)}
                />
              </g>
              <g>
                {topics.map((item, i) => {
                  const date = new Date(item.time);
                  return (
                    <g
                      key={i}
                      className="is-clickable"
                      opacity={
                        selectedTopics.size === 0 || selectedTopics.has(item.id)
                          ? 1
                          : 0.1
                      }
                      style={{
                        transitionProperty: "opacity",
                        transitionDuration: "1s",
                        transitionTimingFunction: "ease",
                      }}
                      transform={`translate(${item.x}, ${item.y})`}
                      onClick={async () => {
                        if (selectedTopics.has(item.id)) {
                          dispatch(slice.actions.selectTopics([]));
                          return;
                        }
                        const { clusters } = await dbscan(
                          topics.map(({ x, y }) => [x, y]),
                          selectionRadius,
                          1
                        );
                        for (const cluster of clusters) {
                          for (const id of cluster) {
                            if (id === item.id) {
                              dispatch(slice.actions.selectTopics(cluster));
                              return;
                            }
                          }
                        }
                      }}
                    >
                      <circle r={item.r} opacity="0.5" fill={item.color}>
                        <title>
                          {date.getFullYear()}/
                          {(date.getMonth() + 1).toString().padStart(2, "0")}/
                          {date.getDate().toString().padStart(2, "0")}-
                          {date.getHours().toString().padStart(2, "0")}
                        </title>
                      </circle>
                    </g>
                  );
                })}
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export function ProjectionView() {
  const dispatch = useDispatch();
  const selectionRadius = useSelector(({ selectionRadius }) => selectionRadius);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className="p-3">
        <HorizontalField label="Selection Radius">
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="number"
                min="0"
                step="0.1"
                value={selectionRadius}
                onChange={(event) => {
                  dispatch(
                    slice.actions.updateSelectionRadius(+event.target.value)
                  );
                }}
              />
            </div>
          </div>
        </HorizontalField>
      </div>
      <div
        style={{
          position: "absolute",
          top: "64px",
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <Responsive
          render={(width, height) => (
            <ProjectionChart width={width} height={height} />
          )}
        />
      </div>
    </div>
  );
}

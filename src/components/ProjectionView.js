import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import { dbscan, scale } from "../services";
import slice from "../slice.js";
import { Responsive } from "./Responsive.js";
import { HorizontalField } from "./HorizontalField.js";

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

  const { x, y, s } = scale(topics, contentWidth, contentHeight);
  function xScale(cx) {
    return (cx - x) * s;
  }
  function yScale(cy) {
    return (cy - y) * s;
  }
  const line = d3
    .line()
    .x((item) => xScale(item.x))
    .y((item) => yScale(item.y));
  const timeFormat = d3.timeFormat("%Y-%m-%d %H:%M");

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g transform={`translate(${contentWidth / 2},${contentHeight / 2})`}>
          <g>
            <path
              fill="none"
              stroke="lightgray"
              strokeWidth="3"
              opacity="0.5"
              d={line(topics)}
            />
          </g>
          <g>
            {topics.map((item, i) => {
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
                  transform={`translate(${xScale(item.x)}, ${yScale(item.y)})`}
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
                  <circle r={item.r0} opacity="0.7" fill={item.color}>
                    <title>
                      {timeFormat(new Date(item.time))}-
                      {timeFormat(new Date(item.stopTime))}
                    </title>
                  </circle>
                </g>
              );
            })}
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

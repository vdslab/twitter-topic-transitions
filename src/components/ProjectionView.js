import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import slice from "../slice.js";
import { Responsive } from "./Responsive.js";

function ProjectionChart({ width, height }) {
  const dispatch = useDispatch();
  const topics = useSelector(({ topics }) => topics);
  const selectedTopic = useSelector(({ selectedTopic }) => selectedTopic);

  const margin = { left: 20, right: 20, top: 20, bottom: 70 };
  const contentWidth = width - margin.left - margin.right;
  const contentHeight = height - margin.top - margin.bottom;
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(topics, (item) => item.x))
    .range([0, contentWidth]);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(topics, (item) => item.y))
    .range([contentHeight, 0]);
  const line = d3
    .line()
    .x((item) => xScale(item.x))
    .y((item) => yScale(item.y));
  const getTime = (item) => {
    const date = new Date(item.time);
    return date.getTime();
  };
  const tweetPerHour = (item) => {
    const start = new Date(item.time);
    const stop = new Date(item.stopTime);
    return (item.tweetCount * 3600000) / (stop - start);
  };
  const sizeScale = d3
    .scaleSqrt()
    .domain(d3.extent(topics, tweetPerHour))
    .range([0, 15]);
  const colorScale = d3
    .scaleSequential(d3.interpolateWarm)
    .domain(d3.extent(topics, getTime));
  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g>
          <path fill="none" stroke="lightgray" d={line(topics)} />
        </g>
        <g>
          {topics.map((item, i) => {
            const date = new Date(item.time);
            return (
              <g
                key={i}
                className="is-clickable"
                transform={`translate(${xScale(item.x)}, ${yScale(item.y)})`}
                onClick={() => {
                  if (selectedTopic == null || selectedTopic !== item.id) {
                    dispatch(slice.actions.selectTopic(item.id));
                  } else {
                    dispatch(slice.actions.selectTopic(null));
                  }
                }}
              >
                <circle
                  r={sizeScale(tweetPerHour(item))}
                  opacity="0.5"
                  fill={`${colorScale(getTime(item))}`}
                >
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
      <g
        transform={`translate(${margin.left}, ${
          margin.top + contentHeight + 25
        })`}
      >
        {colorScale.ticks().map((item, i) => {
          const date = new Date(item);
          return (
            <g key={i} transform={`translate(${80 * i}, ${0})`}>
              <circle r="2" opacity="0.5" fill={`${colorScale(item)}`}></circle>
              <text dominantBaseline="central" fontSize="8" x="5">
                {date.getFullYear()}
                {(date.getMonth() + 1).toString().padStart(2, "0")}
                {date.getDate().toString().padStart(2, "0")}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function ProjectionView() {
  return (
    <Responsive
      render={(width, height) => (
        <ProjectionChart width={width} height={height} />
      )}
    />
  );
}

import * as d3 from "d3";
import { Responsive } from "./Responsive.js";

export function ProjectionView({ data, onClickTopic }) {
  return (
    <Responsive
      render={(width, height) => {
        const margin = { left: 20, right: 20, top: 20, bottom: 70 };
        const contentWidth = width - margin.left - margin.right;
        const contentHeight = height - margin.top - margin.bottom;
        const xScale = d3
          .scaleLinear()
          .domain(d3.extent(data, (item) => item.x))
          .range([0, contentWidth]);
        const yScale = d3
          .scaleLinear()
          .domain(d3.extent(data, (item) => item.y))
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
          .domain(d3.extent(data, tweetPerHour))
          .range([0, 15]);
        const colorScale = d3
          .scaleSequential(d3.interpolateWarm)
          .domain(d3.extent(data, getTime));
        return (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ backgroundColor: "white" }}
          >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              <g>
                <path fill="none" stroke="lightgray" d={line(data)} />
              </g>
              <g>
                {data.map((item, i) => {
                  const date = new Date(item.time);
                  return (
                    <g
                      key={i}
                      className="is-clickable"
                      transform={`translate(${xScale(item.x)}, ${yScale(
                        item.y
                      )})`}
                      onClick={() => {
                        if (onClickTopic) {
                          onClickTopic(item);
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
                    <circle
                      r="2"
                      opacity="0.5"
                      fill={`${colorScale(item)}`}
                    ></circle>
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
      }}
    />
  );
}

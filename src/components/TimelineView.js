import { useSelector } from "react-redux";
import * as d3 from "d3";
import { Responsive } from "./Responsive.js";

function TimelineChart({ width, height }) {
  const topics = useSelector(({ topics }) => topics);
  const selectedTopics = useSelector(
    ({ selectedTopics }) => new Set(selectedTopics)
  );

  const margin = {
    top: 10,
    right: 20,
    bottom: 30,
    left: 40,
  };
  const contentWidth = width - margin.left - margin.right;
  const contentHeight = height - margin.top - margin.bottom;

  const axisColor = "#363636";

  const xScale = d3
    .scaleLinear()
    .domain([0, topics.length])
    .range([0, contentWidth])
    .nice();
  const heightScale = d3
    .scaleLinear()
    .domain(d3.extent(topics, (topic) => topic.tweetPerHour))
    .range([0, contentHeight])
    .nice();

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g transform={`translate(0,${contentHeight})`}>
          <line x1="0" y1="0" x2={contentWidth} y2="0" stroke={axisColor} />
          <g>
            {xScale.ticks().map((x, i) => {
              return (
                <g key={i} transform={`translate(${xScale(x)},0)`}>
                  <line x1="0" y1="0" x2="0" y2="5" stroke={axisColor} />
                  <text
                    y="7"
                    textAnchor="middle"
                    dominantBaseline="text-before-edge"
                    fontWeight="700"
                    fontSize="12"
                    fill={axisColor}
                  >
                    {x}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
        <g>
          <line x1="0" y1={contentHeight} x2={0} y2={0} stroke={axisColor} />
          <g>
            {heightScale.ticks().map((y, i) => {
              return (
                <g
                  key={i}
                  transform={`translate(0,${contentHeight - heightScale(y)})`}
                >
                  <line x1="0" y1="0" x2="-5" y2="0" stroke={axisColor} />
                  <text
                    x="-7"
                    textAnchor="end"
                    dominantBaseline="central"
                    fontWeight="700"
                    fontSize="12"
                    fill={axisColor}
                  >
                    {y}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
        <g>
          {topics.map((topic, i) => {
            return (
              <g
                key={topic.id}
                opacity={
                  selectedTopics.size === 0 || selectedTopics.has(topic.id)
                    ? 1
                    : 0.1
                }
                style={{
                  transitionProperty: "opacity",
                  transitionDuration: "1s",
                  transitionTimingFunction: "ease",
                }}
              >
                <rect
                  x={xScale(i)}
                  y={contentHeight - heightScale(topic.tweetPerHour)}
                  width={xScale(i + 1) - xScale(i)}
                  height={heightScale(topic.tweetPerHour)}
                  fill={topic.color}
                />
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}

export function TimelineView() {
  return (
    <Responsive
      render={(width, height) => (
        <TimelineChart width={width} height={height} />
      )}
    />
  );
}

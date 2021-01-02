import { useSelector } from "react-redux";
import * as d3 from "d3";
import { Responsive } from "./Responsive.js";

function TimelineChart({ width, height }) {
  const dailyCount = useSelector(({ dailyCount }) => dailyCount);
  const selectedTopics = useSelector(({ topics, selectedTopics }) =>
    selectedTopics.map((id) => topics[id])
  );

  const margin = {
    top: 10,
    right: 10,
    bottom: 50,
    left: 60,
  };
  const contentWidth = width - margin.left - margin.right;
  const contentHeight = height - margin.top - margin.bottom;

  const axisColor = "#363636";
  const timeFormat = d3.timeFormat("%Y-%m-%d");

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dailyCount, (item) => new Date(item.time)))
    .range([0, contentWidth])
    .nice();
  const heightScale = d3
    .scaleLinear()
    .domain(d3.extent(dailyCount, (item) => item.tweetCount))
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
                  <g transform="rotate(-30)">
                    <text
                      x="-5"
                      textAnchor="end"
                      dominantBaseline="text-before-edge"
                      fontWeight="700"
                      fontSize="10"
                      fill={axisColor}
                    >
                      {timeFormat(x)}
                    </text>
                  </g>
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
          {dailyCount.map((item, i) => {
            const t1 = new Date(item.time);
            const t2 = new Date(t1.getTime() + 86400000);
            const active =
              selectedTopics.length === 0 ||
              selectedTopics.some((topic) => {
                const start = new Date(topic.time);
                const stop = new Date(topic.stopTime);
                return t1 <= stop && start <= t2;
              });
            return (
              <g
                key={item.time}
                style={{
                  transitionProperty: "opacity",
                  transitionDuration: "1s",
                  transitionTimingFunction: "ease",
                }}
                opacity={active ? 1 : 0.1}
              >
                <rect
                  x={xScale(new Date(item.time))}
                  y={contentHeight - heightScale(item.tweetCount)}
                  width={contentWidth / dailyCount.length + 1}
                  height={heightScale(item.tweetCount)}
                  fill={item.color}
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

import * as d3 from "d3";
import { Responsive } from "./Responsive.js";

const WordBubbleChart = ({ words, selectedTopics, width, height }) => {
  const margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
  };
  const contentWidth = width - margin.left - margin.right;
  const contentHeight = height - margin.top - margin.bottom;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const circleSize = d3
    .scaleSqrt()
    .domain(d3.extent(words, (item) => item.count))
    .range([10, 30]);

  const circleOpacity = d3
    .scaleLinear()
    .domain(d3.extent(words, (item) => item.count))
    .range([0.5, 1]);

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(words, (item) => item.x))
    .range([0, contentWidth]);

  const yScale = d3
    .scaleLinear()
    .domain(
      d3.extent(words, (item) => item.y),
      d3.min(words, (item) => item.y)
    )
    .range([contentHeight, 0]);

  const filteredWords = words.filter(({ hourlyCount }) =>
    selectedTopics.every((topicId) => hourlyCount[topicId] > 0)
  );
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ backgroundColor: "white" }}
    >
      <text dominantBaseline="centra" y="20">
        All Time Word
      </text>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {filteredWords.map((item, i) => {
          return (
            <g
              key={i}
              className="is-clickable"
              transform={`translate(${xScale(item.x)}, ${yScale(item.y)})`}
            >
              <title>{`${item.word}`}</title>
              <circle
                r={circleSize(item.count) * 1.2}
                fill={
                  item.cluster === undefined ? "lightgray" : color(item.cluster)
                }
                opacity={circleOpacity(item.count)}
              />
              <text
                fontSize={`${circleSize(item.count) * 0.6}px`}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {item.word}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export function WordBubbleView({ words, selectedTopics }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className="p-3">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Selected Topic</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input className="input" type="number" />
              </div>
            </div>
          </div>
        </div>
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
            <WordBubbleChart
              words={words}
              selectedTopics={selectedTopics}
              width={width}
              height={height}
            />
          )}
        />
      </div>
    </div>
  );
}

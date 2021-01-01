import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import slice from "../slice";
import { Responsive } from "./Responsive.js";
import { HorizontalField } from "./HorizontalField.js";

function WordBubbleChart({ width, height }) {
  const words = useSelector(({ words }) => words);
  const selectedTopics = useSelector(({ selectedTopics }) => selectedTopics);
  const minWordCount = useSelector(({ minWordCount }) => minWordCount);

  const margin = {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
  };
  const contentWidth = width - margin.left - margin.right;
  const contentHeight = height - margin.top - margin.bottom;

  const color = d3.scaleOrdinal(d3.schemePaired);
  for (const word of words) {
    color(word.cluster);
  }

  const maxSize = Math.max(
    Math.min(...words.map(({ x, r }) => x - r)),
    Math.max(...words.map(({ x, r }) => x + r)),
    Math.min(...words.map(({ y, r }) => y - r)),
    Math.max(...words.map(({ y, r }) => y + r))
  );
  const scale = Math.min(contentWidth, contentHeight) / 2 / maxSize;

  const targetWords = new Set(
    words
      .filter(({ hourlyCount }) =>
        selectedTopics.every((topicId) => hourlyCount[topicId] >= minWordCount)
      )
      .map(({ id }) => id)
  );
  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g transform={`translate(${contentWidth / 2},${contentHeight / 2})`}>
          <g transform={`scale(${scale})`}>
            {words.map((item) => {
              return (
                <g
                  key={item.id}
                  className="is-clickable"
                  transform={`translate(${item.x}, ${item.y})`}
                  opacity={targetWords.has(item.id) ? 1 : 0.1}
                  style={{
                    transitionProperty: "opacity",
                    transitionDuration: "1s",
                    transitionTimingFunction: "ease",
                  }}
                >
                  <title>{`${item.word}`}</title>
                  <circle
                    r={item.r}
                    fill={
                      item.cluster === undefined
                        ? "lightgray"
                        : color(item.cluster)
                    }
                    opacity="0.7"
                  />
                  <text
                    className="is-unselectable"
                    fontSize={item.fontSize}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {item.word}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </g>
    </svg>
  );
}

export function WordBubbleView({ words, selectedTopics }) {
  const dispatch = useDispatch();
  const minWordCount = useSelector(({ minWordCount }) => minWordCount);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className="p-3">
        <HorizontalField label="Min Word Count">
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="number"
                min="1"
                value={minWordCount}
                onChange={(event) => {
                  dispatch(
                    slice.actions.updateMinWordCount(+event.target.value)
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
          top: "116px",
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

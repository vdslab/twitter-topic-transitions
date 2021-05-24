import { useDispatch, useSelector } from "react-redux";
import * as d3 from "d3";
import slice from "../slice.js";
import { Responsive } from "./Responsive.js";

function TimelineChart({ width, height }) {
  const dispatch = useDispatch();
  const topics = useSelector(({ topics }) => topics);
  const words = useSelector(({ words }) => words);
  const dailyCount = useSelector(({ dailyCount }) => dailyCount);
  const selectedTopics = useSelector(({ topics, selectedTopics }) =>
    selectedTopics.map((id) => topics[id])
  );
  const selectedWords = useSelector(
    ({ selectedWords }) => new Set(selectedWords)
  );
  const minWordCount = useSelector(({ minWordCount }) => minWordCount);
  const keyparaseDiscover = useSelector(
    ({ keyparaseDiscover }) => keyparaseDiscover
  );

  const margin = {
    top: 20,
    right: 60,
    bottom: 50,
    left: 60,
  };
  const contentWidth = width - margin.left - margin.right;
  const contentHeight = height - margin.top - margin.bottom;

  const axisColor = "#363636";
  const barWidth = contentWidth / dailyCount.length + 1;
  const timeFormat = d3.timeFormat("%Y-%m-%d");

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dailyCount, (item) => new Date(item.time)))
    .range([barWidth / 2, contentWidth - barWidth / 2]);
  const barHeightScale = d3
    .scaleLinear()
    .domain([0, d3.max(dailyCount, (item) => item.tweetCount)])
    .range([0, contentHeight])
    .nice();
  const lineYScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dailyCount, (item) => {
        if (selectedWords.size === 0) {
          return 100;
        }
        return d3.max(Array.from(selectedWords), (id) => item.words[id]);
      }),
    ])
    .range([contentHeight, 0])
    .nice();

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
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
                <title>{timeFormat(t1)}</title>
                <rect
                  className="is-clickable"
                  x={xScale(new Date(item.time)) - barWidth / 2}
                  y={contentHeight - barHeightScale(item.tweetCount)}
                  width={barWidth}
                  height={barHeightScale(item.tweetCount)}
                  fill={item.color}
                  onClick={() => {
                    if (selectedTopics.length !== 0 && active) {
                      dispatch(slice.actions.selectTopics([]));
                    } else {
                      dispatch(
                        slice.actions.selectTopics(
                          topics
                            .filter((topic) => {
                              const start = new Date(topic.time);
                              const stop = new Date(topic.stopTime);
                              return t1 <= stop && start <= t2;
                            })
                            .map(({ id }) => id)
                        )
                      );
                    }
                  }}
                />
              </g>
            );
          })}
        </g>
        <g>
          {words.map((word) => {
            const line = d3.line().x((item) => xScale(new Date(item.time)));
            if (selectedWords.has(word.id)) {
              line.y((item) => lineYScale(item.words[word.id]));
            } else {
              line.y(() => lineYScale(0));
            }
            return (
              <g
                key={word.id}
                className="is-clickable"
                onClick={() => {
                  dispatch(slice.actions.toggleWord(word.id));

                  if (keyparaseDiscover) {
                    const sWords = Array.from(selectedWords);
                    const index = sWords.indexOf(word.id);
                    if (index < 0) {
                      sWords.push(word.id);
                    } else {
                      sWords.splice(index, 1);
                    }

                    if (sWords.size === 0) {
                      dispatch(slice.actions.selectTopics([]));
                    } else {
                      dispatch(
                        slice.actions.selectTopics(
                          topics
                            .filter((topic) => {
                              const topicId = topic.id;
                              var flag = 0;
                              sWords.forEach(function (element) {
                                if (
                                  words[element].topicCount[topicId] <
                                  minWordCount
                                )
                                  flag = 1;
                              });
                              return flag === 0;
                            })
                            .map(({ id }) => id)
                        )
                      );
                    }
                  }
                }}
              >
                <path
                  style={{
                    transitionPropery: "d",
                    transitionDuration: "1s",
                    transitionTimingFunction: "ease",
                  }}
                  d={line(dailyCount)}
                  fill="none"
                  opacity="0.9"
                  stroke={selectedWords.has(word.id) ? word.color : "none"}
                  strokeWidth="5"
                >
                  <title>{word.word}</title>
                </path>
              </g>
            );
          })}
        </g>
        <g>
          {words.map((word) => {
            if (!selectedWords.has(word.id)) {
              return null;
            }
            const maxIndex = dailyCount.reduce(
              (x, item, i) =>
                item.words[word.id] > dailyCount[x].words[word.id] ? i : x,
              0
            );
            const maxItem = dailyCount[maxIndex];
            return (
              <g
                key={word.id}
                className="is-clickable"
                onClick={() => {
                  dispatch(slice.actions.toggleWord(word.id));

                  const sWords = Array.from(selectedWords);
                  const index = sWords.indexOf(word.id);
                  if (index < 0) {
                    sWords.push(word.id);
                  } else {
                    sWords.splice(index, 1);
                  }

                  if (sWords.size === 0) {
                    dispatch(slice.actions.selectTopics([]));
                  } else {
                    dispatch(
                      slice.actions.selectTopics(
                        topics
                          .filter((topic) => {
                            const topicId = topic.id;
                            var flag = 0;
                            sWords.forEach(function (element) {
                              if (
                                words[element].topicCount[topicId] <
                                minWordCount
                              )
                                flag = 1;
                            });
                            return flag === 0;
                          })
                          .map(({ id }) => id)
                      )
                    );
                  }
                }}
              >
                <text
                  x={xScale(new Date(maxItem.time))}
                  y={lineYScale(maxItem.words[word.id])}
                  textAnchor="middle"
                  dominantBaseline="text-after-edge"
                  fontWeight="700"
                  fontSize="12"
                  fill={axisColor}
                >
                  {word.word}
                </text>
              </g>
            );
          })}
        </g>
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
          <text
            transform={`translate(-50,${contentHeight / 2})rotate(-90)`}
            textAnchor="middle"
            dominantBaseline="central"
            fontWeight="700"
            fontSize="16"
            fill={axisColor}
          >
            Tweet Count
          </text>
          <line x1="0" y1={contentHeight} x2="0" y2="0" stroke={axisColor} />
          <g>
            {barHeightScale.ticks().map((y, i) => {
              return (
                <g
                  key={i}
                  transform={`translate(0,${
                    contentHeight - barHeightScale(y)
                  })`}
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
        <g transform={`translate(${contentWidth},0)`}>
          <text
            transform={`translate(40,${contentHeight / 2})rotate(-90)`}
            textAnchor="middle"
            dominantBaseline="central"
            fontWeight="700"
            fontSize="16"
            fill={axisColor}
          >
            Word Occurrence
          </text>
          <line x1="0" y1={contentHeight} x2="0" y2="0" stroke={axisColor} />
          <g>
            {lineYScale.ticks().map((y, i) => {
              return (
                <g key={i} transform={`translate(0,${lineYScale(y)})`}>
                  <line x1="0" y1="0" x2="5" y2="0" stroke={axisColor} />
                  <text
                    x="7"
                    textAnchor="start"
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

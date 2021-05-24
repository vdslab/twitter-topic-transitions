import { useDispatch, useSelector } from "react-redux";
import { scale } from "../services";
import slice from "../slice";
import { Responsive } from "./Responsive.js";
import { HorizontalField } from "./HorizontalField.js";

function WordBubbleChart({ width, height }) {
  const dispatch = useDispatch();
  const topics = useSelector(({ topics }) => topics);
  const words = useSelector(({ words }) => words);
  const selectedTopics = useSelector(({ selectedTopics }) => selectedTopics);
  const selectedWords = useSelector(
    ({ selectedWords }) => new Set(selectedWords),
  );
  const minWordCount = useSelector(({ minWordCount }) => minWordCount);
  const discoverTopic = useSelector(({ discoverTopic }) => discoverTopic);

  const margin = {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
  };
  const contentWidth = width - margin.left - margin.right;
  const contentHeight = height - margin.top - margin.bottom;
  const { x, y, s } = scale(words, contentWidth, contentHeight);

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g transform={`translate(${contentWidth / 2},${contentHeight / 2})`}>
          <g transform={`scale(${s})`}>
            <g transform={`translate(${-x},${-y})`}>
              {words.map((word) => {
                const wordCount =
                  selectedTopics.length === 0
                    ? word.count
                    : selectedTopics.reduce(
                        (s, id) => s + word.topicCount[id],
                        0,
                      );
                const globalOpacity = wordCount < minWordCount ? 0 : 1;
                const localOpacity = Math.sqrt(wordCount / word.count);
                return (
                  <g
                    key={word.id}
                    className="is-clickable"
                    opacity={globalOpacity}
                    style={{
                      transitionProperty: "opacity",
                      transitionDuration: "1s",
                      transitionTimingFunction: "ease",
                    }}
                    transform={`translate(${word.x}, ${word.y})`}
                    onClick={() => {
                      dispatch(slice.actions.toggleWord(word.id));

                      if (discoverTopic) {
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
                                .map(({ id }) => id),
                            ),
                          );
                        }
                      }
                    }}
                  >
                    <title>{`${word.word}`}</title>
                    <circle
                      r={word.r}
                      opacity={localOpacity}
                      style={{
                        transitionProperty: "opacity",
                        transitionDuration: "1s",
                        transitionTimingFunction: "ease",
                      }}
                      fill={word.color}
                    />
                    <circle
                      r={word.r}
                      fill="none"
                      stroke={selectedWords.has(word.id) ? "#363636" : "none"}
                      strokeWidth="2"
                    />
                    <text
                      className="is-unselectable"
                      fontSize={word.fontSize}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontWeight="700"
                      fill="#363636"
                    >
                      {word.word}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export function WordBubbleView({ words, selectedTopics }) {
  const dispatch = useDispatch();
  const minWordCount = useSelector(({ minWordCount }) => minWordCount);
  const discoverTopic = useSelector(({ discoverTopic }) => discoverTopic);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className="p-3">
        <HorizontalField label="Min Word Count">
          <div className="field has-addons">
            <div className="control">
              <button
                disabled={minWordCount <= 0}
                className="button"
                onClick={() => {
                  dispatch(slice.actions.updateMinWordCount(minWordCount - 1));
                }}
              >
                <span className="icon">
                  <i className="fas fa-minus" />
                </span>
              </button>
            </div>
            <div className="control is-expanded">
              <input
                className="input"
                type="number"
                min="1"
                value={minWordCount}
                onChange={(event) => {
                  dispatch(
                    slice.actions.updateMinWordCount(+event.target.value),
                  );
                }}
              />
            </div>
            <div className="control">
              <button
                className="button"
                onClick={() => {
                  dispatch(slice.actions.updateMinWordCount(minWordCount + 1));
                }}
              >
                <span className="icon">
                  <i className="fas fa-plus" />
                </span>
              </button>
            </div>
          </div>
        </HorizontalField>
        <HorizontalField>
          <div className="field ">
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={discoverTopic}
                  onChange={() => {
                    dispatch(slice.actions.toggleDiscoverTopic());
                    dispatch(slice.actions.selectTopics([]));
                    dispatch(slice.actions.selectedWords([]));
                  }}
                />{" "}
                Find related topics from selected keyphrases
              </label>
            </div>
          </div>
        </HorizontalField>
      </div>
      <div
        style={{
          position: "absolute",
          top: "128px",
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

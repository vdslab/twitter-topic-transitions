import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dbscanWorker from "./dbscan.worker.js";
import tsneWorker from "./tsne.worker.js";

const { dbscan } = dbscanWorker();
const { tsne } = tsneWorker();

const App = () => {
  const [data, setData] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("data.json");
      const data = await response.json();
      const { clusters: topicClusters } = await dbscan(
        data.topics.map(({ x, y }) => [x, y]),
        1.8,
        3
      );
      topicClusters.forEach((cluster, i) => {
        for (const topicId of cluster) {
          data.topics[topicId].cluster = i;
        }
      });
      const pos = await tsne(data.words.map(({ vec }) => vec));
      data.words.forEach((word, i) => {
        const [x, y] = pos[i];
        word.x = 100 * x;
        word.y = 100 * y;
      });
      const { clusters: wordClusters } = await dbscan(
        data.words.map(({ x, y }) => [x, y]),
        3,
        2
      );
      wordClusters.forEach((cluster, i) => {
        for (const wordId of cluster) {
          data.words[wordId].cluster = i;
        }
      });

      data.topicClusters = topicClusters;
      data.wordClusters = wordClusters;
      setData(data);
    })();
  }, []);

  return (
    <>
      <nav
        className="navbar is-info"
        role="navigation"
        aria-label="main navigation"
      ></nav>
      <main className="main has-background-light">
        <div className="main-contents">
          <div className="projection-view p-3">
            <div className="box has-background-info-light">
              <ProjectionView
                data={data?.topics || []}
                onClickTopic={(topic) => {
                  if (selectedTopics.length === 0) {
                    setSelectedTopics(data.topicClusters[topic.cluster]);
                  } else {
                    setSelectedTopics([]);
                  }
                }}
              />
            </div>
          </div>
          <div className="word-bubble-view p-3">
            <div className="box has-background-info-light">
              <WordBubbleView
                words={data?.words || []}
                selectedTopics={selectedTopics}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

const Responsive = ({ render }) => {
  const wrapperRef = useRef();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(wrapperRef.current.clientWidth);
      setHeight(wrapperRef.current.clientHeight);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }} ref={wrapperRef}>
      {render(width, height)}
    </div>
  );
};

const ProjectionView = ({ data, onClickTopic }) => {
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
};

const WordBubbleView = ({ words, selectedTopics }) => {
  return (
    <Responsive
      render={(width, height) => {
        const margin = {
          left: 10,
          right: 10,
          top: 50,
          bottom: 10,
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
                    transform={`translate(${xScale(item.x)}, ${yScale(
                      item.y
                    )})`}
                  >
                    <title>{`${item.word}`}</title>
                    <circle
                      r={circleSize(item.count) * 1.2}
                      fill={
                        item.cluster === undefined
                          ? "lightgray"
                          : color(item.cluster)
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
      }}
    />
  );
};

export default App;

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const App = () => {
  const [data, setData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [windowSize, setWindowSize] = useState([]);

  useEffect(() => {
    fetch("data.json")
      // fetch("test.json")
      .then((response) => response.json())
      // .then((text) => // // console.log(text));
      .then((data) => {
        // // console.log(data);
        setData(data.topics);
      });
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
          <div className="form p-3">
            <div className="box has-background-info-light">
              <p className="control">
                <input
                  id="windowSize"
                  className="input"
                  type="text"
                  placeholder="Window size, defult 5."
                  // value="3"
                  // defaultValue="5"
                  onChange={(e) => {
                    // // console.log("e = " + e.target.value);
                    setWindowSize(e.target.value);
                    // // console.log("windowSize = " + windowSize);
                  }}
                />
              </p>
            </div>
          </div>
          <div className="projection-view p-3">
            <div className="box has-background-info-light">
              <ProjectionView data={data} setTimeData={setTimeData} />
            </div>
          </div>
          <div className="word-bubble-view p-3">
            <div className="box has-background-info-light">
              <WordBubbleView
                data={data}
                timeData={timeData}
                windowSize={windowSize}
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

const ProjectionView = ({ data, setTimeData }) => {
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
                  // // console.log("before: " + item.time);
                  const date = new Date(item.time);
                  // // // console.log("after: " + date);
                  // // // console.log(item.time);

                  return (
                    <g
                      key={i}
                      transform={`translate(${xScale(item.x)}, ${yScale(
                        item.y
                      )})`}
                      onMouseEnter={() => {
                        var timeData = item.time;
                        // console.log(timeData);
                        setTimeData(timeData);
                        // console.log("windowSize = " + windowSize);
                      }}
                      onMouseLeave={() => {
                        var timeData = new Date();
                        // console.log(timeData);
                        setTimeData(timeData);
                      }}
                    >
                      <circle
                        r="3"
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

const WordBubbleView = ({ data, timeData, windowSize }) => {
  return timeData.length === 0 ? (
    <AllWordPlot />
  ) : (
    <WordPlot timeData={timeData} windowSize={windowSize} />
  );
};

const AllWordPlot = () => {
  const [allWord, setAllWord] = useState([]);
  useEffect(() => {
    fetch("dbscan_word_coordinate.json")
      // fetch("test.json")
      .then((response) => response.json())
      // .then((text) => console.log(text));
      .then((allWord) => {
        // console.log(allWord);
        setAllWord(allWord);
      });
  }, []);

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

        // const color = d3.scaleOrdinal(d3.schemeAccent);

        const color = (d) => {
          if (d === "red") return "lightgray";
          else return d;
        };

        // const circleSize = (d) => Math.pow(d.count, 0.7);
        const circleSize = (d) => Math.log(d.count) * 3;

        // const countMax = d3.max(words, (item) => item.count);
        // const countMin = d3.min(words, (item) => item.count);

        const circleScale = d3
          .scaleLinear()
          .domain([
            d3.min(allWord, (item) => item.count),
            d3.max(allWord, (item) => item.count),
          ])
          .range([0.5, 1])
          .nice();

        // console.log(countMin);

        const circleOpacity = (d) => circleScale(d.count);
        // 对数log处理 ， 透明度

        // const circleSize = (d) => d.count;

        const xScale = d3
          .scaleLinear()
          .domain([
            d3.min(allWord, (item) => item.x),
            d3.max(allWord, (item) => item.x),
          ])
          .range([0, contentWidth])
          .nice();

        const yScale = d3
          .scaleLinear()
          .domain([
            d3.max(allWord, (item) => item.y),
            d3.min(allWord, (item) => item.y),
          ])
          .range([0, contentHeight])
          .nice();
        return (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ backgroundColor: "white" }}
          >
            <text dominantBaseline="centra" y="20">
              All Time Word
            </text>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {allWord.map((item, i) => {
                return (
                  <g
                    key={i}
                    transform={`translate(${xScale(item.x)}, ${yScale(
                      item.y
                    )})`}
                    // style={{ cursor: "pointer" }}
                  >
                    <title>{`${item.word}`}</title>
                    <circle
                      r={`${circleSize(item) * 1.2}px`}
                      fill={color(item.color)}
                      opacity={circleOpacity(item)}
                      // fill={item.color}
                    />
                    <text
                      fontSize={`${circleSize(item) * 0.6}px`}
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

//////////////////////////
const WordPlot = ({ timeData, windowSize }) => {
  const [words, setWords] = useState([]);

  // // console.log("timeData = " + timeData);
  if (windowSize.length === 0) windowSize = 5;

  // console.log("windowSize = " + windowSize);

  const cDate = new Date(timeData);
  // const windowSize = 5;

  // useEffect(() => {
  //   fetch(timeData)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setData(data);
  //     });
  // }, [timeData]);

  useEffect(() => {
    const jsonUrl = (date) => {
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString().padStart(2, "0");
      var day = date.getDate().toString().padStart(2, "0");

      var newDate = `${year}${month}${day}`;
      var hour = date.getHours().toString().padStart(2, "0");
      var path = `./dbscan_word_coordinate_by_hour/${newDate}/${newDate}_${hour}.json`;
      return path;
    };

    const chackTime = (date) => {
      var startDate = new Date("2019/12/17 10:00");
      var endDate = new Date("2020/03/31 23:00");

      if (
        date.getTime() >= startDate.getTime() &&
        date.getTime() <= endDate.getTime()
      ) {
        return 1;
      } else return 0;
    };

    const date = new Date(timeData);
    const urls = [];
    if (chackTime(date)) {
      // // console.log("safe " + date);
      urls.push(jsonUrl(date));
      for (let i = 1; i <= windowSize; ++i) {
        const d1 = new Date(date.getTime() + 3600000 * i);
        if (chackTime(d1)) {
          urls.push(jsonUrl(d1));
        }
        const d2 = new Date(date.getTime() - 3600000 * i);
        if (chackTime(d2)) {
          urls.push(jsonUrl(d2));
        }
      }
    }

    console.log(urls);

    // TODO deal non-existent urls

    const requests = urls.map((url) => {
      return fetch(url).then((response) => response.json());
    });

    console.log("reqs = " + requests);

    Promise.all(requests).then((data) => {
      console.log("data = " + data);
      const words = {};
      for (const dateItems of data) {
        for (const item of dateItems) {
          // // // console.log("item.word = " + item.word);
          if (!(item.word in words)) {
            words[item.word] = {
              word: item.word,
              count: 0,
              total_count: item.total_count,
              color: item.color,
              x: item.x,
              y: item.y,
            };
          }
          words[item.word].count += item.count;
        }
      }
      // // console.log("words = " + words);
      setWords(Object.values(words));
    });
  }, [timeData, windowSize]);

  if (words.length === 0) {
    return <AllWordPlot />;
  }

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

        // const color = d3.scaleOrdinal(d3.schemeAccent);

        const color = (d) => {
          if (d === "red") return "lightgray";
          else return d;
        };

        // const circleSize = (d) => Math.pow(d.count, 0.7);
        const circleSize = (d) => Math.log(d.count) * 12;

        // const countMax = d3.max(words, (item) => item.count);
        // const countMin = d3.min(words, (item) => item.count);

        const circleScale = d3
          .scaleLinear()
          .domain([
            d3.min(words, (item) => item.count),
            d3.max(words, (item) => item.count),
          ])
          .range([0.5, 1])
          .nice();

        // console.log(countMin);

        const circleOpacity = (d) => circleScale(d.count);

        const xScale = d3
          .scaleLinear()
          .domain([
            d3.min(words, (item) => item.x),
            d3.max(words, (item) => item.x),
          ])
          .range([0, contentWidth])
          .nice();

        const yScale = d3
          .scaleLinear()
          .domain([
            d3.max(words, (item) => item.y),
            d3.min(words, (item) => item.y),
          ])
          .range([0, contentHeight])
          .nice();

        return (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ backgroundColor: "white" }}
          >
            <text dominantBaseline="centra" y="20">
              {cDate.getFullYear()}/
              {(cDate.getMonth() + 1).toString().padStart(2, "0")}/
              {cDate.getDate().toString().padStart(2, "0")}-
              {cDate.getHours().toString().padStart(2, "0")} window ={" "}
              {windowSize}
            </text>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {words.map((item, i) => {
                return (
                  <g
                    key={i}
                    transform={`translate(${xScale(item.x)}, ${yScale(
                      item.y
                    )})`}
                    // style={{ cursor: "pointer" }}
                  >
                    <title>{`word:${item.word}`}</title>
                    <circle
                      r={`${circleSize(item) * 1.4}px`}
                      fill={color(item.color)}
                      opacity={circleOpacity(item)}
                      // fill={item.color}
                    />
                    <text
                      fontSize={`${circleSize(item) * 1.6}px`}
                      textAnchor="middle"
                      dominantBaseline="central"
                      // visibility="hidden"
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

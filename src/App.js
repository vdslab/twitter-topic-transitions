import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const Chart = ({ data }) => {
  const contentWidth = 400;
  const contentHeight = 400;
  const margin = { left: 20, right: 20, top: 20, bottom: 20 };
  const width = margin.left + margin.right + contentWidth;
  const height = margin.top + margin.bottom + contentHeight;
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
    .scaleSequential(d3.interpolatePiYG)
    .domain(d3.extent(data, getTime));
  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g>
          <path fill="none" stroke="black" d={line(data)} />
        </g>
        <g>
          {data.map((item, i) => {
            return (
              <g
                key={i}
                transform={`translate(${xScale(item.x)}, ${yScale(item.y)})`}
              >
                <circle
                  r="10"
                  fill={`${colorScale(getTime(item))}`}
                  stroke="black"
                ></circle>
                <text textAnchor="middle" dominantBaseline="central">
                  {i}
                </text>
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
};

const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    // fetch("twi_time_coordinate_200_w8_ws15.json")
    fetch("test.json")
      .then((response) => response.text())
      .then((text) => console.log(text));
    // .then((data) => {
    //   setData(data);
    // });
  }, []);

  console.log(data);
  return (
    <div>
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">hello</h1>
            <h2 className="subtitle">hello</h2>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="box">
                <Chart data={data} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="content has-text-centered">
          <p>&copy;2020 xiaotiandong</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

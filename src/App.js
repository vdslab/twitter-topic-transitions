import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const Chart = ({ data }) => {
  const contentWidth = 800;
  const contentHeight = 600;
  const margin = { left: 20, right: 20, top: 20, bottom: 70 };
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
    .scaleSequential(d3.interpolateCool)
    .domain(d3.extent(data, getTime));
  console.log(colorScale.ticks());
  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
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
                transform={`translate(${xScale(item.x)}, ${yScale(item.y)})`}
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
                {/* <text textAnchor="middle" dominantBaseline="central">
                  {i}
                </text> */}
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
              <circle r="2" opacity="0.5" fill={`${colorScale(item)}`}></circle>
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
};

const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("twi_time_coordinate_200_w8_ws10.json")
      // fetch("test.json")
      .then((response) => response.json())
      // .then((text) => console.log(text));
      .then((data) => {
        setData(data);
      });
  }, []);

  const [data1, setData1] = useState([]);
  useEffect(() => {
    fetch("twi_time_coordinate_200_w8_ws20.json")
      // fetch("test.json")
      .then((response) => response.json())
      // .then((text) => console.log(text));
      .then((data1) => {
        setData1(data1);
      });
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
          <div className="column">
            <div className="container">
              <h3 className="title is-4">twi_time_coordinate_200_w8_ws20</h3>
            </div>
            <div className="box">
              <Chart data={data1} />
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

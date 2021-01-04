import * as d3 from "d3";
import { dbscan, layout } from "./algorithms";

const optimalFontSize = (word, r, fontFamily, fontWeight) => {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.textContent = word;
  text.setAttributeNS(null, "font-family", fontFamily);
  text.setAttributeNS(null, "font-weight", fontWeight);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.appendChild(text);
  document.body.appendChild(svg);
  let ok = 0;
  let ng = 100;
  for (let iter = 0; iter < 10; ++iter) {
    let m = (ok + ng) / 2;
    text.setAttributeNS(null, "font-size", m);
    const { width, height } = text.getBBox();
    const d = Math.sqrt(width ** 2 + height ** 2) / 2;
    if (d <= r) {
      ok = m;
    } else {
      ng = m;
    }
  }
  document.body.removeChild(svg);
  return ok;
};

const getTime = (item) => {
  const date = new Date(item.time);
  return date.getTime();
};

function tweetPerHour(item) {
  const start = new Date(item.time);
  const stop = new Date(item.stopTime);
  return (item.tweetCount * 3600000) / (stop - start);
}

export async function loadData() {
  const response = await fetch("data.json");
  const data = await response.json();

  const timeColor = d3
    .scaleSequential(d3.interpolateWarm)
    .domain(d3.extent(data.dailyCount, getTime));
  for (const row of data.dailyCount) {
    row.color = timeColor(getTime(row));
  }

  const topicCircleSize = d3
    .scaleSqrt()
    .domain(d3.extent(data.topics, tweetPerHour))
    .range([3, 15]);
  for (const topic of data.topics) {
    topic.tweetPerHour = tweetPerHour(topic);
    topic.r = 0;
    topic.r0 = topicCircleSize(topic.tweetPerHour);
    topic.color = timeColor(getTime(topic));
  }

  const wordCircleSize = d3
    .scaleSqrt()
    .domain(d3.extent(data.words, (item) => item.count))
    .range([10, 50]);
  data.words.forEach((word, i) => {
    word.x *= 10;
    word.y *= 10;
    word.r = wordCircleSize(word.count);
    word.fontSize = optimalFontSize(word.word, word.r, "700");
  });

  const eps = 20;
  const { clusters: wordClusters } = await dbscan(
    data.words.map(({ x, y }) => [x, y]),
    eps,
    2
  );
  wordClusters.forEach((cluster, i) => {
    for (const wordId of cluster) {
      data.words[wordId].cluster = i;
    }
  });

  const pos = await layout(data.words, eps);
  const wordColor = d3.scaleOrdinal(d3.schemePaired);
  data.words.forEach((word, i) => {
    const { x, y } = pos[i];
    word.x = x;
    word.y = y;
    word.color =
      word.cluster === undefined ? "lightgray" : wordColor(word.cluster);
  });

  data.wordClusters = wordClusters;
  return data;
}

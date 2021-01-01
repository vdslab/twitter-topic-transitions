import * as d3 from "d3";
import { dbscan, layout, tsne } from "./algorithms";

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

  const topicColor = d3
    .scaleSequential(d3.interpolateWarm)
    .domain(d3.extent(data.topics, getTime));
  const topicCircleSize = d3
    .scaleSqrt()
    .domain(d3.extent(data.topics, tweetPerHour))
    .range([1, 5]);
  for (const topic of data.topics) {
    topic.tweetPerHour = tweetPerHour(topic);
    topic.r = topicCircleSize(topic.tweetPerHour);
    topic.color = topicColor(getTime(topic));
  }

  const pos = await tsne(
    data.words.map(({ vec }) => vec),
    10
  );
  const wordCircleSize = d3
    .scaleSqrt()
    .domain(d3.extent(data.words, (item) => item.count))
    .range([10, 50]);
  const eps = 300;
  data.words.forEach((word, i) => {
    const [x, y] = pos[i];
    word.x = 10000 * x;
    word.y = 10000 * y;
    word.r = wordCircleSize(word.count);
    word.fontSize = optimalFontSize(word.word, word.r);
  });
  const { clusters: wordClusters } = await dbscan(
    data.words.map(({ x, y }) => [x, y]),
    eps,
    2
  );
  const pos2 = await layout(data.words, eps);
  data.words.forEach((word, i) => {
    const { x, y } = pos2[i];
    word.x = x;
    word.y = y;
  });
  wordClusters.forEach((cluster, i) => {
    for (const wordId of cluster) {
      data.words[wordId].cluster = i;
    }
  });

  data.wordClusters = wordClusters;
  return data;
}

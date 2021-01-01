import { dbscan, tsne } from "./algorithms";

export async function loadData() {
  const response = await fetch("data.json");
  const data = await response.json();
  data.topics.forEach((topic, i) => {
    topic.id = i;
  });
  const { clusters: topicClusters } = await dbscan(
    data.topics.map(({ x, y }) => [x, y]),
    1.8,
    1
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
  return data;
}

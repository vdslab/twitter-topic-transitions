import React, { useEffect, useState } from "react";
import { ProjectionView, WordBubbleView } from "./components";
import { tsne, dbscan } from "./services";

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
      <main className="main has-background-info-light">
        <div className="main-contents">
          <div className="projection-view p-3">
            <div className="box is-paddingless is-radiusless">
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
            <div className="box is-paddingless is-radiusless">
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

export default App;

import TSNE from "tsne-js";

export async function tsne(data, perplexity) {
  const model = new TSNE({
    dim: 2,
    perplexity,
    nIter: 10,
    metric: "euclidean",
  });
  model.init({
    data,
    type: "dense",
  });
  model.run();
  return model.getOutputScaled();
}

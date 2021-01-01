import TSNE from "tsne-js";

export async function tsne(data) {
  const model = new TSNE({
    dim: 2,
    perplexity: 50.0,
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

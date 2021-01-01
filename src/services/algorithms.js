import dbscanWorker from "../workers/dbscan.worker.js";
import layoutWorker from "../workers/layout.worker.js";
import tsneWorker from "../workers/tsne.worker.js";

export const { dbscan } = dbscanWorker();
export const { layout } = layoutWorker();
export const { tsne } = tsneWorker();

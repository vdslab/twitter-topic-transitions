import dbscanWorker from "../workers/dbscan.worker.js";
import tsneWorker from "../workers/tsne.worker.js";

export const { dbscan } = dbscanWorker();
export const { tsne } = tsneWorker();

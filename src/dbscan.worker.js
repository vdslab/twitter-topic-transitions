import { DBSCAN } from "density-clustering";

export async function dbscan(data, eps, minSamples) {
  const dbscan = new DBSCAN();
  const clusters = dbscan.run(data, eps, minSamples);
  return { clusters, noise: dbscan.noise };
}

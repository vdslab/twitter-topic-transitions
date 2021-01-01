import * as d3 from "d3";

export function layout(words, eps) {
  const links = [];
  for (let j = 1; j < words.length; j++) {
    const { x: xj, y: yj, r: rj } = words[j];
    for (let i = 0; i < j; i++) {
      const { x: xi, y: yi, r: ri } = words[i];
      if ((xi - xj) ** 2 + (yi - yj) ** 2 <= eps ** 2) {
        links.push({ source: i, target: j, distance: ri + rj });
      }
    }
  }

  const simulation = d3
    .forceSimulation(words)
    .force("charge", d3.forceManyBody().strength(10))
    .force(
      "link",
      d3.forceLink(links).distance(({ distance }) => distance)
    )
    .force(
      "collide",
      d3
        .forceCollide()
        .radius(({ r }) => r + 1)
        .iterations(30)
    )
    .force("x", d3.forceX(0))
    .force("y", d3.forceY(0));
  simulation.tick(300).stop();
  return words.map(({ x, y }) => ({ x, y }));
}

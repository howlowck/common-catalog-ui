import { Component, onMount } from "solid-js"
import cytoscape from "cytoscape"

let graphDiv: HTMLDivElement

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max)
}

const makeGraph = () => {
  const numOfNodes = Math.round(graphDiv.clientWidth / 70)
  const nodes = Array.from({ length: numOfNodes - 1 }, (_, i) => ({
    data: { id: "n" + i },
  }))
  const edges = Array.from({ length: numOfNodes - 1 }, (_, i) => ({
    data: { id: "e" + i, source: "n" + i, target: "n" + (i + 1) },
  }))
  const randomEdges = Array.from({ length: numOfNodes }, (_, i) => {
    const source = getRandomInt(numOfNodes)
    const tempTarget = getRandomInt(numOfNodes)
    const target =
      tempTarget === source ? (source + 3) % (numOfNodes - 1) : tempTarget
    return {
      data: {
        id: "er" + i,
        source: "n" + source,
        target: "n" + target,
      },
    }
  })

  const cy = cytoscape({
    container: graphDiv,
    elements: [
      ...nodes,
      { data: { id: "n" + (numOfNodes - 1) } },
      ...edges,
      ...randomEdges,
    ],
    style: [
      {
        selector: "node",
        style: {
          "background-color": "#0f0",
          opacity: 0.2,
        },
      },
      {
        selector: "edge",
        style: {
          "background-color": "#0f0",
          opacity: 0.2,
        },
      },
    ],
  })
  cy.layout({ name: "breadthfirst", animate: true }).run()
  cy.zoomingEnabled(false)
}

const Comp: Component = () => {
  onMount(makeGraph)
  return (
    <>
      <div class="d-flex position-relative h-sm-300 h-md-350 h-lg-400 align-items-center">
        <div class="content text-extra-letter-spacing m-auto text-center z-20">
          <h1>Common Catalog Schema</h1>
          <p class="font-size-20">Making Connections with your catalog data</p>
        </div>
        <div
          class="graph position-absolute w-full h-full z-10 d-md-block d-sm-none"
          ref={graphDiv}
        ></div>
      </div>
      <div class="container">
        <div class="content">
          <h2>Business Values</h2>
          <ul>
            <li>
              Declares your catalog and all of its components and concepts
            </li>
            <li>
              <span class="font-weight-bold">Transformation</span> from one item
              to another by changing one or more attributes
            </li>
            <li>
              <span class="font-weight-bold">Search</span> for items via its
              components and concepts{" "}
            </li>
            <li>
              <span class="font-weight-bold">Discover</span> missing items by
              exploring adjacent items and concepts
            </li>
            <li>
              <span class="font-weight-bold">Disambiguate</span> similar items
            </li>
          </ul>
          <br />
          <h2>Developer Features</h2>
          <ul>
            <li>Easy to migrate from your existing catalog data</li>
            <li>
              Integrates with your favorite IDE (via the{" "}
              <a href="https://www.schemastore.org/json/">Schema Store</a>)
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Comp

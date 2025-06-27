import { Accessor, Component, onMount } from "solid-js"
import cytoscape, { NodeDefinition } from "cytoscape"
// import type { node } from "cytoscape"
import popper from "cytoscape-popper"
import fcose from "cytoscape-fcose"
import tippy from "tippy.js"
import { ClassificationItem } from "common-catalog-schema"

let graphDiv: HTMLDivElement

cytoscape.use(popper)
cytoscape.use(fcose)

type Props = {
  content: Accessor<string>
}

function makePopper(ele: any) {
  let dummyDomEle = document.createElement("div")
  let ref = ele.popperRef() // used only for positioning

  ele.tippy = tippy(dummyDomEle, {
    getReferenceClientRect: ref.getBoundingClientRect,
    // tippy options:
    content: () => {
      let content = document.createElement("div")

      content.innerHTML = ele.id()

      return content
    },
    trigger: "manual", // probably want manual mode
  })
}

const createGraph = (el: HTMLDivElement, content: string) => {
  const rawObj = JSON.parse(content)
  const classificationNodes = rawObj?.classifications.map((_: any) => ({
    data: { id: `c-${_.id}` },
    classes: ["classification"],
  }))
  const classificationParentEdges = rawObj?.classifications
    .filter((_: any) => !!_.parent)
    .map((_: any) => ({
      data: {
        id: `cp-${_.id}-${_.parent}`,
        source: `c-${_.id}`,
        target: `c-${_.parent}`,
      },
    }))
  const itemNodes = rawObj?.items.map((_: any) => ({
    data: { id: _.id },
    scratch: { _name: _.name },
    classes: ["item"],
  }))
  const itemClassificationEdges = rawObj?.items.reduce(
    (prev: any, curr: any, i: number) => {
      const edges = curr.classifications.map((_: ClassificationItem) => ({
        data: {
          id: `icl-${curr.id}-${_.classificationId}`,
          source: curr.id,
          target: `c-${_.classificationId}`,
        },
        classes: ["connection", "item-classification"],
      }))
      return [...prev, ...edges]
    },
    []
  )

  const conceptNodes = rawObj?.concepts.map((_: any) => ({
    data: { id: _.id },
    classes: ["concept"],
  }))

  const conceptValueArr = rawObj?.concepts
    .map((_: any) => {
      return _.values?.map((v: any) => ({
        conceptId: _.id,
        value: v.value.toLowerCase(),
      }))
    }, [])
    .flat()

  const conceptValueNodes = conceptValueArr.map((_: any) => ({
    data: { id: _.value },
    classes: ["concept-value"],
  }))

  const conceptToValueEdges = conceptValueArr.map((_: any) => ({
    data: {
      id: `ccv-${_.conceptId}-${_.value}`,
      source: _.conceptId,
      target: _.value,
    },
  }))

  const disambiguationArr = rawObj?.items
    .map((_: any) => {
      return _.disambiguationAttributes?.map((da: any) => ({
        itemId: _.id,
        conceptId: da.conceptId,
        value: da.value.toLowerCase(),
      }))
    })
    .flat()

  const disambiguationArrEdges = disambiguationArr.map((_: any) => ({
    data: {
      id: `d-${_.itemId}-${_.conceptId}-${_.value}`,
      source: _.itemId,
      target: _.value,
    },
  }))

  const choicesArr = rawObj?.items
    .map((_: any) => {
      return _.choices?.map((c: any) =>
        c.choiceValues?.map((cv: any) => ({
          itemId: _.id,
          conceptId: c.conceptId,
          choice: cv.value.toLowerCase(),
        }))
      )
    })
    .flat(2)
    .filter((_: any) => !!_)

  const choicesEdges = choicesArr.map((_: any) => ({
    data: {
      id: `c-${_.itemId}-${_.conceptId}-${_.choice}`,
      source: _.itemId,
      target: _.choice,
    },
  }))

  const conceptComponentsArr = rawObj?.items
    .map((_: any) => {
      return _.components?.map((c: any) => {
        if (c.type !== "concept") {
          return
        }
        return {
          itemId: _.id,
          conceptId: c.attribute.conceptId,
          targetItemId: c.itemId,
        }
      })
    })
    .flat()
    .filter((_: any) => !!_)

  const conceptComponentsEdges = conceptComponentsArr.map((_: any) => ({
    data: {
      id: `cc-${_.itemId}-${_.conceptId}`,
      source: _.itemId,
      target: _.conceptId,
    },
  }))

  const conceptTargetComponentsEdges = conceptComponentsArr.map((_: any) => ({
    data: {
      id: `ctc-${_.itemId}-${_.conceptId}`,
      source: _.conceptId,
      target: _.targetItemId,
    },
  }))

  const addOnsArr = rawObj?.items
    .map((_: any) => {
      return _.addOns?.map((ao: any) => {
        return {
          itemId: _.id,
          targetItemId: ao.itemId,
          conceptId: ao.option.conceptId,
        }
      })
    })
    .flat()
    .filter((_: any) => !!_)

  const conceptAddOnEdges = addOnsArr.map((_: any) => ({
    data: {
      id: `ao-${_.itemId}-${_.conceptId}`,
      source: _.itemId,
      target: _.conceptId,
    },
  }))

  const conceptAddOnTargetEdges = addOnsArr.map((_: any) => ({
    data: {
      id: `aot-${_.itemId}-${_.conceptId}`,
      source: _.conceptId,
      target: _.targetItemId,
    },
  }))

  const cy = cytoscape({
    container: graphDiv,
    elements: [
      // ...classificationNodes,
      ...itemNodes,
      ...conceptNodes,
      ...conceptValueNodes,
      // ...itemClassificationEdges,
      // ...classificationParentEdges,
      ...conceptToValueEdges,
      ...disambiguationArrEdges,
      ...choicesEdges,
      ...conceptComponentsEdges,
      ...conceptTargetComponentsEdges,
      ...conceptAddOnEdges,
      ...conceptAddOnTargetEdges,
    ],
    layout: {
      /// @ts-ignore
      name: "fcose",
      nodeRepulsion: (node: any) => {
        if (node.classes().includes("item")) {
          return 50
        }
        return 100000
      },
      edgeElasticity: () => 0.025,
    },
    style: [
      {
        selector: ".classification",
        style: {
          "background-color": "#0f0",
          opacity: 0.2,
        },
      },
      {
        selector: ".item",
        style: {
          "background-color": "#00f",
          opacity: 0.2,
        },
      },
      {
        selector: ".concept",
        style: {
          "background-color": "#f00",
          opacity: 0.2,
        },
      },
      {
        selector: ".concept-value",
        style: {
          "background-color": "orange",
          opacity: 0.2,
        },
      },
    ],
  })

  cy.elements("node").unbind("mouseover")
  cy.elements("node").bind("mouseover", (event) => {
    const ele = event.target
    makePopper(ele)
    ele.tippy.show()
  })

  cy.elements("node").unbind("mouseout")
  cy.elements("node").bind("mouseout", (event) => {
    const ele = event.target
    ele.tippy.destroy()
  })
}

const Comp: Component<Props> = ({ content }) => {
  onMount(() => {
    createGraph(graphDiv, content())
  })
  return (
    <div ref={graphDiv} class="position-absolute w-full h-full">
      Change Me
    </div>
  )
}

export default Comp

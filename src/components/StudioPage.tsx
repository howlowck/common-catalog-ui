import { Accessor, Component, createMemo, createSignal } from "solid-js"
import styles from "./styles.module.css"
import CodeBracket from "../assets/icons-outline/code-bracket.svg?component"
import ChartPie from "../assets/icons-outline/chart-pie.svg?component"
import coffeeshop from "../assets/examples/coffeeshop.catalog.json"
import Bolt from "../assets/icons-outline/bolt.svg?component"
import CodeEditor from "./CodeEditor"
import GraphViewer from "./GraphViewer"

const centerIconStyle = { width: "100%", height: "100%", padding: "7" }
const localStorageContentName = "common-catalog-editor-content"

type Props = {
  isDarkMode: Accessor<boolean>
}

const Comp: Component<Props> = (props) => {
  const [showCode, setShowCode] = createSignal(true)
  const [showGraph, setShowGraph] = createSignal(true)
  const [showActions, setShowActions] = createSignal(false)

  const [content, setContent] = createSignal(
    localStorage.getItem(localStorageContentName) ||
      JSON.stringify(coffeeshop, null, 4)
  )

  return (
    <div class="h-full d-flex flex-row">
      <div
        class={`${styles.sideBar} left-sbar w-50 h-full d-flex align-items-center flex-column`}
      >
        <button
          title="Code"
          type="button"
          class="btn btn-square btn-lg m-5"
          classList={{ "btn-primary": showCode() }}
          onClick={() => setShowCode(!showCode())}
        >
          <CodeBracket style={centerIconStyle} />
        </button>
        <button
          title="Graph"
          type="button"
          class="btn btn-square btn-lg m-5"
          classList={{ "btn-primary": showGraph() }}
          onClick={() => setShowGraph(!showGraph())}
        >
          <ChartPie style={centerIconStyle} />
        </button>
        <button
          title="Actions"
          type="button"
          class="btn btn-square btn-lg m-5"
          classList={{ "btn-primary": showActions() }}
          onClick={() => setShowActions(!showActions())}
        >
          <Bolt style={centerIconStyle} />
        </button>
      </div>
      <div
        class="flex-fill bg-success position-relative"
        classList={{ "d-none": !showCode() }}
      >
        <CodeEditor
          isDarkMode={props.isDarkMode}
          content={content}
          setContent={setContent}
        ></CodeEditor>
      </div>
      <div
        class="flex-fill position-relative"
        classList={{ "d-none": !showGraph() }}
      >
        <GraphViewer content={content}></GraphViewer>
      </div>
      <div
        class="flex-fill bg-secondary"
        classList={{ "d-none": !showActions() }}
      ></div>
    </div>
  )
}

export default Comp

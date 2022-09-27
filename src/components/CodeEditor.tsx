import {
  Accessor,
  Component,
  createEffect,
  onCleanup,
  onMount,
  Setter,
} from "solid-js"
import schema from "../assets/schema.json"
import * as monaco from "monaco-editor"
import * as monacoAPI from "monaco-editor/esm/vs/editor/editor.api"
import "../useWorkers"

declare const halfmoon: any

let editorDiv: HTMLDivElement
let editor: monaco.editor.IStandaloneCodeEditor

// TODO: abstract this to a service (value is duplicated in StudioPage.tsx)
const localStorageContentName = "common-catalog-editor-content"

console.log("this is run!!")

document.addEventListener(
  "keydown",
  function (e) {
    if (
      e.key === "s" &&
      (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault()
    }
  },
  false
)

const startEditor = (
  el: HTMLDivElement,
  darkMode: boolean,
  content: string,
  setContent: Setter<string>
) => {
  const uri = monaco.Uri.parse("a://b/foo.json")
  const model = monaco.editor.createModel(content, "json", uri)
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    enableSchemaRequest: true,
    validate: true,
    schemas: [
      {
        uri: "http://myserver/foo-schema.json", // id of the first schema
        fileMatch: [uri.toString()], // associate with our model
        schema,
      },
    ],
    allowComments: false,
  })
  editor = monaco.editor.create(el, {
    theme: darkMode ? "vs-dark" : "vs",
    minimap: { enabled: false },
    automaticLayout: true,
    model,
  })
  editor.addCommand(monacoAPI.KeyMod.CtrlCmd | monacoAPI.KeyCode.KeyS, () => {
    const value = editor.getValue()
    localStorage.setItem(localStorageContentName, value)
    setContent(value)
    halfmoon.initStickyAlert({
      content: "Saved to LocalStorage",
      title: "Saved",
      alertType: "alert-success",
      hasDismissButton: true,
      timeShown: 2000,
    })
  })
}

type Props = {
  isDarkMode: Accessor<boolean>
  content: Accessor<string>
  setContent: Setter<string>
}

const Comp: Component<Props> = (props) => {
  onMount(() => {
    startEditor(
      editorDiv,
      props.isDarkMode(),
      props.content(),
      props.setContent
    )
    console.log("editor mounted")
  })
  onCleanup(() => {
    console.log("monoco disposing")
    monaco.editor.getModels().forEach((model) => model.dispose())
    editor.dispose()
  })

  createEffect(() => {
    const isDarkMode = props.isDarkMode()
    editor.updateOptions({ theme: isDarkMode ? "vs-dark" : "vs-light" })
  })

  return <div ref={editorDiv} class="position-absolute w-full h-full"></div>
}

export default Comp

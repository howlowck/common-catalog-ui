import type { Component } from "solid-js"
import { Routes, Route } from "@solidjs/router"
import NavBar from "../NavBar"
import HomePage from "../HomePage"
import DocsPage from "../DocsPage"
import StudioPage from "../StudioPage"

const App: Component = () => {
  return (
    <>
      <NavBar></NavBar>
      <div class="content-wrapper">
        <Routes>
          <Route path="/" component={HomePage} />
          <Route path="/docs" component={DocsPage} />
          <Route path="/studio" component={StudioPage} />
        </Routes>
      </div>
    </>
  )
}

export default App

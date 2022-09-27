import { Component, createEffect, createSignal } from "solid-js"
import { Routes, Route } from "@solidjs/router"
import NavBar from "./NavBar"
import HomePage from "./HomePage"
import DocsPage from "./DocsPage"
import StudioPage from "./StudioPage"

declare const halfmoon: any

const App: Component = () => {
  const [isDarkMode, setIsDarkMode] = createSignal(
    halfmoon.getPreferredMode() === "dark-mode"
  )

  createEffect(() => {
    if (isDarkMode()) {
      document.body.classList.add("dark-mode")
      return
    }
    document.body.classList.remove("dark-mode")
  })

  return (
    <>
      <div class="sticky-alerts"></div>
      <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}></NavBar>
      <div class="content-wrapper">
        <Routes>
          <Route path="/" component={HomePage} />
          <Route path="/docs" component={DocsPage} />
          <Route
            path="/studio"
            element={<StudioPage isDarkMode={isDarkMode} />}
          />
        </Routes>
      </div>
    </>
  )
}

export default App

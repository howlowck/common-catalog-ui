import { Component, createEffect, createMemo, createSignal } from "solid-js"
import { Link, NavLink, useMatch } from "@solidjs/router"
import styles from "./styles.module.css"
import logo from "../../assets/common-catalog.svg?url"
import Moon from "../../assets/icons-outline/moon.svg?component"
import Sun from "../../assets/icons-outline/sun.svg?component"

declare const halfmoon: any

const Comp: Component = (props) => {
  const match = (path: string) => {
    return useMatch(() => path)
  }

  const [isDarkMode, setIsDarkMode] = createSignal(halfmoon.darkModeOn)

  createEffect(() => {
    isDarkMode()
    halfmoon.toggleDarkMode()
  })

  return (
    <nav class="navbar d-flex">
      <NavLink href="/" end={true} class="navbar-brand">
        <img src={logo} alt="logo" />
        Common Catalog
      </NavLink>
      <span class="navbar-text text-monospace">v1.0</span>
      <ul class="navbar-nav d-none d-md-flex justify-content-end flex-grow-1">
        <li class="nav-item" classList={{ active: !!match("/docs")() }}>
          <Link href="/docs" class="nav-link">
            Docs
          </Link>
        </li>
        <li class="nav-item" classList={{ active: !!match("/studio")() }}>
          <Link href="/studio" class="nav-link">
            Studio
          </Link>
        </li>
      </ul>
      <button class="btn p-0 ml-5" onClick={() => setIsDarkMode(!isDarkMode())}>
        {isDarkMode() ? (
          <Moon style={{ stroke: "black", width: "20px", margin: "5px" }} />
        ) : (
          <Sun style={{ stroke: "white", width: "20px", margin: "5px" }} />
        )}
      </button>
      <div class="navbar-content d-md-none ml-auto">
        <div class="dropdown with-arrow">
          <button
            class="btn"
            data-toggle="dropdown"
            type="button"
            id="navbar-dropdown-toggle-btn-1"
          >
            Menu
            <i class="fa fa-angle-down" aria-hidden="true"></i>
          </button>
          <div
            class="dropdown-menu dropdown-menu-right w-200"
            aria-labelledby="navbar-dropdown-toggle-btn-1"
          >
            <NavLink
              href="/docs"
              class="dropdown-item"
              activeClass="text-primary"
            >
              Docs
            </NavLink>
            <NavLink
              href="/studio"
              class="dropdown-item"
              activeClass="text-primary"
            >
              Studio
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Comp

import type { Component } from 'solid-js';
import { Link, NavLink, useMatch } from "@solidjs/router"
import styles from "./styles.module.css";
import logo from '../../assets/common-catalog.svg';

const Comp: Component = (props) => {
  const match = (path: string) => {
    return useMatch(() => path)
  }

  return (
    <nav class="navbar">
      <NavLink href="/" end={true} class="navbar-brand">
        <img src={logo} alt="logo" />
        Common Catalog
      </NavLink>
      <span class="navbar-text text-monospace">v1.0</span>
      <ul class="navbar-nav d-none d-md-flex ml-auto">
        <li class="nav-item" classList={{"active": !!match('/docs')()}}>
        <Link href="/docs" class="nav-link">Docs</Link>
        </li>
        <li class="nav-item" classList={{"active": !!match('/studio')()}}>
        <Link href="/studio" class="nav-link">Studio</Link>
        </li>
      </ul>
      <div class="navbar-content d-md-none ml-auto">
        <div class="dropdown with-arrow">
          <button class="btn" data-toggle="dropdown" type="button" id="navbar-dropdown-toggle-btn-1">
            Menu
            <i class="fa fa-angle-down" aria-hidden="true"></i>
          </button>
          <div class="dropdown-menu dropdown-menu-right w-200" aria-labelledby="navbar-dropdown-toggle-btn-1">
            <NavLink href="/docs" class="dropdown-item" activeClass="text-primary">Docs</NavLink>
            <NavLink href="/studio" class="dropdown-item" activeClass="text-primary">Studio</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Comp;
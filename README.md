# Interactive Navigation Bar — Meridian

A fixed, interactive navigation menu built with React. It changes style on scroll and responds to hover, designed with an instrument-panel visual theme (deep ink background, brass gold accents).

## Features

- **Fixed position** — stays pinned to the top of the viewport across the whole page.
- **Scroll-reactive style** — transparent over the hero section, transitions into a frosted, blurred panel with a shadow once you scroll past it.
- **Scroll progress gauge** — a thin gold line across the top fills as you scroll down the page.
- **Hover-animated indicator** — a brass underline slides between menu items as you hover over them.
- **Responsive** — collapses into a hamburger menu with a full-screen overlay below 760px width.

## Tech Stack

- React (functional components + hooks: `useState`, `useEffect`, `useRef`, `useCallback`)
- Vite (build tool / dev server)
- Plain CSS (scoped via a `<style>` block in the component, no external CSS framework)

## Project Structure

```
my-nav-demo/
├── src/
│   ├── components/
│   │   └── Navbar.jsx     # the navigation bar component
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/hibasoudagar/SCT_WD_01.git
cd SCT_WD_01
npm install
```

Run the dev server:

```bash
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Usage

Import the `Navbar` component and mount it once at the top of your app layout, above your routes, so it persists across every page:

```jsx
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 84 }}>
        {/* page content / routes go here */}
      </main>
    </>
  );
}
```

The `paddingTop` on `<main>` offsets your content so it doesn't render underneath the fixed nav bar.

## Customization

- **Menu items** — edit the `NAV_ITEMS` array at the top of `Navbar.jsx`.
- **Colors** — adjust the CSS custom properties (`--ink`, `--brass`, `--paper`, `--sage`) inside the `<style>` block.
- **Scroll trigger point** — change the `y > 48` threshold in the `handleScroll` function to adjust when the panel transitions to its scrolled state.

## License

This project is open source and available for personal or educational use.

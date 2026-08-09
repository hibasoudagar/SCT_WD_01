import React, { useState, useEffect, useRef, useCallback } from "react";


const NAV_ITEMS = ["Home", "Work", "Studio", "Journal", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const itemRefs = useRef([]);
  const listRef = useRef(null);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 48);
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const moveIndicatorTo = (idx) => {
    const el = itemRefs.current[idx];
    const list = listRef.current;
    if (!el || !list) return;
    const elRect = el.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    setIndicator({
      left: elRect.left - listRect.left,
      width: elRect.width,
      opacity: 1,
    });
  };

  const onItemEnter = (idx) => {
    setHovered(idx);
    moveIndicatorTo(idx);
  };

  const onListLeave = () => {
    setHovered(null);
    setIndicator((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <>
      <style>{`
        :root {
          --ink: #0b2b2c;
          --ink-glass: rgba(9, 34, 35, 0.82);
          --brass: #c9a961;
          --brass-soft: rgba(201, 169, 97, 0.35);
          --paper: #f1ede4;
          --sage: #86a89f;
        }
        * { box-sizing: border-box; }
        body { margin: 0; }

        .mrd-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 26px 40px;
          background: transparent;
          border-bottom: 1px solid transparent;
          transition: background 0.45s ease, padding 0.35s ease,
                      border-color 0.45s ease, box-shadow 0.45s ease;
          font-family: "Helvetica Neue", Arial, sans-serif;
        }
        .mrd-nav.is-scrolled {
          padding: 14px 40px;
          background: var(--ink-glass);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--brass-soft);
          box-shadow: 0 12px 30px -18px rgba(0,0,0,0.6);
        }

        .mrd-gauge {
          position: absolute;
          top: 0; left: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--brass), #e7cf94);
          transition: width 0.1s linear, opacity 0.3s ease;
          opacity: 0;
        }
        .mrd-nav.is-scrolled .mrd-gauge { opacity: 1; }

        .mrd-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--paper);
          text-decoration: none;
          cursor: pointer;
        }
        .mrd-brand svg { flex-shrink: 0; transition: transform 0.6s ease; }
        .mrd-nav.is-scrolled .mrd-brand svg { transform: rotate(-38deg); }
        .mrd-brand-text {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .mrd-list {
          position: relative;
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .mrd-item {
          position: relative;
          padding: 8px 18px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--sage);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s ease, letter-spacing 0.3s ease;
          white-space: nowrap;
        }
        .mrd-item:hover, .mrd-item.is-active { color: var(--paper); letter-spacing: 0.22em; }

        .mrd-indicator {
          position: absolute;
          bottom: -1px;
          height: 2px;
          background: var(--brass);
          border-radius: 2px;
          transition: left 0.32s cubic-bezier(.4,0,.2,1),
                      width 0.32s cubic-bezier(.4,0,.2,1),
                      opacity 0.25s ease;
          box-shadow: 0 0 12px 1px var(--brass-soft);
        }

        .mrd-burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
        }
        .mrd-burger span {
          width: 22px; height: 2px;
          background: var(--paper);
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .mrd-burger.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .mrd-burger.is-open span:nth-child(2) { opacity: 0; }
        .mrd-burger.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .mrd-mobile {
          position: fixed;
          inset: 0;
          top: 0;
          background: var(--ink);
          z-index: 90;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 28px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }
        .mrd-mobile.is-open { opacity: 1; pointer-events: auto; }
        .mrd-mobile a {
          color: var(--paper);
          font-size: 22px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.4s ease, transform 0.4s ease, color 0.3s ease;
        }
        .mrd-mobile.is-open a { opacity: 1; transform: translateY(0); }
        .mrd-mobile a:hover { color: var(--brass); }

        @media (max-width: 760px) {
          .mrd-list { display: none; }
          .mrd-burger { display: flex; }
          .mrd-nav { padding: 20px 24px; }
          .mrd-nav.is-scrolled { padding: 14px 24px; }
        }
      `}</style>

      <nav className={`mrd-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="mrd-gauge" style={{ width: `${progress * 100}%` }} />

        <a className="mrd-brand" href="#top">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#c9a961" strokeWidth="1.4" />
            <path d="M15.5 8.5L10 10L8.5 15.5L14 14L15.5 8.5Z" fill="#c9a961" />
          </svg>
          <span className="mrd-brand-text">NavBar</span>
        </a>

        <ul className="mrd-list" ref={listRef} onMouseLeave={onListLeave}>
          {NAV_ITEMS.map((label, idx) => (
            <li key={label}>
              <a
                href={`#${label.toLowerCase()}`}
                ref={(el) => (itemRefs.current[idx] = el)}
                className={`mrd-item ${hovered === idx ? "is-active" : ""}`}
                onMouseEnter={() => onItemEnter(idx)}
              >
                {label}
              </a>
            </li>
          ))}
          <span
            className="mrd-indicator"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.opacity,
            }}
          />
        </ul>

        <button
          className={`mrd-burger ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mrd-mobile ${menuOpen ? "is-open" : ""}`}>
        {NAV_ITEMS.map((label, idx) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            style={{ transitionDelay: `${idx * 60}ms` }}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
      </div>
    </>
  );
}

export function Demo() {
  return (
    <div style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
      <Navbar />
      <section
        id="top"
        style={{
          height: "100vh",
          background: "linear-gradient(160deg, #0b2b2c 0%, #123f40 60%, #1b524f 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f1ede4",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <div>
          <p style={{ letterSpacing: "0.3em", color: "#c9a961", fontSize: 12, marginBottom: 16 }}>
            SCROLL TO SEE THE PANEL CHANGE
          </p>
          <h1 style={{ fontSize: "clamp(32px,6vw,64px)", margin: 0, fontWeight: 300 }}>
            Welcome!
          </h1>
        </div>
      </section>
      {["Work", "Studio", "Journal", "Contact"].map((label, i) => (
        <section
          key={label}
          id={label.toLowerCase()}
          style={{
            height: "100vh",
            background: i % 2 === 0 ? "#f1ede4" : "#e6ddc9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0b2b2c",
            fontSize: 28,
            fontWeight: 300,
          }}
        >
          {label} section
        </section>
      ))}
    </div>
  );
}

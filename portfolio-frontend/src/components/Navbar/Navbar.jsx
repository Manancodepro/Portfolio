import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import useScrollSpy from "./useScrollSpy";

const links = ["About", "Projects", "Certifications", "Skills", "Contact"];
const sectionIds = links.map((l) => l.toLowerCase());

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef(null);
  const navbarRef = useRef(null);
  const bar1 = useRef(null),
    bar2 = useRef(null),
    bar3 = useRef(null);
  const activeSection = useScrollSpy(sectionIds, 0.3);

  // Darken navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
    
  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { y: -80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.1,
        // clearProps: "all",
      },
    );
  }, []);

  // Mobile menu GSAP
  useEffect(() => {
    if (!bar1.current) return;
    if (menuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { x: "-100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.45, ease: "power3.out" },
      );
      gsap.fromTo(
        mobileMenuRef.current.querySelectorAll(".nav-link"),
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.12,
        },
      );
      gsap.to(bar1.current, { rotation: 45, y: 7, duration: 0.3 });
      gsap.to(bar2.current, { opacity: 0, duration: 0.2 });
      gsap.to(bar3.current, { rotation: -45, y: -7, duration: 0.3 });
    } else {
      gsap.to(mobileMenuRef.current, {
        x: "-100%",
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
      });
      gsap.to(bar1.current, { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(bar2.current, { opacity: 1, duration: 0.2 });
      gsap.to(bar3.current, { rotation: 0, y: 0, duration: 0.3 });
    }
  }, [menuOpen]);

  const scrollTo = (id) => {
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  // Magnetic hover effect on individual links
  const handleLinkHover = (e) => {
    gsap.to(e.currentTarget, {
      y: -3,
      scale: 1.08,
      duration: 0.25,
      ease: "power2.out",
    });
  };
  const handleLinkLeave = (e) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: "elastic.out(1,0.5)",
    });
  };

  return (
    <>
      <nav
        className={`navbar${scrolled ? " navbar-scrolled" : ""}`}
        ref={navbarRef}
      >
        <button
          className="navbar-logo gradient-text"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          MP.
        </button>

        <div className="navbar-links">
          {links.map((l) => (
            <button
              key={l}
              className={`nav-link${activeSection === l.toLowerCase() ? " active" : ""}`}
              onClick={() => scrollTo(l)}
              onMouseEnter={handleLinkHover}
              onMouseLeave={handleLinkLeave}
            >
              {l}
              <span className="nav-link-bg" />
            </button>
          ))}
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span ref={bar1} />
          <span ref={bar2} />
          <span ref={bar3} />
        </button>
      </nav>

      <div
        ref={mobileMenuRef}
        className={`mobile-menu${menuOpen ? " open" : ""}`}
      >
        {links.map((l) => (
          <button
            key={l}
            className={`nav-link${activeSection === l.toLowerCase() ? " active" : ""}`}
            onClick={() => scrollTo(l)}
          >
            {l}
          </button>
        ))}
      </div>
    </>
  );
}

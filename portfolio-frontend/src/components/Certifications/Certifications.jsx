import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Add your real certifications below ─────────────
const CERTS = [
  {
    id: 1,
    icon: "🛠️",
    title: "MERN Stack Development",
    issuer: "Udemy",
    date: "Jan 2025",
    color: "#f97316",
    desc: "Full-stack web development with MongoDB, Express, React, and Node.js. Covered REST APIs, JWT auth, and real-world project building.",
  },
  {
    id: 2,
    icon: "🧠",
    title: "Machine Learning Specialization",
    issuer: "deeplearning.ai / Coursera",
    date: "Sep 2024",
    color: "#06b6d4",
    desc: "Supervised/unsupervised learning, neural networks, and ML best practices taught by Andrew Ng across a 3-course specialization.",
  },
  {
    id: 3,
    icon: "🏆",
    title: "1X NPTEL Certified",
    issuer: "NPTEL",
    date: "May 2024",
    color: "#a78bfa",
    desc: "Successfully completed NPTEL course with excellent performance. Gained in-depth knowledge of core computer science concepts, programming fundamentals, and software engineering best practices.",
  },
  {
    id: 4,
    icon: "📜",
    title: "GeeksforGeeks 160 Days Coding Challenge",
    issuer: "GeeksforGeeks",
    date: "Apr 2024",
    color: "#4ade80",
    desc: "Completed the rigorous 160-day coding challenge on GeeksforGeeks, solving 160+ problems across DSA, algorithms, and data structures. Strengthened problem-solving skills and competitive programming expertise.",
  },
];

function CertModal({ cert, onClose }) {
  const overlayRef = useRef(null);
  useEffect(() => {
    requestAnimationFrame(() => overlayRef.current?.classList.add("visible"));
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="modal-box" style={{ maxWidth: "500px" }}>
        <div className="modal-header">
          <h3
            style={{
              fontFamily: "var(--font-main)",
              fontSize: "1.2rem",
              margin: 0,
            }}
          >
            {cert.title}
          </h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "6rem", marginBottom: "1.5rem" }}>
            {cert.icon}
          </div>
          <div
            style={{
              color: cert.color,
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            {cert.issuer}
          </div>
          <div
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
            }}
          >
            Issued: {cert.date}
          </div>
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
              textAlign: "left",
            }}
          >
            {cert.desc}
          </p>
          <div
            style={{
              border: `2px solid ${cert.color}`,
              borderRadius: "var(--radius-md)",
              padding: "2rem",
              background: `${cert.color}10`,
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                fontSize: "1.3rem",
                fontFamily: "var(--font-main)",
                fontWeight: 700,
                marginBottom: "0.3rem",
              }}
            >
              Certificate of Completion
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Awarded to <strong>Manan Patel</strong>
            </div>
          </div>
          <button className="btn-primary" style={{ width: "100%" }}>
            View Certificate ↗
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Certifications() {
  const [active, setActive] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".certs-title", {
        y: 60,
        opacity: 0,
        skewY: 4,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".certs-title", start: "top 85%" },
      });
      gsap.utils.toArray(".cert-card").forEach((card, i) => {
        gsap.from(card, {
          scale: 0.8,
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: card, start: "top 88%" },
          delay: (i % 3) * 0.1,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="certifications" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title certs-title">
            My <span className="gradient-text">Certifications</span>
          </h2>
          <p className="section-subtitle">
            Industry-recognised credentials validating expertise across modern
            technologies.
          </p>
        </div>
        <div className="certs-grid">
          {CERTS.map((c) => (
            <div
              key={c.id}
              className="cert-card"
              onClick={() => setActive(c)}
              style={{ overflow: "hidden" }}
            >
              <div className="cert-icon">{c.icon}</div>
              <div className="cert-title">{c.title}</div>
              <div className="cert-issuer" style={{ color: c.color }}>
                {c.issuer}
              </div>
              <div className="cert-date">{c.date}</div>
            </div>
          ))}
        </div>
      </div>
      {active && <CertModal cert={active} onClose={() => setActive(null)} />}
    </section>
  );
}

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section title — skew reveal on scroll
      gsap.from(".about-section-title", {
        y: 70,
        opacity: 0,
        skewY: 4,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-section-title", start: "top 85%" },
      });

      // Left side — image slides in
      gsap.from(".about-image-wrap", {
        x: -100,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-grid", start: "top 78%" },
      });

      // Right side — text blocks reveal one by one
      gsap.from(".about-text > *", {
        x: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-grid", start: "top 78%" },
      });

      // Stats count-in
      gsap.from(".stat-item", {
        y: 30,
        opacity: 0,
        scale: 0.8,
        duration: 0.7,
        stagger: 0.12,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".about-stats", start: "top 88%" },
      });

      // Orb parallax on scroll
      gsap.to(".about-orb", {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: "#about",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title about-section-title">
            About <span className="gradient-text">Me</span>
          </h2>
        </div>

        <div className="about-grid">
          <div className="about-image-wrap">
            <div
              className="about-orb"
              style={{ top: "-30px", right: "-30px" }}
            />
            <div className="about-avatar">
              <span style={{ position: "relative", zIndex: 1 }}>👨‍💻</span>
            </div>
          </div>

          <div className="about-text">
            <p>
              I'm <strong>Manan Patel</strong>, a passionate Full Stack
              Developer and 3D Web Engineer who loves building cinematic,
              performance-driven digital experiences. I blend creative design
              thinking with engineering precision to craft products that people
              love.
            </p>
            <p>
              My expertise spans the entire stack — from React frontends and
              Node.js APIs to Three.js 3D environments and MongoDB databases. I
              thrive at the intersection of beautiful UI and robust
              architecture.
            </p>
            <p>
              When I'm not coding, I'm exploring the latest in WebGL, procedural
              art, and open-source projects. I believe great software is an art
              form.
            </p>

            <div className="about-stats">
              {[
                { num: "10+", label: "Projects Built" },
                { num: "5+", label: "Certifications" },
                { num: "2+", label: "Years Exp." },
              ].map((s) => (
                <div key={s.label} className="stat-item">
                  <div className="stat-num gradient-text">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    // ─────────────────────────────────────────────────
    //  THREE.JS  ──  Epic 3D Sphere
    // ─────────────────────────────────────────────────
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(parent.clientWidth, parent.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      parent.clientWidth / parent.clientHeight,
      0.1,
      200,
    );
    camera.position.z = 6;

    // ── Ambient + hemisphere light ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const hemi = new THREE.HemisphereLight(0x7c3aed, 0x06b6d4, 0.8);
    scene.add(hemi);

    // ── Outer wireframe icosahedron ──
    const mainGeo = new THREE.IcosahedronGeometry(1.8, 3);
    const mainMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      wireframe: true,
      emissive: 0x5b21b6,
      emissiveIntensity: 1.2,
    });
    const sphere = new THREE.Mesh(mainGeo, mainMat);
    scene.add(sphere);

    // ── Inner glowing solid sphere ──
    const innerGeo = new THREE.SphereGeometry(1.3, 64, 64);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x060620,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.6,
      shininess: 80,
    });
    scene.add(new THREE.Mesh(innerGeo, innerMat));

    // ── Octahedron core (counter-spin) ──
    const octGeo = new THREE.OctahedronGeometry(0.6, 1);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      wireframe: true,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.5,
    });
    const octa = new THREE.Mesh(octGeo, octMat);
    scene.add(octa);

    // ── Helper: glowing torus ring ──
    const makeRing = (radius, tube, color, opacity, rx = 0, ry = 0, rz = 0) => {
      const g = new THREE.TorusGeometry(radius, tube, 16, 200);
      const m = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 1.8,
        transparent: true,
        opacity,
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.rotation.set(rx, ry, rz);
      scene.add(mesh);
      return { mesh, mat: m, geo: g };
    };

    // Only 1 elegant ring — equatorial cyan
    const ring1 = makeRing(2.2, 0.025, 0x06b6d4, 0, Math.PI / 2, 0, 0);

    // ── Orbiting glowing dot on ring 1 ──
    const dotGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const dotMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x06b6d4,
      emissiveIntensity: 3,
    });
    const dot = new THREE.Mesh(dotGeo, dotM`a`t);
    const dotPivot = new THREE.Object3D();
    dot.position.x = 2.2;
    dotPivot.add(dot);
    scene.add(dotPivot);

    // ── Halo particle cloud ──
    const PCOUNT = 350;
    const pPos = new Float32Array(PCOUNT * 3);
    const pCol = new Float32Array(PCOUNT * 3);
    const palette = [
      [0.486, 0.227, 0.929], // purple
      [0.024, 0.714, 0.831], // cyan
      [0.655, 0.545, 0.98], // lavender
    ];
    for (let i = 0; i < PCOUNT; i++) {
      const θ = Math.random() * Math.PI * 2;
      const φ = Math.acos(2 * Math.random() - 1);
      const r = 2.3 + Math.random() * 1.5;
      pPos[i * 3] = r * Math.sin(φ) * Math.cos(θ);
      pPos[i * 3 + 1] = r * Math.sin(φ) * Math.sin(θ);
      pPos[i * 3 + 2] = r * Math.cos(φ);
      const c = palette[i % 3];
      pCol[i * 3] = c[0];
      pCol[i * 3 + 1] = c[1];
      pCol[i * 3 + 2] = c[2];
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Points(pGeo, pMat));

    // ── 3 expanding pulse rings (each at different phases) ──
    const pulseRings = [0, 1, 2].map((i) => {
      const g = new THREE.TorusGeometry(1.8, 0.008, 8, 100);
      const m = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0x7c3aed : i === 1 ? 0x06b6d4 : 0xa78bfa,
        transparent: true,
        opacity: 0,
      });
      const mesh = new THREE.Mesh(g, m);
      scene.add(mesh);
      return { mesh, mat: m, phase: (i / 3) * Math.PI * 2 };
    });

    // ── Moving coloured point lights ──
    const pl1 = new THREE.PointLight(0x7c3aed, 6, 30);
    pl1.position.set(3, 3, 3);
    const pl2 = new THREE.PointLight(0x06b6d4, 5, 30);
    pl2.position.set(-3, -2, 2);
    const pl3 = new THREE.PointLight(0xf59e0b, 3, 20);
    pl3.position.set(0, -3, -2);
    const movingPL = new THREE.PointLight(0xa78bfa, 4, 18);
    scene.add(pl1, pl2, pl3, movingPL);

    // ── Mouse tracking ──
    let mouseX = 0,
      mouseY = 0;
    const onMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    // ── Render loop ──
    let animId;
    const clock = new THREE.Clock();

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();

      // Sphere: lazy-follow mouse
      sphere.rotation.x += (-mouseY * 0.4 - sphere.rotation.x) * 0.04;
      sphere.rotation.y += (mouseX * 0.6 - sphere.rotation.y) * 0.04 + 0.003;
      octa.rotation.x += 0.009;
      octa.rotation.y += 0.007;

      // Rings orbit
      ring1.mesh.rotation.z = t * 0.22;

      // Orbiting dots
      dotPivot.rotation.y = t * 0.65;
      dotPivot.rotation.x = Math.sin(t * 0.3) * 0.35;

      // Moving point light orbit
      movingPL.position.x = Math.sin(t * 0.8) * 3.5;
      movingPL.position.y = Math.cos(t * 0.6) * 3.0;
      movingPL.position.z = Math.cos(t * 0.8) * 3.5;

      // Pulsing light intensities
      pl1.intensity = 5 + 3 * Math.sin(t * 1.4);
      pl2.intensity = 4 + 2.5 * Math.sin(t * 1.1 + 1);
      movingPL.intensity = 3 + 2 * Math.sin(t * 2.1);

      // Expanding pulse rings
      pulseRings.forEach(({ mesh, mat: pm, phase }) => {
        const progress = (Math.sin(t * 0.7 + phase) + 1) / 2; // 0→1
        mesh.scale.setScalar(1 + progress * 0.8);
        pm.opacity = 0.6 * (1 - progress);
      });

      // Inner mat pulse
      innerMat.emissiveIntensity = 0.25 + 0.3 * Math.sin(t * 2);

      // Ring glow pulse
      ring1.mat.emissiveIntensity = 1.5 + 0.8 * Math.sin(t * 1.8);

      renderer.render(scene, camera);
    };
    loop();

    // Resize
    const onResize = () => {
      renderer.setSize(parent.clientWidth, parent.clientHeight);
      camera.aspect = parent.clientWidth / parent.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // ─────────────────────────────────────────────────
    //  GSAP  ──  Hero reveal
    // ─────────────────────────────────────────────────
    const hero = heroRef.current;
    gsap
      .timeline({ delay: 0.4 })
      .to(".hero-eyebrow", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })
      .to(
        ".hero-name",
        { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
        "-=0.4",
      )
      .to(
        ".hero-tagline",
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.4",
      )
      .to(
        ".hero-cta",
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3",
      )
      .to(".scroll-indicator", { opacity: 1, duration: 0.5 }, "-=0.2");

    // ── Apple-style: hero content floats up on scroll ──
    gsap.to(".hero-content", {
      y: -150,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // ── Sphere canvas parallax on scroll ──
    gsap.to(".hero-canvas-wrap", {
      scale: 1.15,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 2,
      },
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const scrollToProjects = () =>
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="hero-canvas-wrap">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>

      <div className="hero-content">
        <div className="hero-eyebrow">
          ✦ Full Stack Developer &amp; 3D Web Engineer
        </div>

        <h1 className="hero-name" ref={nameRef}>
          <span className="name-first">Manan</span>{" "}
          <span className="name-last gradient-text">Patel</span>
        </h1>

        <p className="hero-tagline">
          Crafting immersive digital experiences from code and imagination.
          Where creativity meets engineering precision.
        </p>

        <div className="hero-cta">
          <button className="btn-primary" onClick={scrollToProjects}>
            View My Work →
          </button>
          <button className="btn-outline" onClick={scrollToContact}>
            Get In Touch
          </button>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>SCROLL</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

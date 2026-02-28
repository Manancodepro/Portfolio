import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
    const canvasRef = useRef(null)
    const heroRef = useRef(null)
    const nameRef = useRef(null)

    useEffect(() => {
        // ─────────────────────────────────────────────────
        // THREE.JS  —  Epic 3D Sphere
        // ─────────────────────────────────────────────────
        const canvas = canvasRef.current
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            50,
            canvas.parentElement.clientWidth / canvas.parentElement.clientHeight,
            0.1, 200
        )
        camera.position.z = 5.5

        // ── Main wireframe icosahedron (more sub-divisions) ──
        const geo = new THREE.IcosahedronGeometry(1.7, 3)
        const mat = new THREE.MeshStandardMaterial({
            color: 0x7c3aed,
            wireframe: true,
            emissive: 0x4f1fb5,
            emissiveIntensity: 0.7,
        })
        const sphere = new THREE.Mesh(geo, mat)
        scene.add(sphere)

        // ── Inner transparent sphere ──
        const innerGeo = new THREE.SphereGeometry(1.35, 64, 64)
        const innerMat = new THREE.MeshPhongMaterial({
            color: 0x06b6d4,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.08,
        })
        const innerSphere = new THREE.Mesh(innerGeo, innerMat)
        scene.add(innerSphere)

        // ── Octahedron at core (counter-spins) ──
        const octGeo = new THREE.OctahedronGeometry(0.7, 0)
        const octMat = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            wireframe: true,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.8,
        })
        const octahedron = new THREE.Mesh(octGeo, octMat)
        scene.add(octahedron)

        // ── Ring 1 — horizontal equatorial ──
        const r1g = new THREE.TorusGeometry(2.15, 0.012, 8, 200)
        const r1m = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.55 })
        const ring1 = new THREE.Mesh(r1g, r1m)
        ring1.rotation.x = Math.PI / 2
        scene.add(ring1)

        // ── Ring 2 — tilted ──
        const r2g = new THREE.TorusGeometry(2.5, 0.007, 8, 200)
        const r2m = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.4 })
        const ring2 = new THREE.Mesh(r2g, r2m)
        ring2.rotation.set(Math.PI / 3, 0, Math.PI / 6)
        scene.add(ring2)

        // ── Ring 3 — vertical ──
        const r3g = new THREE.TorusGeometry(1.9, 0.009, 8, 200)
        const r3m = new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.45 })
        const ring3 = new THREE.Mesh(r3g, r3m)
        ring3.rotation.set(0, Math.PI / 2, Math.PI / 5)
        scene.add(ring3)

        // ── Ring 4 — diagonal accent ──
        const r4g = new THREE.TorusGeometry(2.3, 0.005, 8, 200)
        const r4m = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.25 })
        const ring4 = new THREE.Mesh(r4g, r4m)
        ring4.rotation.set(Math.PI / 5, Math.PI / 4, 0)
        scene.add(ring4)

        // ── Orbiting dot ──
        const dotGeo = new THREE.SphereGeometry(0.045, 12, 12)
        const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
        const orbitDot = new THREE.Mesh(dotGeo, dotMat)
        const orbitPivot = new THREE.Object3D()
        orbitPivot.add(orbitDot)
        orbitDot.position.set(2.15, 0, 0)
        scene.add(orbitPivot)

        // ── Pulse ring (expanding and fading) ──
        const pulseRings = []
        for (let i = 0; i < 3; i++) {
            const pg = new THREE.TorusGeometry(1.7, 0.006, 8, 120)
            const pm = new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0 })
            const pr = new THREE.Mesh(pg, pm)
            scene.add(pr)
            pulseRings.push({ mesh: pr, mat: pm, phase: (i / 3) * Math.PI * 2 })
        }

        // ── Halo particles ──
        const PCOUNT = 300
        const pPos = new Float32Array(PCOUNT * 3)
        for (let i = 0; i < PCOUNT; i++) {
            const θ = Math.random() * Math.PI * 2
            const φ = Math.acos(2 * Math.random() - 1)
            const r = 2.1 + Math.random() * 1.4
            pPos[i * 3] = r * Math.sin(φ) * Math.cos(θ)
            pPos[i * 3 + 1] = r * Math.sin(φ) * Math.sin(θ)
            pPos[i * 3 + 2] = r * Math.cos(φ)
        }
        const pGeo = new THREE.BufferGeometry()
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
        const pMat = new THREE.PointsMaterial({
            size: 0.035, color: 0xa78bfa,
            transparent: true, opacity: 0.9,
            blending: THREE.AdditiveBlending, depthWrite: false,
        })
        const haloParticles = new THREE.Points(pGeo, pMat)
        scene.add(haloParticles)

        // ── Lights ──
        scene.add(new THREE.AmbientLight(0xffffff, 0.35))
        const pl1 = new THREE.PointLight(0x7c3aed, 5, 25); pl1.position.set(4, 4, 4)
        const pl2 = new THREE.PointLight(0x06b6d4, 4, 25); pl2.position.set(-4, -2, 3)
        const pl3 = new THREE.PointLight(0xf59e0b, 2, 20); pl3.position.set(0, -4, -2)
        scene.add(pl1, pl2, pl3)

        // ── Orbiting point light ──
        const movingLight = new THREE.PointLight(0xa78bfa, 3, 15)
        scene.add(movingLight)

        // ── Mouse reactive ──
        let tgtRotX = 0, tgtRotY = 0
        const onMouseMove = (e) => {
            tgtRotY = (e.clientX / window.innerWidth - 0.5) * 1.0
            tgtRotX = (e.clientY / window.innerHeight - 0.5) * 0.7
        }
        window.addEventListener('mousemove', onMouseMove)

        // ── Animation loop ──
        let animId
        const clock = new THREE.Clock()
        const animate = () => {
            animId = requestAnimationFrame(animate)
            const t = clock.getElapsedTime()

            // Sphere lazy-follows mouse
            sphere.rotation.x += (tgtRotX * 0.5 - sphere.rotation.x) * 0.04
            sphere.rotation.y += (tgtRotY * 0.5 - sphere.rotation.y) * 0.04 + 0.004
            innerSphere.rotation.y -= 0.003
            octahedron.rotation.x += 0.008
            octahedron.rotation.y += 0.006

            // Rings orbit at own speeds
            ring1.rotation.z = t * 0.25
            ring2.rotation.z = t * 0.18
            ring3.rotation.x = t * 0.12
            ring4.rotation.y = t * 0.08

            // Orbiting dot
            orbitPivot.rotation.y = t * 0.6
            orbitPivot.rotation.x = Math.sin(t * 0.3) * 0.4

            // Orbiting light
            movingLight.position.x = Math.sin(t * 0.7) * 3.5
            movingLight.position.y = Math.cos(t * 0.5) * 3
            movingLight.position.z = Math.cos(t * 0.7) * 3.5

            // Pulse rings — expand outward and fade
            pulseRings.forEach(({ mesh, mat: pm, phase }) => {
                const s = 1 + 0.6 * ((Math.sin(t * 0.8 + phase) + 1) / 2)
                mesh.scale.setScalar(s)
                pm.opacity = 0.35 * (1 - (s - 1) / 0.6)
            })

            // Halo particles drift
            haloParticles.rotation.y = t * 0.04
            haloParticles.rotation.x = t * 0.025

            // Light pulsing
            pl1.intensity = 4 + 2.5 * Math.sin(t * 1.3)
            pl2.intensity = 3 + 2 * Math.sin(t * 1.1 + 1)
            movingLight.intensity = 2 + 1.5 * Math.sin(t * 2)

            innerMat.opacity = 0.06 + 0.06 * Math.sin(t * 2.2)

            renderer.render(scene, camera)
        }
        animate()

        const handleResize = () => {
            const w = canvas.parentElement.clientWidth
            const h = canvas.parentElement.clientHeight
            renderer.setSize(w, h)
            camera.aspect = w / h
            camera.updateProjectionMatrix()
        }
        window.addEventListener('resize', handleResize)

        // ─────────────────────────────────────────────────
        // GSAP  —  Hero reveal (name is ALWAYS visible,
        //          just fades in on load once)
        // ─────────────────────────────────────────────────
        const hero = heroRef.current
        const tl = gsap.timeline({ delay: 0.2 })
        tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .to('.hero-name', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
            .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3')
            .to('.hero-cta', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
            .to('.scroll-indicator', { opacity: 1, duration: 0.6 }, '-=0.1')

        // ── Scroll parallax on hero content ──────────────
        gsap.to('.hero-content', {
            y: -120,
            ease: 'none',
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        })

        // ── Hero scale-fade on scroll ─────────────────────
        gsap.to('.hero-name', {
            scale: 0.85,
            opacity: 0.3,
            ease: 'none',
            scrollTrigger: {
                trigger: hero,
                start: 'center top',
                end: 'bottom top',
                scrub: 1.5,
            },
        })

        // ── Hover: sweep gradient animation across name ───
        const nameEl = nameRef.current
        const onNameEnter = () => {
            gsap.to(nameEl, {
                backgroundSize: '300% auto',
                duration: 0.5,
                ease: 'power2.out',
            })
            nameEl.classList.add('name-hovered')
        }
        const onNameLeave = () => {
            nameEl.classList.remove('name-hovered')
            // Let the CSS animation handle the gradient sweep-out
        }
        if (nameEl) {
            nameEl.addEventListener('mouseenter', onNameEnter)
            nameEl.addEventListener('mouseleave', onNameLeave)
        }

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', onMouseMove)
            if (nameEl) {
                nameEl.removeEventListener('mouseenter', onNameEnter)
                nameEl.removeEventListener('mouseleave', onNameLeave)
            }
            ;[geo, mat, innerGeo, innerMat, octGeo, octMat,
                r1g, r1m, r2g, r2m, r3g, r3m, r4g, r4m,
                dotGeo, dotMat, pGeo, pMat,
                ...pulseRings.map(p => p.mesh.geometry),
                ...pulseRings.map(p => p.mat),
            ].forEach(o => o?.dispose?.())
            renderer.dispose()
        }
    }, [])

    const scrollToProjects = () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })

    return (
        <section id="hero" className="hero" ref={heroRef}>
            <div className="hero-canvas-wrap">
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            </div>

            <div className="hero-content">
                <div className="hero-eyebrow">
                    ✦ Full Stack Developer &amp; 3D Web Engineer
                </div>

                <h1 className="hero-name" ref={nameRef} style={{ opacity: 0, transform: 'translateY(30px)' }}>
                    <span className="name-first">Manan</span>
                    {' '}
                    <span className="name-last gradient-text">Patel</span>
                </h1>

                <p className="hero-tagline" style={{ opacity: 0, transform: 'translateY(20px)' }}>
                    Crafting immersive digital experiences from code and imagination.
                    Where creativity meets engineering precision.
                </p>

                <div className="hero-cta" style={{ opacity: 0, transform: 'translateY(20px)' }}>
                    <button className="btn-primary" onClick={scrollToProjects}>View My Work →</button>
                    <button className="btn-outline" onClick={scrollToContact}>Get In Touch</button>
                </div>
            </div>

            <div className="scroll-indicator" style={{ opacity: 0 }}>
                <span>SCROLL</span>
                <div className="scroll-line" />
            </div>
        </section>
    )
}

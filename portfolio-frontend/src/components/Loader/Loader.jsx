import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import './Loader.css'

export default function Loader({ onComplete }) {
    const canvasRef = useRef(null)
    const progressRef = useRef(null)
    const percentRef = useRef(null)
    const logoRef = useRef(null)
    const taglineRef = useRef(null)
    const progressWrapRef = useRef(null)
    const wrapperRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(window.innerWidth, window.innerHeight)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 4

        // ── Galaxy particles ──────────────────────────────
        const count = 6000
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const colorA = new THREE.Color('#7c3aed')
        const colorB = new THREE.Color('#06b6d4')

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const radius = Math.random() * 5 + 0.5
            const spinAngle = radius * 3
            const branchAngle = ((i % 3) / 3) * Math.PI * 2
            const rand = (Math.random() - 0.5) * 0.8 * Math.pow(Math.random(), 3)
            const randY = (Math.random() - 0.5) * 0.8 * Math.pow(Math.random(), 3)
            const randZ = (Math.random() - 0.5) * 0.8 * Math.pow(Math.random(), 3)

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + rand
            positions[i3 + 1] = randY
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randZ

            const mixedColor = colorA.clone()
            mixedColor.lerp(colorB, radius / 6)
            colors[i3] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b
        }

        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        const mat = new THREE.PointsMaterial({
            size: 0.02,
            sizeAttenuation: true,
            depthWrite: false,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
        })

        const galaxy = new THREE.Points(geo, mat)
        scene.add(galaxy)

        let animFrameId
        const animate = () => {
            animFrameId = requestAnimationFrame(animate)
            galaxy.rotation.y += 0.003
            renderer.render(scene, camera)
        }
        animate()

        // ── GSAP timeline ─────────────────────────────────
        let progress = 0
        const tl = gsap.timeline()

        tl.to(logoRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.5)
            .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1)
            .to(progressWrapRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.3)

        // Progress increment
        const interval = setInterval(() => {
            progress += Math.random() * 4 + 1
            if (progress >= 100) {
                progress = 100
                clearInterval(interval)

                if (progressRef.current) progressRef.current.style.width = '100%'
                if (percentRef.current) percentRef.current.textContent = '100%'

                // Outro
                setTimeout(() => {
                    cancelAnimationFrame(animFrameId)
                    gsap.to(wrapperRef.current, {
                        opacity: 0, scale: 1.05, duration: 0.8, ease: 'power2.in',
                        onComplete: () => {
                            if (onComplete) onComplete()
                        }
                    })
                }, 600)
                return
            }
            const clamped = Math.min(Math.floor(progress), 100)
            if (progressRef.current) progressRef.current.style.width = `${clamped}%`
            if (percentRef.current) percentRef.current.textContent = `${clamped}%`
        }, 60)

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight)
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
        }
        window.addEventListener('resize', handleResize)

        return () => {
            clearInterval(interval)
            cancelAnimationFrame(animFrameId)
            window.removeEventListener('resize', handleResize)
            renderer.dispose()
            geo.dispose()
            mat.dispose()
        }
    }, [onComplete])

    return (
        <div ref={wrapperRef} className="loader-wrapper">
            <canvas ref={canvasRef} className="loader-canvas" />
            <div className="loader-content">
                <div ref={logoRef} className="loader-logo gradient-text" style={{ transform: 'translateY(30px)' }}>
                    MP
                </div>
                <div ref={taglineRef} className="loader-tagline" style={{ transform: 'translateY(20px)' }}>
                    Initializing Experience...
                </div>
                <div ref={progressWrapRef} className="loader-progress-wrap">
                    <div className="loader-progress-label">
                        <span>Loading</span>
                        <span ref={percentRef}>0%</span>
                    </div>
                    <div className="loader-progress-track">
                        <div ref={progressRef} className="loader-progress-bar" />
                    </div>
                </div>
            </div>
        </div>
    )
}

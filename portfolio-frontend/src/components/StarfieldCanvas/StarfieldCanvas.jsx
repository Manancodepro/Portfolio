import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function StarfieldCanvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const isMobile = window.innerWidth < 768

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        renderer.setSize(window.innerWidth, window.innerHeight)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
        camera.position.z = 600

        // ── Star layers ───────────────────────────────────
        // Mobile: 2000 total; Desktop: 5500 total
        const layers = isMobile
            ? [
                { count: 900, spread: 2000, size: 1.2 },
                { count: 700, spread: 1800, size: 0.8 },
                { count: 400, spread: 1600, size: 0.5 },
            ]
            : [
                { count: 2500, spread: 2000, size: 1.2 },
                { count: 1800, spread: 1800, size: 0.8 },
                { count: 1200, spread: 1600, size: 0.5 },
            ]

        const starGroups = layers.map(({ count, spread, size }) => {
            const positions = new Float32Array(count * 3)
            const phases = new Float32Array(count) // per-star twinkling phase

            for (let i = 0; i < count; i++) {
                positions[i * 3] = (Math.random() - 0.5) * spread
                positions[i * 3 + 1] = (Math.random() - 0.5) * spread
                positions[i * 3 + 2] = (Math.random() - 0.5) * spread
                phases[i] = Math.random() * Math.PI * 2
            }

            const geo = new THREE.BufferGeometry()
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

            const mat = new THREE.PointsMaterial({
                size,
                sizeAttenuation: true,
                color: 0xffffff,
                transparent: true,
                opacity: 0.75,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            })

            const pts = new THREE.Points(geo, mat)
            scene.add(pts)
            return { pts, geo, mat, phases, count }
        })

        // ── Shooting star setup ───────────────────────────
        let shootingStarMesh = null
        let shootingStarProgress = 0
        let isShootingStarActive = false
        let shootingStarStart = new THREE.Vector3()
        let shootingStarEnd = new THREE.Vector3()

        const spawnShootingStar = () => {
            if (isShootingStarActive) return

            // Random start from top or left edge
            const side = Math.random() < 0.5 ? 'top' : 'left'
            if (side === 'top') {
                shootingStarStart.set(
                    (Math.random() - 0.5) * 2000,
                    800,
                    (Math.random() - 0.3) * 300
                )
                shootingStarEnd.set(
                    shootingStarStart.x + (Math.random() - 0.5) * 1000,
                    -800,
                    shootingStarStart.z
                )
            } else {
                shootingStarStart.set(
                    -1200,
                    (Math.random() - 0.5) * 1200,
                    (Math.random() - 0.3) * 300
                )
                shootingStarEnd.set(
                    1200,
                    shootingStarStart.y - Math.random() * 400,
                    shootingStarStart.z
                )
            }

            const points = [shootingStarStart.clone(), shootingStarStart.clone()]
            const geo = new THREE.BufferGeometry().setFromPoints(points)
            const mat = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending,
                linewidth: 2,
            })
            shootingStarMesh = new THREE.Line(geo, mat)
            scene.add(shootingStarMesh)
            isShootingStarActive = true
            shootingStarProgress = 0
        }

        // Spawn first shooting star after 4s, then every 4-6s
        let shootingStarTimeout = setTimeout(function scheduleNext() {
            spawnShootingStar()
            shootingStarTimeout = setTimeout(scheduleNext, 4000 + Math.random() * 2000)
        }, 4000)

        // ── Mouse tracking ────────────────────────────────
        let targetX = 0, targetY = 0
        const handleMouseMove = (e) => {
            targetX = (e.clientX / window.innerWidth - 0.5) * 2
            targetY = (e.clientY / window.innerHeight - 0.5) * 2
        }
        window.addEventListener('mousemove', handleMouseMove)

        // ── Animation loop ────────────────────────────────
        let animId
        const clock = new THREE.Clock()

        const animate = () => {
            animId = requestAnimationFrame(animate)
            const t = clock.getElapsedTime()
            const delta = clock.getDelta ? 0.016 : 0.016

            // Camera parallax (smoother than moving star groups)
            camera.position.x += (targetX * 40 - camera.position.x) * 0.03
            camera.position.y += (-targetY * 30 - camera.position.y) * 0.03

            // Slow star rotation + per-star twinkling via opacity
            starGroups.forEach(({ pts, mat: sMat, phases, count }, li) => {
                pts.rotation.y = t * (0.005 + li * 0.003)
                pts.rotation.x = t * (0.003 + li * 0.002)

                // Twinkling: modulate opacity using sin
                sMat.opacity = 0.5 + 0.3 * Math.sin(t * 1.5 + phases[0])
            })

            // Shooting star animation
            if (isShootingStarActive && shootingStarMesh) {
                shootingStarProgress += 0.012 // ~1.2s to cross at 60fps

                if (shootingStarProgress >= 1) {
                    // Remove shooting star
                    scene.remove(shootingStarMesh)
                    shootingStarMesh.geometry.dispose()
                    shootingStarMesh.material.dispose()
                    shootingStarMesh = null
                    isShootingStarActive = false
                } else {
                    // Move lead point to current progress
                    const head = new THREE.Vector3().lerpVectors(
                        shootingStarStart, shootingStarEnd, shootingStarProgress
                    )
                    // Trail starts slightly behind
                    const tail = new THREE.Vector3().lerpVectors(
                        shootingStarStart, shootingStarEnd,
                        Math.max(0, shootingStarProgress - 0.12)
                    )

                    const positions = new Float32Array([
                        tail.x, tail.y, tail.z,
                        head.x, head.y, head.z,
                    ])
                    shootingStarMesh.geometry.setAttribute(
                        'position',
                        new THREE.BufferAttribute(positions, 3)
                    )
                    shootingStarMesh.geometry.attributes.position.needsUpdate = true

                    // Fade out near end
                    shootingStarMesh.material.opacity =
                        shootingStarProgress < 0.85
                            ? 0.9
                            : 0.9 * (1 - (shootingStarProgress - 0.85) / 0.15)
                }
            }

            renderer.render(scene, camera)
        }
        animate()

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight)
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
        }
        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(animId)
            clearTimeout(shootingStarTimeout)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', handleResize)
            starGroups.forEach(({ geo, mat }) => { geo.dispose(); mat.dispose() })
            if (shootingStarMesh) {
                scene.remove(shootingStarMesh)
                shootingStarMesh.geometry.dispose()
                shootingStarMesh.material.dispose()
            }
            renderer.dispose()
        }
    }, [])

    return (
        <>
            <div className="nebula-overlay" />
            <canvas ref={canvasRef} id="starfield-canvas" />
        </>
    )
}

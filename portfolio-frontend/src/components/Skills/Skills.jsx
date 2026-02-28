import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = {
    'Frontend': {
        emoji: '🎨',
        items: [
            { name: 'React / Next.js', icon: '⚛️', pct: 92, tooltip: 'Hooks, Context, SSR, App Router' },
            { name: 'Three.js / WebGL', icon: '🌐', pct: 80, tooltip: '3D scenes, shaders, particle systems' },
            { name: 'CSS / Tailwind', icon: '💅', pct: 90, tooltip: 'Animations, Grid, Flexbox, responsive' },
            { name: 'TypeScript', icon: '🟦', pct: 85, tooltip: 'Generics, interfaces, strict mode' },
        ]
    },
    'Backend': {
        emoji: '⚙️',
        items: [
            { name: 'Node.js / Express', icon: '🟩', pct: 87, tooltip: 'REST APIs, middleware, streaming' },
            { name: 'REST API Design', icon: '🔌', pct: 90, tooltip: 'Auth, versioning, rate limiting' },
            { name: 'Socket.io', icon: '📡', pct: 82, tooltip: 'Real-time events, rooms, namespaces' },
            { name: 'JWT / Auth', icon: '🔐', pct: 85, tooltip: 'OAuth, refresh tokens, RBAC' },
        ]
    },
    'Databases': {
        emoji: '🗄️',
        items: [
            { name: 'MongoDB', icon: '🍃', pct: 88, tooltip: 'Aggregation pipelines, Mongoose ODM' },
            { name: 'PostgreSQL', icon: '🐘', pct: 78, tooltip: 'Joins, transactions, indexing' },
            { name: 'Redis', icon: '🔴', pct: 72, tooltip: 'Caching, pub/sub, job queues' },
        ]
    },
    'DevOps': {
        emoji: '🚀',
        items: [
            { name: 'Docker', icon: '🐳', pct: 75, tooltip: 'Containerization, Compose, networking' },
            { name: 'AWS', icon: '☁️', pct: 74, tooltip: 'EC2, S3, Lambda, RDS, CloudWatch' },
            { name: 'Git / GitHub', icon: '🔀', pct: 93, tooltip: 'Branching, CI/CD, code review' },
        ]
    },
    '3D & Animation': {
        emoji: '✨',
        items: [
            { name: 'Three.js', icon: '🌐', pct: 80, tooltip: 'Geometries, materials, post-processing' },
            { name: 'GSAP', icon: '🎬', pct: 85, tooltip: 'ScrollTrigger, timelines, morphing' },
            { name: 'Framer Motion', icon: '🎭', pct: 76, tooltip: 'Variants, gestures, layout animations' },
        ]
    },
}

export default function Skills() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Section title reveal
            gsap.from('.skills-section-title', {
                y: 40, opacity: 0, skewY: 3, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: '.skills-section-title', start: 'top 85%', toggleActions: 'play none none none' }
            })

            // Category card reveal
            gsap.from('.skills-category', {
                y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: '.skills-wrapper', start: 'top 80%', toggleActions: 'play none none none' }
            })

            // Animate skill bars (gradient fill)
            document.querySelectorAll('.skill-bar-fill').forEach(bar => {
                const pct = bar.getAttribute('data-pct')
                gsap.fromTo(bar,
                    { width: '0%' },
                    {
                        width: `${pct}%`,
                        duration: 1.4,
                        ease: 'power2.out',
                        scrollTrigger: { trigger: bar, start: 'top 92%', toggleActions: 'play none none none' },
                    }
                )
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section id="skills" className="section" ref={sectionRef}>
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title skills-section-title">
                        Skills &amp; <span className="gradient-text">Expertise</span>
                    </h2>
                    <p className="section-subtitle">A constantly growing toolkit honed through real-world projects and continuous learning.</p>
                </div>
                <div className="skills-wrapper">
                    {Object.entries(SKILLS).map(([cat, { emoji, items }]) => (
                        <div key={cat} className="skills-category">
                            <h3>
                                <span style={{ fontSize: '1.3rem' }}>{emoji}</span>
                                {cat}
                            </h3>
                            {items.map(s => (
                                <div key={s.name} className="skill-item">
                                    <div className="skill-label">
                                        <span data-tooltip={s.tooltip}>
                                            <span className="skill-icon">{s.icon}</span>
                                            {s.name}
                                        </span>
                                        <span className="skill-percent">{s.pct}%</span>
                                    </div>
                                    <div className="skill-bar-track">
                                        <div className="skill-bar-fill" data-pct={s.pct} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

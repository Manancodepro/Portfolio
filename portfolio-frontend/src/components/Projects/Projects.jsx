import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Add your real project details below ────────────
const PROJECTS = [
    {
        id: 1,
        title: 'Real-Time Chat Application',
        desc: 'Full-stack MERN chat app with Socket.io, scheduled messages, file sharing, and real-time typing indicators.',
        longDesc: 'A production-ready real-time chat application built with the MERN stack and Socket.io. Features include scheduled message delivery via BullMQ and Redis queues, secure file sharing, real-time typing indicators, JWT-based authentication with refresh tokens, and MongoDB message persistence. Supports multiple chat rooms with live presence indicators.',
        thumb: '💬',
        thumbBg: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
        tags: ['MERN', 'Socket.io', 'JWT', 'Redis', 'BullMQ'],
        github: '#',
        live: '#',
        accentColor: '#7c3aed',
        shadowColor: 'rgba(124,58,237,0.35)',
    },
    {
        id: 2,
        title: 'HRDC Management System',
        desc: 'Enterprise HR dashboard with admin controls, session scheduling, attendance tracking, email notifications, and RBAC.',
        longDesc: 'A comprehensive Human Resource Development Center management system. Features admin dashboard with Chart.js data visualisations, session scheduling with conflict detection, automated email notifications via Nodemailer, attendance tracking with CSV export, Role-Based Access Control, and analytics on participation trends.',
        thumb: '🏢',
        thumbBg: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
        tags: ['React', 'Node.js', 'MongoDB', 'Chart.js', 'Nodemailer'],
        github: '#',
        live: '#',
        accentColor: '#2563eb',
        shadowColor: 'rgba(37,99,235,0.35)',
    },
    {
        id: 3,
        title: 'Slack Clone',
        desc: 'Real-time messaging application with channels, direct messages, and instant notifications.',
        longDesc: 'A feature-rich Slack clone built with React and Node.js. Supports real-time messaging, channel creation, direct messaging between users, presence indicators, and message threading. Utilizes Socket.io for real-time updates and MongoDB for data persistence.',
        thumb: '💬',
        thumbBg: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
        tags: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
        github: '#',
        live: '#',
        accentColor: '#7c3aed',
        shadowColor: 'rgba(124,58,237,0.35)',
    },
    {
        id: 4,
        title: 'Video Calling Interview Platform',
        desc: 'Interactive platform for conducting technical interviews with real-time video and code collaboration.',
        longDesc: 'A comprehensive video calling interview platform built with React, Node.js, and WebRTC. Features real-time video conferencing, integrated code editor for live coding assessments, screen sharing, meeting recordings, and interview scheduling. Supports multiple interview types and feedback mechanisms.',
        thumb: '📹',
        thumbBg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        tags: ['React', 'WebRTC', 'Node.js', 'Socket.io'],
        github: '#',
        live: '#',
        accentColor: '#f59e0b',
        shadowColor: 'rgba(245,158,11,0.35)',
    },
    {
        id: 5,
        title: 'Hospital Management System',
        desc: 'Comprehensive system for managing hospital operations, patient records, appointments, and billing.',
        longDesc: 'A full-fledged hospital management system built with React and Node.js. Features include patient management, doctor scheduling, appointment booking, electronic health records (EHR), billing system, prescription management, and admin analytics. Implements role-based access control for different user types.',
        thumb: '🏥',
        thumbBg: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
        tags: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
        github: '#',
        live: '#',
        accentColor: '#10b981',
        shadowColor: 'rgba(16,185,129,0.35)',
    },
    {
        id: 6,
        title: 'Your Project Title',
        desc: 'A short one-liner description of what this project does and the problem it solves.',
        longDesc: 'Replace this with a detailed description of your sixth project. Include the key features, your technical decisions, and the impact it had.',
        thumb: '🔗',
        thumbBg: 'linear-gradient(135deg, #f97316 0%, #a855f7 100%)',
        tags: ['Tech1', 'Tech2', 'Tech3', 'Tech4', 'Tech5'],
        github: '#',
        live: '#',
        accentColor: '#f97316',
        shadowColor: 'rgba(249,115,22,0.35)',
    },
]

function ProjectModal({ project, onClose }) {
    const overlayRef = useRef(null)
    useEffect(() => {
        requestAnimationFrame(() => overlayRef.current?.classList.add('visible'))
        const handleKey = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handleKey)
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', handleKey)
            document.body.style.overflow = ''
        }
    }, [onClose])

    return (
        <div ref={overlayRef} className="modal-overlay" onClick={(e) => e.target === overlayRef.current && onClose()}>
            <div className="modal-box">
                <div className="modal-header">
                    <h3 className="section-title" style={{ fontSize: '1.5rem', margin: 0 }}>{project.title}</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="project-thumb" style={{ background: project.thumbBg, marginBottom: '1.5rem', borderRadius: '12px' }}>
                        <span style={{ fontSize: '5rem' }}>{project.thumb}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{project.longDesc}</p>
                    <div className="project-tags" style={{ marginBottom: '1.5rem' }}>
                        {project.tags.map(t => <span key={t} className="tech-badge">{t}</span>)}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href={project.github} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>GitHub ↗</a>
                        <a href={project.live} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>Live Demo ↗</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Projects() {
    const [activeProject, setActiveProject] = useState(null)
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Section title scroll reveal
            gsap.from('.projects-title', {
                y: 60, opacity: 0, skewY: 4, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: '.projects-title', start: 'top 85%' }
            })
            // Cards alternate from left/right
            gsap.utils.toArray('.project-card').forEach((card, i) => {
                gsap.from(card, {
                    x: i % 2 === 0 ? -80 : 80,
                    y: 50,
                    opacity: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: card, start: 'top 85%' },
                    delay: (i % 3) * 0.1,
                })
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    const handleMouseMove = (e, card) => {
        const rect = card.getBoundingClientRect()
        const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -22
        const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * 22
        gsap.to(card, { rotationX: rotX, rotationY: rotY, duration: 0.3, ease: 'power2.out', transformPerspective: 900 })
    }
    const handleMouseLeave = (card) => {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' })
    }

    return (
        <section id="projects" className="section" ref={sectionRef}>
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title projects-title">
                        Featured <span className="gradient-text">Projects</span>
                    </h2>
                    <p className="section-subtitle">Handcrafted digital products that push the boundaries of web experiences.</p>
                </div>
                <div className="projects-grid">
                    {PROJECTS.map((p, i) => (
                        <div
                            key={p.id}
                            className="project-card gradient-border"
                            style={{ '--card-accent': p.accentColor, '--card-shadow': p.shadowColor }}
                            onClick={() => setActiveProject(p)}
                            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                            onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                        >
                            <div className="project-thumb" style={{ background: p.thumbBg }}>
                                <span>{p.thumb}</span>
                            </div>
                            <div className="project-body">
                                <h3 className="project-title">{p.title}</h3>
                                <p className="project-desc">{p.desc}</p>
                                <div className="project-tags">
                                    {p.tags.slice(0, 4).map(t => <span key={t} className="tech-badge">{t}</span>)}
                                </div>
                                <div className="project-links">
                                    <span className="project-link">View Details →</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {activeProject && <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />}
        </section>
    )
}

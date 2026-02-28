export default function Footer() {
    const year = new Date().getFullYear()

    const socials = [
        { icon: '🐙', href: 'https://github.com/', label: 'GitHub' },
        { icon: '💼', href: 'https://linkedin.com/', label: 'LinkedIn' },
        { icon: '🐦', href: 'https://twitter.com/', label: 'Twitter' },
        { icon: '📧', href: 'mailto:manan@example.com', label: 'Email' },
    ]

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-socials">
                    {socials.map(s => (
                        <a key={s.label} href={s.href} className="social-link" aria-label={s.label} target="_blank" rel="noreferrer">
                            {s.icon}
                        </a>
                    ))}
                </div>
                <p className="footer-copy">
                    &copy; {year} Manan Patel &mdash; Crafted with ❤️ &amp; Three.js
                </p>
            </div>
        </footer>
    )
}

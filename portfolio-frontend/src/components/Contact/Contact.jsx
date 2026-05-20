import { useState, useRef } from "react";
import axios from "axios";
import gsap from "gsap";

const INITIAL = { name: "", email: "", message: "" };
const ERRORS_INIT = { name: "", email: "", message: "" };

// API Base URL - Update this when backend is deployed
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState(ERRORS_INIT);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);
  const statusRef = useRef(null);

  const validate = () => {
    const e = { name: "", email: "", message: "" };
    let ok = true;
    if (!form.name.trim()) {
      e.name = "Name is required";
      ok = false;
    }
    if (!form.email.trim()) {
      e.email = "Email is required";
      ok = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "Invalid email address";
      ok = false;
    }
    if (!form.message.trim()) {
      e.message = "Message is required";
      ok = false;
    } else if (form.message.trim().length < 10) {
      e.message = "Message must be at least 10 characters";
      ok = false;
    }
    setErrors(e);
    return ok;
  };

  const showStatus = (type) => {
    setStatus(type);
    requestAnimationFrame(() => {
      statusRef.current?.classList.add("visible");
      gsap.fromTo(
        statusRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
      );
    });
    setTimeout(() => {
      gsap.to(statusRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.4,
        onComplete: () => setStatus(null),
      });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/contact`, form);
      setForm(INITIAL);
      showStatus("success");
    } catch (err) {
      console.error("API Error:", err);
      showStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="contact-wrapper">
          {/* Left info */}
          <div className="contact-info">
            <h2 className="section-title">
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p>
              Have a project in mind, a collaboration idea, or just want to say
              hello? I'd love to hear from you. Let's build something
              extraordinary together.
            </p>
            <div className="contact-details">
              {[
                { icon: "📧", label: "manancodepro1506@gmail.com" },
                { icon: "📍", label: "Anand" },
                { icon: "💼", label: "Open to opportunities" },
              ].map((item) => (
                <div key={item.label} className="contact-item">
                  <span className="contact-item-icon">{item.icon}</span>
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div className="glass-card" style={{ padding: "2.5rem" }}>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-input ${errors.name ? "error" : ""}`}
                  placeholder="Manan Patel"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <div className="field-error">{errors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="manan@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="field-error">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className={`form-textarea ${errors.message ? "error" : ""}`}
                  placeholder="I'd love to collaborate on..."
                  value={form.message}
                  onChange={handleChange}
                />
                {errors.message && (
                  <div className="field-error">{errors.message}</div>
                )}
              </div>

              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message ✈"}
              </button>

              {status && (
                <div
                  ref={statusRef}
                  className={`form-status ${status === "success" ? "success" : "error-status"}`}
                >
                  {status === "success"
                    ? "✓ Message sent! I'll get back to you soon."
                    : "✗ Something went wrong. Please try again."}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

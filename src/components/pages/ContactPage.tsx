"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import {
  Mail,
  Github,
  Linkedin,
  Send,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Instagram,
} from "lucide-react";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";

const socials = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: Github,
    label: "GitHub",
    value: profile.github.replace("https://", ""),
    href: profile.github,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: profile.linkedin.replace("https://", ""),
    href: profile.linkedin,
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: profile.instagram.replace("https://", ""),
    href: profile.instagram,
  },
];

type FormStatus = "idle" | "sending" | "sent" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const containerRef = useStaggerAnimation({ stagger: 0.08 });

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (formData.message.trim().length < MIN_MESSAGE_LENGTH) {
      errors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
    }
    return errors;
  };

  const errors = validate();
  const hasErrors = Object.keys(errors).length > 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ name: true, email: true, message: true });
    if (hasErrors) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", message: "" });
        setTouched({});
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const getFieldStyle = (field: keyof FieldErrors) => {
    const hasError = touched[field] && errors[field];
    return {
      backgroundColor: "var(--input-bg)",
      borderColor: hasError ? "#f44747" : "var(--border-color)",
      color: "var(--editor-fg)",
      transition: "border-color 0.2s ease",
    };
  };

  const handleFieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof FieldErrors) => {
    const hasError = touched[field] && errors[field];
    e.currentTarget.style.borderColor = hasError ? "#f44747" : "var(--focus-border)";
  };

  const handleFieldBlurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof FieldErrors) => {
    handleBlur(field);
    // Re-evaluate after marking touched
    const fieldErrors = validate();
    e.currentTarget.style.borderColor = fieldErrors[field] ? "#f44747" : "var(--border-color)";
  };

  return (
    <div ref={containerRef} className="ds-page ds-page-stack">
      {/* Header */}
      <section data-animate className="ds-page-header">
        <h1 className="ds-page-title">Get In Touch</h1>
        <div className="ds-divider" />
        <p className="ds-page-copy text-[1.12rem]">
          Feel free to reach out for collaborations or just a friendly hello!
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Social Links */}
        <section className="space-y-4">
          <h2 data-animate className="ds-section-title">
            Find me on
          </h2>

          <div className="space-y-3">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  data-animate
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ds-card ds-card-interactive flex items-center gap-3 p-3"
                >
                  <Icon
                    size={18}
                    style={{ color: "var(--accent-color)" }}
                  />
                  <div>
                    <div className="text-base font-medium ds-text-primary">{social.label}</div>
                    <div className="text-base ds-text-muted">{social.value}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Contact Form */}
        <section className="space-y-4">
          <h2 data-animate className="ds-section-title">
            Send a message
          </h2>

          <form data-animate onSubmit={handleSubmit} className="space-y-3">
            {/* Name Field */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-xs flex items-center justify-between"
                style={{ color: "var(--editor-fg)", opacity: 0.6 }}
              >
                <span>Name</span>
                {touched.name && errors.name && (
                  <span
                    className="text-[10px] font-normal"
                    style={{ color: "#f44747", opacity: 1 }}
                  >
                    {errors.name}
                  </span>
                )}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={status === "sending"}
                placeholder="Your name"
                className="ds-input px-3 py-2 text-sm disabled:opacity-50"
                style={getFieldStyle("name")}
                onFocus={(e) => handleFieldFocus(e, "name")}
                onBlur={(e) => handleFieldBlurStyle(e, "name")}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-xs flex items-center justify-between"
                style={{ color: "var(--editor-fg)", opacity: 0.6 }}
              >
                <span>Email</span>
                {touched.email && errors.email && (
                  <span
                    className="text-[10px] font-normal"
                    style={{ color: "#f44747", opacity: 1 }}
                  >
                    {errors.email}
                  </span>
                )}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={status === "sending"}
                placeholder="your@email.com"
                className="ds-input px-3 py-2 text-sm disabled:opacity-50"
                style={getFieldStyle("email")}
                onFocus={(e) => handleFieldFocus(e, "email")}
                onBlur={(e) => handleFieldBlurStyle(e, "email")}
              />
            </div>

            {/* Message Field */}
            <div className="space-y-1">
              <label
                htmlFor="message"
                className="text-xs flex items-center justify-between"
                style={{ color: "var(--editor-fg)", opacity: 0.6 }}
              >
                <span>Message</span>
                <span
                  className="text-[10px]"
                  style={{
                    color:
                      touched.message && errors.message
                        ? "#f44747"
                        : "var(--editor-fg)",
                    opacity: touched.message && errors.message ? 1 : 0.4,
                  }}
                >
                  {formData.message.trim().length}/{MIN_MESSAGE_LENGTH} min
                </span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                disabled={status === "sending"}
                placeholder="Write your message here..."
                className="ds-input px-3 py-2 text-sm resize-none disabled:opacity-50"
                style={getFieldStyle("message")}
                onFocus={(e) => handleFieldFocus(e, "message")}
                onBlur={(e) => handleFieldBlurStyle(e, "message")}
              />
              {touched.message && errors.message && (
                <p
                  className="text-[10px]"
                  style={{ color: "#f44747" }}
                >
                  {errors.message}
                </p>
              )}
            </div>

            {/* Success */}
            {status === "sent" && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-sm text-[12px]"
                style={{
                  backgroundColor: "rgba(78, 201, 176, 0.1)",
                  color: "#4ec9b0",
                }}
              >
                <CheckCircle2 size={14} />
                Message sent successfully! I&apos;ll reply to your email soon
                🎉
              </div>
            )}

            {/* Error */}
            {status === "error" && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-sm text-[12px]"
                style={{
                  backgroundColor: "rgba(244, 71, 71, 0.1)",
                  color: "#f44747",
                }}
              >
                <AlertTriangle size={14} />
                {errorMsg ||
                  "Failed to send. Please try again or email me directly."}
              </div>
            )}

            <button
              type="submit"
              disabled={
                status === "sending" ||
                status === "sent" ||
                hasErrors
              }
              className="ds-btn ds-btn-primary disabled:opacity-40"
            >
              {status === "sending" ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : status === "sent" ? (
                <>
                  <CheckCircle2 size={14} />
                  Sent!
                </>
              ) : (
                <>
                  <Send size={14} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

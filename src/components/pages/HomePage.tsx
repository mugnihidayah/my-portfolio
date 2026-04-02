"use client";

import { useApp } from "@/context/AppContext";
import { profile } from "@/data/profile";
import { about } from "@/data/about";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import {
  ArrowRight,
  Atom,
  Bot,
  Brain,
  Code2,
  Sparkles,
  Folder,
  ExternalLink,
  Github as GithubIcon,
  Terminal,
  User,
  Briefcase,
  Mail,
  Rocket,
  Zap,
  GraduationCap,
  Award,
} from "lucide-react";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { techIconMap } from "@/components/icons/TechIcons";

const typingRoles = profile.roles;

const highlights = [
  {
    icon: Bot,
    title: "AI Engineering",
    description:
      "Building production-minded AI applications, APIs, orchestration flows, and retrieval systems that are ready for real use.",
  },
  {
    icon: Brain,
    title: "Data Science",
    description:
      "Using analytics, experimentation, model evaluation, and predictive thinking to turn data into useful decisions.",
  },
  {
    icon: Atom,
    title: "Applied ML Systems",
    description:
      "Connecting machine learning, product thinking, and backend delivery into systems people can actually use.",
  },
];

const roleTrackCards = [
  {
    icon: Bot,
    title: "AI Engineer",
    description:
      "Best fit for teams that need LLM apps, RAG systems, backend APIs, agent workflows, and end-to-end AI delivery.",
  },
  {
    icon: Brain,
    title: "Data Scientist",
    description:
      "Best fit for work involving analytics, experimentation, model development, evaluation, and data-driven problem solving.",
  },
];

const featuredByFlag = projects.filter((p) => p.featured);
const featuredProjects = featuredByFlag.length >= 3
  ? featuredByFlag.slice(0, 3)
  : projects.slice(0, 3);
const techStack = skills.filter((s) => techIconMap[s.icon]);

const quickNavItems = [
  {
    icon: Folder,
    label: "View Projects",
    description: "Browse my project portfolio",
    fileId: "projects",
  },
  {
    icon: User,
    label: "About Me",
    description: "Learn about my background",
    fileId: "about",
  },
  {
    icon: Briefcase,
    label: "Experience",
    description: "View my work history",
    fileId: "experience",
  },
  {
    icon: Code2,
    label: "Skills",
    description: "Technologies I work with",
    fileId: "skills",
  },
  {
    icon: Mail,
    label: "Contact",
    description: "Send me a message",
    fileId: "contact",
  },
];

export default function HomePage() {
  const { openFile, toggleTerminal } = useApp();
  const containerRef = useStaggerAnimation({ stagger: 0.08 });
  const { displayText, isTyping } = useTypingAnimation({
    texts: typingRoles,
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseAfterTyping: 2500,
  });

  return (
    <div ref={containerRef} className="ds-page ds-page-stack">
      {/* Hero Section */}
      <section data-animate className="ds-page-header pt-8 relative flex flex-col justify-center">
        <div className="flex flex-col items-start space-y-4 w-full">
          <div className="ds-eyebrow">
            <Sparkles size={16} />
            <span>{profile.status}</span>
          </div>

          <div className="space-y-3 min-w-0 w-full">
            <h1 className="ds-hero-title wrap-break-word">
              Hi, I&apos;m <span className="ds-text-accent">{profile.name}</span>
            </h1>
            <p className="text-2xl md:text-[2rem] ds-text-secondary leading-tight">
              {displayText}
              <span
                className="inline-block w-0.5 h-[1.1em] ml-0.5 align-middle"
                style={{
                  backgroundColor: "var(--accent-color)",
                  animation: isTyping ? "none" : "blink 1s step-end infinite",
                  opacity: isTyping ? 1 : undefined,
                }}
              />
            </p>
            <p className="ds-page-copy text-[1.05rem] xl:text-[1.12rem] wrap-break-word max-w-2xl">
              {profile.tagline}
            </p>
          </div>

          {/* Specialization Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {profile.specializations.map((spec) => (
              <span key={spec} className="ds-chip text-[12px] md:text-[13px]">
                {spec}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 pt-3">
            <button
              type="button"
              onClick={() => openFile("projects")}
              className="ds-btn ds-btn-primary"
            >
              View Projects
              <ArrowRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => openFile("contact")}
              className="ds-btn ds-btn-secondary"
            >
              Contact Me
            </button>
          </div>
        </div>
      </section>

      {/* Quick Intro */}
      <section data-animate className="ds-section-stack">
        <div className="ds-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-sm flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--active-bg)" }}
            >
              <User size={24} style={{ color: "var(--accent-color)" }} />
            </div>
            <div className="min-w-0">
              <h3 className="ds-subsection-title text-base">
                {profile.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {profile.roles.map((role) => (
                  <RoleBadge key={role} role={role} />
                ))}
                <span className="text-sm ds-text-muted">{profile.location}</span>
              </div>
            </div>
          </div>

          <p className="text-base leading-relaxed ds-text-secondary">
            {about.bio[0]}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm ds-text-muted">
              <GraduationCap size={13} className="shrink-0" />
              <span>
                {profile.education.degree}, {profile.education.university}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm ds-text-muted">
              <Award size={13} className="shrink-0" />
              <span>{about.certifications.length} Certifications</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openFile("about")}
            className="ds-inline-action text-sm cursor-pointer"
          >
            Read more about me
            <ArrowRight size={11} />
          </button>
        </div>
      </section>

      {/* Role Fit */}
      <section className="ds-section-stack">
        <div data-animate className="ds-section-header">
          <h2 className="ds-section-title">Where I Fit Best</h2>
          <span className="ds-panel-hint">
            Clear signals for both recruiter tracks
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 min-w-0">
          {roleTrackCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                data-animate
                className="ds-card ds-card-lift p-5 space-y-3 min-w-0"
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} style={{ color: "var(--accent-color)" }} />
                  <h3 className="ds-subsection-title text-base">
                    {item.title}
                  </h3>
                </div>
                <p className="text-base leading-relaxed ds-text-secondary">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* What I Do */}
      <section className="ds-section-stack">
        <h2 data-animate className="ds-section-title">
          What I Do
        </h2>
        <div className="grid gap-4 md:grid-cols-3 min-w-0">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                data-animate
                className="ds-card ds-card-lift p-5 space-y-3 min-w-0"
              >
                <Icon size={28} style={{ color: "var(--accent-color)" }} />
                <h3 className="ds-subsection-title text-base">{item.title}</h3>
                <p className="text-base leading-relaxed wrap-break-word ds-text-secondary">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="ds-section-stack">
        <div data-animate className="flex items-center gap-2">
          <Zap size={18} style={{ color: "var(--accent-color)" }} />
          <h2 className="ds-section-title">Why Work With Me</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3 min-w-0">
          {profile.valueProps.map((prop, i) => (
            <div
              key={prop.title}
              data-animate
              className="ds-card p-5 space-y-3 min-w-0"
            >
              <div 
                className="font-mono block" 
                style={{ color: "var(--accent-color)", fontSize: "28px", lineHeight: 1 }}
              >
                0{i + 1}
              </div>
              <h3 className="ds-subsection-title text-base">{prop.title}</h3>
              <p className="text-base leading-relaxed ds-text-secondary">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="ds-section-stack">
        <div data-animate className="ds-section-header">
          <h2 className="ds-section-title">Featured Projects</h2>
          <button
            type="button"
            onClick={() => openFile("projects")}
            className="ds-inline-action cursor-pointer"
          >
            View All
            <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 min-w-0">
          {featuredProjects.map((project) => (
            <article
              key={project.title}
              data-animate
              className="ds-card ds-card-lift p-4 space-y-3 min-w-0"
            >
              <button
                type="button"
                onClick={() => openFile(`project:${project.slug}`)}
                className="ds-card-action space-y-3"
                aria-label={`Open project details for ${project.title}`}
              >
                <div className="flex items-center gap-2">
                  <Folder size={16} style={{ color: "var(--accent-color)" }} />
                  <h3 className="ds-subsection-title text-base truncate">
                    {project.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {project.domains.map((domain) => (
                    <DomainBadge key={`${project.slug}-${domain}`} domain={domain} />
                  ))}
                </div>

                <p className="text-base leading-relaxed line-clamp-2 ds-text-secondary">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span key={tech} className="ds-tag">
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="ds-tag">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>
              </button>

              <div className="flex items-center gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    className="ds-inline-action ds-inline-action-muted"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon size={12} />
                    <span>Code</span>
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    className="ds-inline-action"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={12} />
                    <span>Demo</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => openFile(`project:${project.slug}`)}
                  className="ds-inline-action ml-auto cursor-pointer"
                  aria-label={`Open project details for ${project.title}`}
                >
                  Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <section className="ds-section-stack">
        <div data-animate className="ds-section-header">
          <h2 className="ds-section-title">Tech Stack</h2>
          <button
            type="button"
            onClick={() => openFile("skills")}
            className="ds-inline-action cursor-pointer"
          >
            View All
            <ArrowRight size={12} />
          </button>
        </div>
        <div
          data-animate
          className="relative overflow-hidden w-full max-w-full"
          style={{
            contain: "inline-size",
            maskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div
            className="flex min-w-max gap-3 will-change-transform"
            style={{ animation: "marquee-scroll 30s linear infinite" }}
          >
            {[...techStack, ...techStack].map((skill, i) => {
              const IconComponent = techIconMap[skill.icon];
              return (
                <div
                  key={`${skill.name}-${i}`}
                  className="ds-tag-bordered shrink-0"
                >
                  <IconComponent size={16} />
                  <span className="text-sm whitespace-nowrap">
                    {skill.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Currently */}
      <section className="ds-section-stack">
        <h2 data-animate className="ds-section-title">
          <Rocket size={18} style={{ color: "var(--accent-color)" }} />
          Currently
        </h2>
        <div data-animate className="ds-card p-4">
          <div className="space-y-2">
            {profile.currentlyItems.map((item) => (
              <div
                key={item.text}
                className="flex items-start gap-1.5 text-sm"
              >
                <span
                  className="select-none"
                  style={{ color: "var(--editor-line-number)" }}
                >
                  {"//"}
                </span>
                <span>
                  <span>{item.emoji}</span>
                  <span className="ml-1.5 ds-text-secondary">{item.text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="ds-section-stack">
        <h2 data-animate className="ds-section-title">
          Get Started
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 min-w-0">
          {quickNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                data-animate
                onClick={() => openFile(item.fileId)}
                className="ds-card ds-card-interactive p-4 text-left space-y-2 min-w-0"
              >
                <Icon size={20} style={{ color: "var(--accent-color)" }} />
                <div>
                  <div className="text-base font-medium ds-text-primary">
                    {item.label}
                  </div>
                  <div className="text-base ds-text-muted">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
          <button
            type="button"
            data-animate
            onClick={toggleTerminal}
            className="ds-card ds-card-interactive p-4 text-left space-y-2 min-w-0"
          >
            <Terminal size={20} style={{ color: "var(--accent-color)" }} />
            <div>
              <div className="text-base font-medium ds-text-primary">
                Open Terminal
              </div>
              <div className="text-base ds-text-muted">
                Try interactive commands
              </div>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}

function DomainBadge({ domain }: { domain: string }) {
  let bgColor = "rgba(0, 122, 204, 0.12)";
  let fgColor = "var(--accent-color)";

  if (domain === "Computer Vision") {
    bgColor = "rgba(78, 201, 176, 0.12)";
    fgColor = "#4ec9b0";
  } else if (domain === "Data Analytics") {
    bgColor = "rgba(206, 145, 120, 0.12)";
    fgColor = "#ce9178";
  }

  return (
    <span
      className="ds-badge shrink-0 text-[11px]"
      style={{
        backgroundColor: bgColor,
        color: fgColor,
      }}
    >
      {domain}
    </span>
  );
}

function RoleBadge({ role }: { role: (typeof profile.roles)[number] }) {
  const isAiEngineer = role === "AI Engineer";

  return (
    <span
      className="ds-badge shrink-0"
      style={{
        backgroundColor: isAiEngineer
          ? "rgba(0, 122, 204, 0.12)"
          : "rgba(78, 201, 176, 0.12)",
        color: isAiEngineer ? "var(--accent-color)" : "#4ec9b0",
      }}
    >
      {role}
    </span>
  );
}

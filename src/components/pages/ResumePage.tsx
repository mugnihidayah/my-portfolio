"use client";

import { about } from "@/data/about";
import { profile } from "@/data/profile";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import {
  Award,
  Briefcase,
  Code2,
  Download,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Target,
} from "lucide-react";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";

function topSkills(limit: number) {
  return [...skills]
    .sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export default function ResumePage() {
  const containerRef = useStaggerAnimation({ stagger: 0.08 });
  const resumeUrl = "/resume.pdf";
  const featuredProjects = projects.filter((project) => project.featured);
  const strongestTools = topSkills(6);
  const roleStrengths = [
    {
      role: "AI Engineer",
      points: [
        "Build LLM apps, RAG systems, APIs, orchestration flows, and product-minded AI backends.",
        "Comfortable owning the path from prototype logic into deployable application behavior.",
        "Think in terms of reliability, architecture, evaluation, and user-facing delivery.",
      ],
    },
    {
      role: "Data Scientist",
      points: [
        "Strong foundation in analytics, experimentation, machine learning, and model evaluation.",
        "Comfortable turning raw data into features, signals, metrics, and practical insight.",
        "Approach problems with a data-first mindset before choosing models or product workflows.",
      ],
    },
  ];

  const selectedAchievements = [
    {
      role: "AI Engineer",
      title: "Built a production-minded multimodal RAG backend",
      detail:
        "Designed Synapse with hybrid retrieval, citations, auth, rate limiting, analytics, and session exports to move beyond a notebook-style demo.",
    },
    {
      role: "AI Engineer",
      title: "Shipped a full-stack AI interview simulator",
      detail:
        "Built Interview AI across frontend, backend, multi-agent orchestration, streaming UX, voice mode, and model fallback behavior.",
    },
    {
      role: "Data Scientist",
      title: "Delivered a real-time CV analytics system",
      detail:
        "Reached 30 to 60 FPS on an RTX 3050 while combining detection, emotion classification, smoothing, and dashboard visualization.",
    },
    {
      role: "Data Scientist",
      title: "Improved large-scale data workflows during internship",
      detail:
        "Processed 1M+ transaction records efficiently and handled 10,000+ imbalanced reviews through automated text classification.",
    },
  ];

  const whatImLookingFor = [
    "AI Engineer opportunities where I can build practical LLM, RAG, and intelligent application workflows.",
    "Data Scientist roles where I can apply analytics, experimentation, modeling, and evaluation to real business problems.",
    "Teams that value end-to-end ownership from data thinking and model iteration to product-ready delivery.",
  ];

  return (
    <div ref={containerRef} className="ds-page ds-page-stack">
      <section data-animate className="ds-page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <h1 className="ds-page-title">Resume</h1>
            <div className="ds-divider" />
            <p className="ds-page-copy text-[1.08rem]">
              A portfolio-native summary of my strengths, selected work, focus
              areas, and what I&apos;m looking for next.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={resumeUrl}
              download
              className="ds-btn ds-btn-primary px-4 py-2"
            >
              <Download size={14} />
              Download PDF
            </a>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-btn ds-btn-secondary px-4 py-2"
            >
              <ExternalLink size={14} />
              Open PDF
            </a>
          </div>
        </div>
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div
          data-animate
          className="ds-card ds-card-featured self-start p-5 md:p-6 space-y-5"
        >
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {profile.roles.map((role) => (
                <RoleBadge key={role} role={role} />
              ))}
              <span className="ds-badge ds-badge-success">{profile.status}</span>
            </div>
            <h2 className="text-2xl font-semibold ds-text-primary">
              {profile.name}
            </h2>
            <p className="text-[1.02rem] leading-relaxed ds-text-secondary">
              {profile.tagline}
            </p>
          </div>

          <div className="grid items-stretch gap-3 sm:grid-cols-2">
            <QuickFact icon={Mail} label="Email" value={profile.email} />
            <QuickFact icon={MapPin} label="Location" value={profile.location} />
            <QuickFact
              icon={GraduationCap}
              label="Education"
              value={`${profile.education.degree} | ${profile.education.university}`}
            />
            <QuickFact
              icon={Award}
              label="Certifications"
              value={`${about.certifications.length}+ verifiable credentials`}
            />
          </div>
        </div>

        <div
          data-animate
          className="grid self-start gap-4 sm:grid-cols-2 xl:grid-cols-1"
        >
          <StatCard
            label="Featured Projects"
            value={String(featuredProjects.length)}
            detail="Portfolio projects with the strongest AI engineering signal"
          />
          <StatCard
            label="Selected Experience"
            value={`${experiences.length}`}
            detail="Practical work experience supported by real project delivery"
          />
          <StatCard
            label="Top Domains"
            value="AI Eng + DS"
            detail="Current focus across RAG systems, AI apps, machine learning, and data-driven problem solving"
          />
        </div>
      </section>

      <section className="ds-section-stack">
        <div data-animate className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: "var(--accent-color)" }} />
          <h2 className="ds-section-title">Key Strengths</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {roleStrengths.map((item) => (
            <div key={item.role} data-animate className="ds-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <RoleBadge role={item.role} />
                <h3 className="ds-subsection-title text-base">{item.role}</h3>
              </div>
              <div className="space-y-2">
                {item.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-2 text-sm leading-relaxed ds-text-secondary"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: "var(--accent-color)" }}
                    />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ds-section-stack">
        <div data-animate className="flex items-center gap-2">
          <Briefcase size={18} style={{ color: "var(--accent-color)" }} />
          <h2 className="ds-section-title">Selected Achievements</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {selectedAchievements.map((achievement) => (
            <div
              key={achievement.title}
              data-animate
              className="ds-card p-5 space-y-3"
            >
              <RoleBadge role={achievement.role} />
              <h3 className="ds-subsection-title text-base">
                {achievement.title}
              </h3>
              <p className="text-sm leading-relaxed ds-text-secondary">
                {achievement.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="ds-section-stack">
          <div data-animate className="flex items-center gap-2">
            <Target size={18} style={{ color: "var(--accent-color)" }} />
            <h2 className="ds-section-title">Domain Focus</h2>
          </div>

          <div data-animate className="ds-card p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {profile.specializations.map((item) => (
                <span key={item} className="ds-tag-bordered px-3 py-1.5 text-sm">
                  {item}
                </span>
              ))}
            </div>
            <div className="space-y-2">
              {profile.currentlyItems.map((item) => (
                <div
                  key={item.text}
                  className="flex items-start gap-2 text-sm leading-relaxed ds-text-secondary"
                >
                  <span className="shrink-0">{item.emoji}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ds-section-stack">
          <div data-animate className="flex items-center gap-2">
            <Code2 size={18} style={{ color: "var(--accent-color)" }} />
            <h2 className="ds-section-title">Tools I Use Most</h2>
          </div>

          <div data-animate className="ds-card p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {strongestTools.map((skill) => (
                <span
                  key={skill.name}
                  className="ds-tag-bordered px-3 py-1.5 text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed ds-text-secondary">
              My strongest tools right now are centered around Python, backend
              APIs, LLM application workflows, and practical ML engineering.
            </p>
          </div>
        </div>
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <div data-animate className="ds-card p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Target size={18} style={{ color: "var(--accent-color)" }} />
            <h2 className="ds-section-title">What I&apos;m Looking For</h2>
          </div>

          <div className="space-y-2">
            {whatImLookingFor.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 text-sm leading-relaxed ds-text-secondary"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--accent-color)" }}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div data-animate className="ds-card p-5 md:p-6 space-y-4">
          <h2 className="ds-section-title">Links</h2>
          <div className="space-y-2">
            <LinkItem icon={Github} label="GitHub" href={profile.github} />
            <LinkItem icon={Linkedin} label="LinkedIn" href={profile.linkedin} />
            <LinkItem
              icon={ExternalLink}
              label="Open PDF Resume"
              href={resumeUrl}
            />
          </div>
        </div>
      </section>

      <section className="ds-section-stack">
        <div data-animate className="flex items-center gap-2">
          <FileText size={18} style={{ color: "var(--accent-color)" }} />
          <h2 className="ds-section-title">PDF Resume</h2>
        </div>

        <div
          data-animate
          className="rounded-sm border overflow-hidden"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--sidebar-bg)",
          }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 border-b text-xs"
            style={{
              borderColor: "var(--border-color)",
              color: "var(--editor-fg)",
              opacity: 0.6,
            }}
          >
            <FileText size={14} />
            <span>resume.pdf</span>
          </div>
          <div className="w-full" style={{ height: "68vh" }}>
            <iframe
              src={`${resumeUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full border-0"
              title="Resume PDF"
              loading="lazy"
              referrerPolicy="no-referrer"
              style={{ backgroundColor: "#525659" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickFact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex h-full min-w-0 flex-col rounded-sm border p-4"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--active-bg)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Icon size={14} style={{ color: "var(--accent-color)" }} />
        <span className="ds-label">{label}</span>
      </div>
      <p
        className="mt-3 min-w-0 text-sm leading-relaxed ds-text-primary"
        style={{
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div data-animate className="ds-card p-5 space-y-2">
      <div className="ds-label">{label}</div>
      <div className="text-2xl font-semibold ds-text-primary">{value}</div>
      <p className="text-sm leading-relaxed ds-text-secondary">{detail}</p>
    </div>
  );
}

function LinkItem({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="ds-list-row ds-list-row-soft w-full justify-between rounded-sm border px-3 py-2.5 text-sm"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--active-bg)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Icon size={14} style={{ color: "var(--accent-color)" }} />
        <span className="font-medium ds-text-primary">{label}</span>
      </div>
      <ExternalLink size={13} style={{ color: "var(--accent-color)" }} />
    </a>
  );
}

function RoleBadge({ role }: { role: string }) {
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

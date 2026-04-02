"use client";

import { useState, Suspense, lazy, useEffect } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  projects,
  ProjectCaseStudy,
  ProjectCaseStudyArtifacts,
  ProjectDomain,
  ProjectTrustContent,
} from "@/data/projects";
import { useMobile } from "@/hooks/useMobile";
import {
  ArrowLeft,
  ArrowRight,
  Archive,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Folder,
  Gauge,
  Github,
  ImageOff,
  PlayCircle,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ArchitectureDiagram = lazy(() => import("./ArchitectureDiagram"));

const defaultImageLayout = {
  detailHeight: { mobile: 220, desktop: 360 },
  detailMaxWidth: { mobile: "100%", desktop: "100%" },
};

function isUsableLink(url?: string) {
  return Boolean(url && url !== "#");
}

function getYouTubeEmbedUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.includes("youtube-nocookie.com/embed/")) return url;
  if (url.includes("/embed/")) {
    return url.replace("https://www.youtube.com/embed/", "https://www.youtube-nocookie.com/embed/");
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube-nocookie.com/embed/${match[2]}`
    : url;
}

function resolveResponsiveNumber(
  value: { mobile?: number; desktop?: number } | undefined,
  fallback: { mobile: number; desktop: number },
  isMobile: boolean
) {
  return isMobile
    ? value?.mobile ?? fallback.mobile
    : value?.desktop ?? fallback.desktop;
}

function resolveResponsiveString(
  value: { mobile?: string; desktop?: string } | undefined,
  fallback: { mobile: string; desktop: string },
  isMobile: boolean
) {
  return isMobile
    ? value?.mobile ?? fallback.mobile
    : value?.desktop ?? fallback.desktop;
}

const statusConfig = {
  completed: {
    label: "Completed",
    icon: Star,
    color: "#4ec9b0",
    bg: "rgba(78, 201, 176, 0.1)",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    color: "#dcdcaa",
    bg: "rgba(220, 220, 170, 0.1)",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    color: "#808080",
    bg: "rgba(128, 128, 128, 0.1)",
  },
};

function DomainBadge({ domain }: { domain: ProjectDomain }) {
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
      className="ds-badge text-[11px]"
      style={{
        backgroundColor: bgColor,
        color: fgColor,
      }}
    >
      {domain}
    </span>
  );
}

function DiagramSkeleton() {
  return (
    <div
      className="rounded-sm border animate-pulse"
      style={{
        backgroundColor: "var(--active-bg)",
        borderColor: "var(--border-color)",
        height: 350,
      }}
    />
  );
}

function CaseStudyCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div data-animate className="ds-card p-5 space-y-3">
      <h3 className="ds-subsection-title text-base">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm leading-relaxed ds-text-secondary"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--accent-color)" }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArtifactsSection({
  artifacts,
  isMobile,
}: {
  artifacts: ProjectCaseStudyArtifacts;
  isMobile: boolean;
}) {
  return (
    <section className="ds-section-stack">
      <div data-animate className="ds-section-header items-start md:items-center min-w-0">
        <h2 className="ds-section-title">Concrete Artifacts</h2>
        <span className="ds-label w-full md:w-auto">
          Input, system behavior, and representative output
        </span>
      </div>

      <div className="grid gap-4">
        <div data-animate className="ds-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Folder size={16} style={{ color: "var(--accent-color)" }} />
            <h3 className="ds-subsection-title text-base">
              {artifacts.flowTitle}
            </h3>
          </div>

          <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "md:grid-cols-3"}`}>
            {artifacts.flowSteps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-sm border p-4 space-y-3"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--active-bg)",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="ds-badge ds-badge-accent">{step.title}</span>
                  <span className="text-[11px] font-semibold ds-text-faint">
                    0{index + 1}
                  </span>
                </div>
                <p className="text-sm leading-relaxed ds-text-secondary">
                  {step.detail}
                </p>
                {!isMobile && index < artifacts.flowSteps.length - 1 && (
                  <div
                    className="absolute right-[-12px] top-1/2 z-[1] -translate-y-1/2 rounded-full border p-1"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor: "var(--sidebar-bg)",
                      color: "var(--accent-color)",
                    }}
                  >
                    <ArrowRight size={12} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div data-animate className="ds-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <FileText size={16} style={{ color: "var(--accent-color)" }} />
            <h3 className="ds-subsection-title text-base">
              {artifacts.outputTitle}
            </h3>
          </div>

          <p className="text-sm leading-relaxed ds-text-secondary">
            {artifacts.outputCaption}
          </p>

          <div
            className="rounded-sm border overflow-hidden"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--active-bg)",
            }}
          >
            <div
              className="flex items-center justify-between gap-3 border-b px-3 py-2"
              style={{ borderColor: "var(--border-color)" }}
            >
              <span className="ds-label">{artifacts.outputTitle}</span>
              <span className="ds-tag px-2 py-0.5">
                {artifacts.outputLanguage}
              </span>
            </div>
            <pre
              className="overflow-x-auto px-4 py-4 text-[12px] leading-6 whitespace-pre-wrap"
              style={{
                color: "var(--tab-active-fg)",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
              }}
            >
              <code>{artifacts.outputSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseStudySection({ caseStudy }: { caseStudy: ProjectCaseStudy }) {
  return (
    <section className="ds-section-stack">
      <div data-animate className="ds-section-header items-start md:items-center min-w-0">
        <h2 className="ds-section-title">Case Study</h2>
        <span className="ds-label w-full md:w-auto">
          Context, constraints, decisions, outcomes, and next steps
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <CaseStudyCard title="Problem" items={caseStudy.problem} />
        <CaseStudyCard title="Constraints" items={caseStudy.constraints} />
        <CaseStudyCard title="My Role" items={caseStudy.role} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CaseStudyCard title="My Decisions" items={caseStudy.decisions} />
        <CaseStudyCard
          title="Why This Stack"
          items={caseStudy.stackRationale}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CaseStudyCard title="Results" items={caseStudy.results} />
        <CaseStudyCard
          title="What I'd Improve Next"
          items={caseStudy.nextImprovements}
        />
      </div>
    </section>
  );
}

function TrustCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div data-animate className="ds-card p-5 space-y-3">
      <h3 className="ds-subsection-title text-base">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-sm leading-relaxed ds-text-secondary"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--accent-color)" }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrustSection({
  trust,
  github,
  demo,
}: {
  trust: ProjectTrustContent;
  github?: string;
  demo?: string;
}) {
  const githubAvailable = isUsableLink(github);
  const demoAvailable = isUsableLink(demo);

  return (
    <section className="ds-section-stack">
      <div data-animate className="ds-section-header items-start md:items-center min-w-0">
        <h2 className="ds-section-title">Trust Signals</h2>
        <span className="ds-label w-full md:w-auto">
          Concrete proof around links, ownership, metrics, and tradeoffs
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div data-animate className="ds-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} style={{ color: "var(--accent-color)" }} />
            <h3 className="ds-subsection-title text-base">
              Proof Links
            </h3>
          </div>

          <div className="grid gap-3">
            <div
              className="rounded-sm border p-4 space-y-2"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--active-bg)",
              }}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="font-medium ds-text-primary">
                  {trust.links.github.label}
                </span>
                <span
                  className={`ds-badge ${
                    githubAvailable ? "ds-badge-success" : "ds-badge-warning"
                  }`}
                >
                  {githubAvailable ? "Available" : "Limited"}
                </span>
              </div>
              <p className="text-sm leading-relaxed ds-text-secondary">
                {trust.links.github.note}
              </p>
              {githubAvailable && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ds-inline-action"
                >
                  <Github size={12} />
                  <span>Open repository</span>
                </a>
              )}
            </div>

            <div
              className="rounded-sm border p-4 space-y-2"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--active-bg)",
              }}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="font-medium ds-text-primary">
                  {trust.links.demo.label}
                </span>
                <span
                  className={`ds-badge ${
                    demoAvailable ? "ds-badge-success" : "ds-badge-warning"
                  }`}
                >
                  {demoAvailable ? "Available" : "Limited"}
                </span>
              </div>
              <p className="text-sm leading-relaxed ds-text-secondary">
                {trust.links.demo.note}
              </p>
              {demoAvailable && (
                <a
                  href={demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ds-inline-action"
                >
                  <ExternalLink size={12} />
                  <span>Open demo</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div data-animate className="ds-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Gauge size={16} style={{ color: "var(--accent-color)" }} />
            <h3 className="ds-subsection-title text-base">Project Metrics</h3>
          </div>
          <div className="grid gap-3">
            {trust.metrics.map((metric) => (
              <div
                key={`${metric.label}-${metric.value}`}
                className="rounded-sm border p-4 space-y-2"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--active-bg)",
                }}
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="ds-label">{metric.label}</span>
                  <span className="text-base font-semibold ds-text-primary">
                    {metric.value}
                  </span>
                </div>
                <p className="text-sm leading-relaxed ds-text-secondary">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div data-animate className="ds-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: "var(--accent-color)" }} />
            <h3 className="ds-subsection-title text-base">My Scope</h3>
          </div>
          <TrustCard title="What I owned" items={trust.scope} />
        </div>

        <div data-animate className="ds-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Folder size={16} style={{ color: "var(--accent-color)" }} />
            <h3 className="ds-subsection-title text-base">Tradeoffs</h3>
          </div>
          <TrustCard title="Decisions and compromises" items={trust.tradeoffs} />
        </div>
      </div>
    </section>
  );
}

interface ProjectDetailPageProps {
  slug: string;
}

export default function ProjectDetailPage({ slug }: ProjectDetailPageProps) {
  const {
    openFile,
    closeTab,
    activeTab,
    sectionFocusRequest,
    clearSectionFocus,
  } = useApp();
  const isMobile = useMobile();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerRef = useStaggerAnimation({ stagger: 0.1 });

  const project = projects.find((p) => p.slug === slug);

  const handleBack = () => {
    if (activeTab) closeTab(activeTab);
    openFile("projects");
  };

  useEffect(() => {
    if (!project || !activeTab?.startsWith("project:")) return;
    const sectionId = sectionFocusRequest.sectionId;
    if (!sectionId) return;

    const element = document.getElementById(`project-section-${sectionId}`);
    if (!element) return;

    const raf = requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      clearSectionFocus();
    });

    return () => cancelAnimationFrame(raf);
  }, [
    activeTab,
    clearSectionFocus,
    project,
    sectionFocusRequest,
  ]);

  if (!project) {
    return (
      <div className="ds-page space-y-4 pt-8">
        <button onClick={handleBack} className="ds-inline-action text-xs">
          <ArrowLeft size={14} />
          <span>Back to Projects</span>
        </button>
        <div
          className="text-center py-20 text-sm"
          style={{ color: "var(--editor-fg)", opacity: 0.3 }}
        >
          Project not found
        </div>
      </div>
    );
  }

  const status = statusConfig[project.status];
  const StatusIcon = status.icon;
  const hasImage = project.image && !imageError;
  const detailHeight = resolveResponsiveNumber(
    project.imageLayout?.detailHeight,
    defaultImageLayout.detailHeight,
    isMobile
  );
  const detailMaxWidth = resolveResponsiveString(
    project.imageLayout?.detailMaxWidth,
    defaultImageLayout.detailMaxWidth,
    isMobile
  );
  const detailImageFit = project.image?.endsWith(".svg") ? "contain" : "cover";

  return (
    <div ref={containerRef} className="ds-page ds-page-stack min-w-0 overflow-x-hidden">
      <button
        data-animate
        onClick={handleBack}
        className="ds-inline-action text-xs"
      >
        <ArrowLeft size={14} />
        <span>Back to Projects</span>
      </button>

      <section data-animate className="ds-page-header min-w-0">
        <div className="flex min-w-0 items-start justify-between gap-4 flex-wrap">
          <div className="flex min-w-0 items-center gap-3">
            <Folder size={28} style={{ color: "var(--accent-color)" }} />
            <h1 className="ds-page-title text-2xl md:text-3xl break-words">
              {project.title}
            </h1>
          </div>
        </div>

        <div className="ds-divider" />

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="ds-badge text-[11px]"
            style={{ backgroundColor: status.bg, color: status.color }}
          >
            <StatusIcon size={11} />
            {status.label}
          </span>
          {project.domains.map((domain) => (
            <DomainBadge key={`${project.slug}-${domain}`} domain={domain} />
          ))}
          {project.featured && (
            <span className="ds-badge ds-badge-accent text-[11px]">
              Featured
            </span>
          )}
        </div>
      </section>

      {project.videoUrl && (
        <section id="project-section-video-demo" className="ds-section-stack">
          <div data-animate className="ds-section-header items-start md:items-center min-w-0">
            <h2 className="ds-section-title">Video Demo</h2>
            <span className="ds-label w-full md:w-auto">
              See the system in action
            </span>
          </div>
          <div 
            data-animate 
            className="w-full rounded-sm overflow-hidden border aspect-video relative"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--active-bg)",
            }}
          >
            <iframe
              src={getYouTubeEmbedUrl(project.videoUrl)}
              title={`${project.title} Video Demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
              className="absolute top-0 left-0 w-full h-full border-0"
            />
          </div>
        </section>
      )}

      {project.image && (
        <section id="project-section-snapshot" className="ds-section-stack">
          <div data-animate className="ds-section-header items-start md:items-center min-w-0">
            <h2 className="ds-section-title">
              {project.artifacts?.snapshotTitle ?? "Application Snapshot"}
            </h2>
            <span className="ds-label w-full md:w-auto">
              Click the image to inspect a larger preview
            </span>
          </div>
          {project.artifacts?.snapshotCaption && (
            <p data-animate className="text-sm leading-relaxed ds-text-secondary">
              {project.artifacts.snapshotCaption}
            </p>
          )}

          <div
            data-animate
            className="w-full min-w-0"
            style={{
              maxWidth: detailMaxWidth,
              marginInline: detailMaxWidth === "100%" ? undefined : "auto",
            }}
          >
            <button
              onClick={() => hasImage && setImageDialogOpen(true)}
              className="w-full rounded-sm overflow-hidden border transition-opacity hover:opacity-90"
              style={{
                borderColor: "var(--border-color)",
                cursor: hasImage ? "pointer" : "default",
              }}
            >
              {hasImage ? (
                <div
                  className="w-full"
                  style={{
                    height: detailHeight,
                    backgroundColor: "var(--active-bg)",
                  }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={900}
                    height={500}
                    className="w-full h-full"
                    style={{
                      objectFit: detailImageFit,
                      objectPosition:
                        project.imageLayout?.position ?? "center center",
                    }}
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <div
                  className="w-full h-48 flex items-center justify-center"
                  style={{ backgroundColor: "var(--active-bg)" }}
                >
                  <ImageOff
                    size={32}
                    style={{ color: "var(--editor-line-number)" }}
                  />
                </div>
              )}
            </button>
          </div>
        </section>
      )}

      <section id="project-section-about" className="ds-section-stack">
        <h2 data-animate className="ds-section-title">
          About
        </h2>
        {project.longDescription.map((paragraph, i) => (
          <p
            key={i}
            data-animate
            className="text-sm leading-relaxed ds-text-secondary"
          >
            {paragraph}
          </p>
        ))}
      </section>

      {project.artifacts && (
        <div id="project-section-artifacts">
          <ArtifactsSection artifacts={project.artifacts} isMobile={isMobile} />
        </div>
      )}

      {project.trust && (
        <div id="project-section-trust">
          <TrustSection
            trust={project.trust}
            github={project.github}
            demo={project.demo}
          />
        </div>
      )}

      {project.caseStudy && (
        <div id="project-section-case-study">
          <CaseStudySection caseStudy={project.caseStudy} />
        </div>
      )}

      {project.architecture && (
        <section id="project-section-architecture" className="ds-section-stack">
          <h2 data-animate className="ds-section-title">
            Architecture
          </h2>
          <p data-animate className="text-xs ds-text-muted">
            {project.architecture.description}
          </p>
          <div data-animate>
            <Suspense fallback={<DiagramSkeleton />}>
              <ArchitectureDiagram architecture={project.architecture} />
            </Suspense>
          </div>
        </section>
      )}

      {project.features.length > 0 && (
        <section id="project-section-features" className="ds-section-stack">
          <h2 data-animate className="ds-section-title">
            Key Features
          </h2>
          <div data-animate className="ds-card p-4 space-y-2">
            {project.features.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm ds-text-secondary"
              >
                <CheckCircle2
                  size={14}
                  className="shrink-0 mt-0.5"
                  style={{ color: "var(--accent-color)" }}
                />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="project-section-tech-stack" className="ds-section-stack">
        <h2 data-animate className="ds-section-title">
          Tech Stack
        </h2>
        <div data-animate className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="ds-tag-bordered px-3 py-1.5 text-xs">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section data-animate className="flex flex-wrap items-center gap-3 pt-2">
        {isUsableLink(project.github) && (
          <a
            href={project.github}
            className="ds-btn ds-btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={16} />
            <span>View Code</span>
          </a>
        )}
        {project.videoUrl && (
          <button
            type="button"
            className="ds-btn ds-btn-primary"
            onClick={() => {
              document.getElementById('project-section-video-demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <PlayCircle size={16} />
            <span>Watch Video</span>
          </button>
        )}
        {isUsableLink(project.demo) ? (
          <a
            href={project.demo}
            className={`ds-btn ${project.videoUrl ? "ds-btn-secondary" : "ds-btn-primary"}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={16} />
            <span>Live Demo</span>
          </a>
        ) : project.demo === "#" ? (
          <span className="ds-btn ds-btn-secondary" aria-disabled="true">
            <ExternalLink size={16} />
            <span>Demo Not Public Yet</span>
          </span>
        ) : null}
      </section>

      {hasImage && (
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent
            className="max-w-4xl w-[90vw] p-0 overflow-hidden border"
            style={{
              backgroundColor: "var(--editor-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <DialogHeader
              className="flex flex-row items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <DialogTitle
                className="text-sm font-semibold truncate"
                style={{ color: "var(--tab-active-fg)" }}
              >
                {project.title}
              </DialogTitle>
              <DialogClose className="ds-inline-action ds-inline-action-muted shrink-0 p-1">
                <X size={16} />
              </DialogClose>
            </DialogHeader>

            <div className="relative w-full">
              <Image
                src={project.image!}
                alt={project.title}
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                style={{ backgroundColor: "var(--sidebar-bg)" }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

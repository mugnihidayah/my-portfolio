"use client";

import { useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  projects,
  projectDomainFilters,
  Project,
  ProjectDomainFilter,
  ProjectDomain,
} from "@/data/projects";
import { useMobile } from "@/hooks/useMobile";
import {
  ExternalLink,
  Github,
  Folder,
  Star,
  Clock,
  Archive,
  ImageOff,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";

const defaultImageLayout = {
  featuredHeight: { mobile: 220, desktop: 320 },
  cardHeight: { mobile: 104, desktop: 124 },
  featuredMaxWidth: { mobile: "100%", desktop: "84%" },
  cardMaxWidth: { mobile: "100%", desktop: "100%" },
};

function isUsableLink(url?: string) {
  return Boolean(url && url !== "#");
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

function matchesDomainFilter(project: Project, activeDomainFilter: ProjectDomainFilter) {
  if (activeDomainFilter === "All") return true;
  return project.domains.includes(activeDomainFilter as ProjectDomain);
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className="ds-badge shrink-0"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <Icon size={10} />
      {config.label}
    </span>
  );
}

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
      className="ds-badge shrink-0"
      style={{
        backgroundColor: bgColor,
        color: fgColor,
      }}
    >
      {domain}
    </span>
  );
}

function ProjectImage({
  project,
  isMobile,
  size,
  imageErrors,
  onError,
}: {
  project: Project;
  isMobile: boolean;
  size: "sm" | "lg";
  imageErrors: Set<string>;
  onError: (title: string) => void;
}) {
  if (!project.image) return null;

  const hasImage = !imageErrors.has(project.title);
  const height = resolveResponsiveNumber(
    size === "lg"
      ? project.imageLayout?.featuredHeight
      : project.imageLayout?.cardHeight,
    size === "lg"
      ? defaultImageLayout.featuredHeight
      : defaultImageLayout.cardHeight,
    isMobile
  );
  const maxWidth = resolveResponsiveString(
    size === "lg"
      ? project.imageLayout?.featuredMaxWidth
      : project.imageLayout?.cardMaxWidth,
    size === "lg"
      ? defaultImageLayout.featuredMaxWidth
      : defaultImageLayout.cardMaxWidth,
    isMobile
  );

  return (
    <div
      className="w-full rounded-sm overflow-hidden border"
      style={{
        height,
        maxWidth,
        marginInline: maxWidth === "100%" ? undefined : "auto",
        borderColor: "var(--border-color)",
        backgroundColor: "var(--active-bg)",
      }}
    >
      {hasImage ? (
        <Image
          src={project.image}
          alt={project.title}
          width={size === "lg" ? 800 : 400}
          height={size === "lg" ? 400 : 200}
          className="w-full h-full"
          style={{
            objectFit: "cover",
            objectPosition: project.imageLayout?.position ?? "center center",
          }}
          onError={() => onError(project.title)}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: "var(--active-bg)" }}
        >
          <ImageOff
            size={isMobile ? 20 : 24}
            style={{ color: "var(--editor-line-number)" }}
          />
        </div>
      )}
    </div>
  );
}

function FeaturedCard({
  project,
  isMobile,
  imageErrors,
  onImageError,
  onOpen,
}: {
  project: Project;
  isMobile: boolean;
  imageErrors: Set<string>;
  onImageError: (title: string) => void;
  onOpen: (project: Project) => void;
}) {
  return (
    <article
      data-animate
      className={`ds-card ds-card-lift overflow-hidden ${
        isMobile ? "p-3.5 space-y-3.5" : "p-4 space-y-4"
      }`}
      style={{
        borderColor: "rgba(0, 122, 204, 0.35)",
      }}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="ds-card-action space-y-3.5"
        aria-label={`Open project details for ${project.title}`}
      >
        <div className="space-y-2.5 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <Folder
                size={15}
                style={{ color: "var(--accent-color)" }}
                className="shrink-0"
              />
              <h3 className="ds-subsection-title text-[1rem] truncate">
                {project.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="ds-badge ds-badge-accent shrink-0">Featured</span>
              <StatusBadge status={project.status} />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {project.domains.map((domain) => (
              <DomainBadge key={`${project.slug}-${domain}`} domain={domain} />
            ))}
          </div>
        </div>

        <ProjectImage
          project={project}
          isMobile={isMobile}
          size="lg"
          imageErrors={imageErrors}
          onError={onImageError}
        />

        <p className="text-sm leading-relaxed ds-text-secondary line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {(isMobile ? project.techStack.slice(0, 4) : project.techStack.slice(0, 5)).map(
            (tech) => (
              <span
                key={tech}
                className="ds-tag px-1.5 py-0.5"
              >
                {tech}
              </span>
            )
          )}
          {project.techStack.length > (isMobile ? 4 : 5) && (
            <span className="ds-tag px-1.5 py-0.5">
              +{project.techStack.length - (isMobile ? 4 : 5)}
            </span>
          )}
        </div>
      </button>

      <div
        className="flex items-center gap-2 pt-2 flex-wrap border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        {isUsableLink(project.github) && (
          <a
            href={project.github}
            onClick={(e) => e.stopPropagation()}
            className="ds-inline-action ds-inline-action-muted"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={12} />
            <span>Code</span>
          </a>
        )}
        {isUsableLink(project.demo) && (
          <a
            href={project.demo}
            onClick={(e) => e.stopPropagation()}
            className="ds-inline-action"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={12} />
            <span>Demo</span>
          </a>
        )}
        {!isUsableLink(project.demo) && project.demo === "#" && (
          <span className="ds-inline-action ds-inline-action-muted">
            <ExternalLink size={12} />
            <span>Demo limited</span>
          </span>
        )}
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="ds-inline-action ml-auto shrink-0 cursor-pointer"
          aria-label={`Open project details for ${project.title}`}
        >
          Details
          <ArrowRight size={11} />
        </button>
      </div>
    </article>
  );
}

function ProjectCard({
  project,
  isMobile,
  imageErrors,
  onImageError,
  onOpen,
}: {
  project: Project;
  isMobile: boolean;
  imageErrors: Set<string>;
  onImageError: (title: string) => void;
  onOpen: (project: Project) => void;
}) {
  return (
    <article
      data-animate
      className={`ds-card ds-card-lift overflow-hidden ${
        isMobile ? "p-3 space-y-3" : "p-3.5 space-y-3.5"
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="ds-card-action space-y-3"
        aria-label={`Open project details for ${project.title}`}
      >
        <div className="space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <Folder size={14} style={{ color: "var(--accent-color)" }} className="shrink-0" />
              <h3
                className={`font-semibold truncate ${
                  isMobile ? "text-[0.97rem]" : "text-[1rem]"
                } ds-subsection-title`}
              >
                {project.title}
              </h3>
            </div>
            <StatusBadge status={project.status} />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {project.domains.map((domain) => (
              <DomainBadge key={`${project.slug}-${domain}`} domain={domain} />
            ))}
          </div>
        </div>

        <ProjectImage
          project={project}
          isMobile={isMobile}
          size="sm"
          imageErrors={imageErrors}
          onError={onImageError}
        />

        <p className="text-sm leading-relaxed ds-text-secondary line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {(isMobile ? project.techStack.slice(0, 3) : project.techStack.slice(0, 4)).map(
            (tech) => (
              <span key={tech} className="ds-tag px-1.5 py-0.5">
                {tech}
              </span>
            )
          )}
          {project.techStack.length > (isMobile ? 3 : 4) && (
            <span className="ds-tag px-1.5 py-0.5">
              +{project.techStack.length - (isMobile ? 3 : 4)}
            </span>
          )}
        </div>
      </button>

      <div
        className="flex items-center gap-2 pt-2 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        {isUsableLink(project.github) && (
          <a
            href={project.github}
            onClick={(e) => e.stopPropagation()}
            className="ds-inline-action ds-inline-action-muted"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={12} />
            <span>Code</span>
          </a>
        )}
        {isUsableLink(project.demo) && (
          <a
            href={project.demo}
            onClick={(e) => e.stopPropagation()}
            className="ds-inline-action"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={12} />
            <span>Demo</span>
          </a>
        )}
        {!isUsableLink(project.demo) && project.demo === "#" && (
          <span className="ds-inline-action ds-inline-action-muted">
            <ExternalLink size={12} />
            <span>Demo limited</span>
          </span>
        )}
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="ds-inline-action ml-auto shrink-0 cursor-pointer"
          aria-label={`Open project details for ${project.title}`}
        >
          Details
          <ArrowRight size={11} />
        </button>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const { openFile } = useApp();
  const isMobile = useMobile();
  const [activeDomainFilter, setActiveDomainFilter] =
    useState<ProjectDomainFilter>("All");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const filteredProjects = projects.filter((p) =>
    matchesDomainFilter(p, activeDomainFilter)
  );

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const otherProjects = filteredProjects.filter((p) => !p.featured);

  const containerRef = useStaggerAnimation({
    stagger: 0.08,
    y: 25,
    duration: 0.5,
    dependencies: [activeDomainFilter],
  });

  const handleImageError = (title: string) => {
    setImageErrors((prev) => new Set(prev).add(title));
  };

  const handleOpenProject = (project: Project) => {
    openFile(`project:${project.slug}`);
  };

  return (
    <div ref={containerRef} className="ds-page ds-page-stack">
      {/* Header */}
      <section data-animate className="ds-page-header">
        <h1 className="ds-page-title">Projects</h1>
        <div className="ds-divider" />
        <p className="ds-page-copy text-[1.12rem]">
          A selection of projects I&apos;ve worked on
        </p>
      </section>

      {/* Category Filter */}
      <div data-animate className="flex flex-wrap gap-2 w-full">
        {projectDomainFilters.map((domain) => (
          <button
            key={domain}
            onClick={() => setActiveDomainFilter(domain)}
            type="button"
            aria-pressed={activeDomainFilter === domain}
            data-state={activeDomainFilter === domain ? "active" : "inactive"}
            className="ds-chip py-1.5 px-3 text-base"
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Count */}
      <div data-animate className="flex flex-wrap items-center justify-between gap-2">
        <p className="ds-label">
          {filteredProjects.length} project(s) found
        </p>
        <div className="ds-panel-hint">
          <Sparkles size={12} />
          Filter by AI domain to find relevant projects quickly
        </div>
      </div>

      {/* Featured */}
      {featuredProjects.length > 0 && (
        <section className="ds-section-stack">
          <h2 data-animate className="ds-label">Featured Projects</h2>
          <div
            className={`grid gap-4 w-full max-w-full ${
              isMobile ? "grid-cols-1" : "md:grid-cols-2"
            }`}
          >
            {featuredProjects.map((project) => (
              <FeaturedCard
                key={project.title}
                project={project}
                isMobile={isMobile}
                imageErrors={imageErrors}
                onImageError={handleImageError}
                onOpen={handleOpenProject}
              />
            ))}
          </div>
        </section>
      )}

      {/* Other */}
      {otherProjects.length > 0 && (
        <section className="ds-section-stack">
          {featuredProjects.length > 0 && (
            <h2 data-animate className="ds-label">Other Projects</h2>
          )}
          <div
            className={`grid gap-4 w-full max-w-full ${
              isMobile ? "grid-cols-1" : "md:grid-cols-2 xl:grid-cols-3"
            }`}
          >
            {otherProjects.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
                isMobile={isMobile}
                imageErrors={imageErrors}
                onImageError={handleImageError}
                onOpen={handleOpenProject}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty */}
      {filteredProjects.length === 0 && (
        <div data-animate className="py-4">
          <div className="ds-empty-state">
            <div className="ds-empty-icon">
              <Folder size={16} />
            </div>
            <div className="space-y-1">
              <p className="ds-empty-title">
                No projects found for the current filters
              </p>
              <p className="ds-empty-copy">
                This combination is a bit too narrow right now. Reset one of the
                filters to scan the full portfolio again.
              </p>
            </div>
            <div className="ds-empty-actions">
              {activeDomainFilter !== "All" && (
                <button
                  type="button"
                  onClick={() => setActiveDomainFilter("All")}
                  className="ds-btn ds-btn-secondary px-3 py-1.5 text-[12px]"
                >
                  <RotateCcw size={13} />
                  Reset AI domain
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div data-animate className="flex flex-wrap gap-4 pt-2">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div key={key} className="flex items-center gap-1.5 text-base">
              <Icon size={10} style={{ color: config.color }} />
              <span className="ds-text-muted">
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

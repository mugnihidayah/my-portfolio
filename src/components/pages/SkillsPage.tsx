"use client";

import { useMemo, useState } from "react";
import { useMobile } from "@/hooks/useMobile";
import {
  skills,
  skillCategories,
  SkillCategory,
  SkillRoleFit,
} from "@/data/skills";
import {
  Bot,
  Brain,
  CheckCircle2,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { techIconMap } from "@/components/icons/TechIcons";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";

const strategicCategories = skillCategories.filter(
  (category): category is SkillCategory => category !== "All"
);

const categoryMeta: Record<
  SkillCategory,
  {
    description: string;
    recruiterSignal: string;
  }
> = {
  "Data Science": {
    description:
      "Analytics, SQL, data wrangling, and feature work that support practical decision-making and DS interviews.",
    recruiterSignal: "Strongest signal for Data Scientist roles",
  },
  "Machine Learning": {
    description:
      "Model training, experimentation, evaluation, and applied ML depth across structured data and neural-network workflows.",
    recruiterSignal: "Shared signal across Data Scientist and AI Engineer roles",
  },
  "AI Engineering": {
    description:
      "RAG, orchestration, agent workflows, and application-layer AI patterns that show system design beyond model usage.",
    recruiterSignal: "Strongest signal for AI Engineer roles",
  },
  "Backend / Deployment": {
    description:
      "APIs, containers, databases, and shipping infrastructure that turn models into usable products and reliable services.",
    recruiterSignal: "Strong signal for AI Engineer delivery readiness",
  },
};

const roleTrackHighlights = [
  {
    role: "AI Engineer" as SkillRoleFit,
    icon: Bot,
    description:
      "Look at AI Engineering and Backend / Deployment for the clearest evidence of RAG systems, APIs, orchestration, and product-minded delivery.",
  },
  {
    role: "Data Scientist" as SkillRoleFit,
    icon: Brain,
    description:
      "Look at Data Science and Machine Learning for the clearest evidence of analytics, experimentation, evaluation, and model-building depth.",
  },
];

export default function SkillsPage() {
  const isMobile = useMobile();
  const [activeCategory, setActiveCategory] = useState<
    (typeof skillCategories)[number]
  >("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkills = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchCategory =
        activeCategory === "All" || skill.category === activeCategory;
      const searchableText = [
        skill.name,
        skill.publisher,
        skill.description,
        skill.category,
        ...skill.roleFit,
        ...skill.keywords,
      ]
        .join(" ")
        .toLowerCase();

      const matchSearch =
        !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const groupedSkills = useMemo(() => {
    const targetCategories =
      activeCategory === "All" ? strategicCategories : [activeCategory];

    return targetCategories
      .map((category) => ({
        category,
        skills: filteredSkills.filter((skill) => skill.category === category),
      }))
      .filter((group) => group.skills.length > 0);
  }, [activeCategory, filteredSkills]);

  const containerRef = useStaggerAnimation({
    y: 15,
    duration: 0.4,
    stagger: 0.05,
    dependencies: [activeCategory, searchQuery],
  });

  return (
    <div ref={containerRef} className="ds-page ds-page-stack">
      <section data-animate className="ds-page-header">
        <h1 className="ds-page-title">Skills</h1>
        <div className="ds-divider" />
        <p className="ds-page-copy text-[1.08rem]">
          My stack is grouped by how it supports AI Engineer and Data Scientist
          roles, not just by generic tool categories.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {roleTrackHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.role}
              data-animate
              className="ds-card ds-card-lift p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <Icon size={18} style={{ color: "var(--accent-color)" }} />
                <RoleBadge role={item.role} />
              </div>
              <p className="text-sm leading-relaxed ds-text-secondary">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      <div data-animate className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--editor-line-number)" }}
        />
        <input
          type="text"
          placeholder="Search analytics, modeling, RAG, deployment, APIs, evaluation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search skills"
          className="ds-input pl-9 pr-4 py-2 text-sm"
        />
      </div>

      <div data-animate className="flex flex-wrap gap-2 w-full">
        {skillCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
            aria-pressed={activeCategory === category}
            data-state={activeCategory === category ? "active" : "inactive"}
            className="ds-chip py-1.5 px-3 text-[11px]"
          >
            {category}
          </button>
        ))}
      </div>

      <div data-animate className="flex flex-wrap items-center justify-between gap-2">
        <p className="ds-label">
          {filteredSkills.length} skill{filteredSkills.length === 1 ? "" : "s"} found
        </p>
        <div className="ds-panel-hint">
          <Sparkles size={12} />
          Categories are mapped to recruiter-facing role signals
        </div>
      </div>

      {groupedSkills.map((group) => (
        <section key={group.category} className="ds-section-stack">
          <div data-animate className="ds-section-header">
            <div className="space-y-1">
              <h2 className="ds-section-title">{group.category}</h2>
              <p className="text-sm leading-relaxed ds-text-secondary">
                {categoryMeta[group.category].description}
              </p>
            </div>
            <span className="ds-panel-hint">
              {categoryMeta[group.category].recruiterSignal}
            </span>
          </div>

          <div className="space-y-3">
            {group.skills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} isMobile={isMobile} />
            ))}
          </div>
        </section>
      ))}

      {filteredSkills.length === 0 && (
        <div data-animate className="ds-empty-state">
          <div className="ds-empty-icon">
            <Search size={16} />
          </div>
          <div className="space-y-1">
            <p className="ds-empty-title">
              No skills found for &quot;{searchQuery}&quot;
            </p>
            <p className="ds-empty-copy">
              Try role-oriented terms like analytics, classification, RAG,
              deployment, evaluation, or APIs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SkillCard({
  skill,
  isMobile,
}: {
  skill: (typeof skills)[0];
  isMobile: boolean;
}) {
  return (
    <div
      data-animate
      className={`ds-card ds-card-interactive cursor-default ${
        isMobile ? "p-4 space-y-3" : "p-5 space-y-4"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`rounded-sm flex items-center justify-center shrink-0 ${
            isMobile ? "w-10 h-10" : "w-11 h-11"
          }`}
          style={{ backgroundColor: "var(--active-bg)" }}
        >
          <SkillIcon name={skill.icon} size={isMobile ? 22 : 26} />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="ds-subsection-title text-base">{skill.name}</h3>
            <span className="text-[11px] ds-text-muted">{skill.publisher}</span>
          </div>

          <p className="text-sm leading-relaxed ds-text-secondary">
            {skill.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {skill.roleFit.map((role) => (
              <RoleBadge key={`${skill.name}-${role}`} role={role} />
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            {skill.keywords.slice(0, isMobile ? 2 : 4).map((keyword) => (
              <span key={`${skill.name}-${keyword}`} className="ds-tag text-[10px] px-1.5 py-0.5">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="shrink-0 space-y-2 text-right">
          <div className="flex items-center justify-end gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={10}
                fill={index < skill.rating ? "var(--accent-color)" : "transparent"}
                style={{
                  color:
                    index < skill.rating
                      ? "var(--accent-color)"
                      : "var(--editor-line-number)",
                }}
              />
            ))}
          </div>

          {skill.installed && (
            <div className="ds-badge ds-badge-accent px-2.5 py-1 text-[10px]">
              <CheckCircle2 size={10} />
              <span>Core</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillIcon({ name, size }: { name: string; size: number }) {
  const IconComponent = techIconMap[name];

  if (IconComponent) {
    return <IconComponent size={size} />;
  }

  return (
    <span
      className="font-bold"
      style={{ color: "var(--accent-color)", fontSize: size * 0.55 }}
    >
      {name.charAt(0)}
    </span>
  );
}

function RoleBadge({ role }: { role: SkillRoleFit }) {
  const isAiEngineer = role === "AI Engineer";
  const Icon = isAiEngineer ? Bot : Brain;

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
      <Icon size={10} />
      {role}
    </span>
  );
}

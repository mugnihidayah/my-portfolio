"use client";

import { useState, useMemo, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { profile } from "@/data/profile";
import { about } from "@/data/about";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experience";
import { skills } from "@/data/skills";
import { files } from "@/data/files";
import {
  Search,
  FileText,
  X,
  ArrowRight,
  Sparkles,
  Keyboard,
  SearchX,
} from "lucide-react";
import FileIcon from "./FileIcon";

type SearchGroup = "Pages" | "Projects" | "Experience" | "Skills" | "Career";

interface SearchField {
  label: string;
  text: string;
  weight: number;
}

interface SearchAction {
  label: string;
  fileId: string;
}

interface SearchEntry {
  id: string;
  fileId: string;
  fileName: string;
  extension: string;
  group: SearchGroup;
  title: string;
  subtitle?: string;
  fields: SearchField[];
  quickActions?: SearchAction[];
}

interface SearchMatch {
  label: string;
  text: string;
  context: string;
  score: number;
}

interface SearchResult {
  id: string;
  fileId: string;
  fileName: string;
  extension: string;
  group: SearchGroup;
  title: string;
  subtitle?: string;
  matches: SearchMatch[];
  score: number;
  quickActions: SearchAction[];
}

interface SearchPanelProps {
  onFileSelect?: () => void;
}

const fileMetaById = new Map(files.map((file) => [file.id, file]));

const roleSignalTexts = [
  "analytics modeling evaluation experimentation feature engineering classification regression data analysis",
  "rag deployment api agents architecture orchestration backend inference serving llm retrieval",
];

function getFileMeta(fileId: string) {
  return fileMetaById.get(fileId);
}

function buildProjectFields(project: (typeof projects)[number]): SearchField[] {
  const caseStudyTexts = project.caseStudy
    ? [
        ...project.caseStudy.problem,
        ...project.caseStudy.constraints,
        ...project.caseStudy.role,
        ...project.caseStudy.decisions,
        ...project.caseStudy.stackRationale,
        ...project.caseStudy.results,
        ...project.caseStudy.nextImprovements,
      ]
    : [];

  const trustTexts = project.trust
    ? [
        ...project.trust.scope,
        ...project.trust.tradeoffs,
        ...project.trust.metrics.flatMap((metric) => [
          metric.label,
          metric.value,
          metric.detail,
        ]),
        project.trust.links.github.label,
        project.trust.links.github.note,
        project.trust.links.demo.label,
        project.trust.links.demo.note,
      ]
    : [];

  const architectureTexts = project.architecture
    ? [
        project.architecture.description,
        ...project.architecture.nodes.flatMap((node) => [
          node.label,
          node.description,
          ...node.details,
        ]),
      ]
    : [];

  const artifactTexts = project.artifacts
    ? [
        project.artifacts.snapshotTitle,
        project.artifacts.snapshotCaption,
        project.artifacts.flowTitle,
        ...project.artifacts.flowSteps.flatMap((step) => [
          step.title,
          step.detail,
        ]),
        project.artifacts.outputTitle,
        project.artifacts.outputCaption,
        project.artifacts.outputSnippet,
      ]
    : [];

  return [
    { label: "title", text: project.title, weight: 6 },
    { label: "summary", text: project.description, weight: 5 },
    ...project.longDescription.map((text) => ({
      label: "about",
      text,
      weight: 4,
    })),
    ...project.features.map((text) => ({
      label: "feature",
      text,
      weight: 4,
    })),
    ...project.techStack.map((text) => ({
      label: "stack",
      text,
      weight: 3,
    })),
    ...project.domains.map((text) => ({
      label: "role fit",
      text,
      weight: 4,
    })),
    ...caseStudyTexts.map((text) => ({
      label: "case study",
      text,
      weight: 5,
    })),
    ...trustTexts.map((text) => ({
      label: "trust",
      text,
      weight: 4,
    })),
    ...architectureTexts.map((text) => ({
      label: "architecture",
      text,
      weight: 3,
    })),
    ...artifactTexts.map((text) => ({
      label: "artifact",
      text,
      weight: 4,
    })),
  ];
}

function buildSearchData(): SearchEntry[] {
  const homeFile = getFileMeta("home");
  const aboutFile = getFileMeta("about");
  const projectsFile = getFileMeta("projects");
  const experienceFile = getFileMeta("experience");
  const skillsFile = getFileMeta("skills");
  const contactFile = getFileMeta("contact");
  const resumeFile = getFileMeta("resume");

  const entries: SearchEntry[] = [
    {
      id: "page:home",
      fileId: "home",
      fileName: homeFile?.name ?? "home.html",
      extension: homeFile?.extension ?? "html",
      group: "Pages",
      title: "Home Overview",
      subtitle: `${profile.role} | ${profile.status}`,
      fields: [
        { label: "name", text: profile.name, weight: 6 },
        { label: "role", text: profile.role, weight: 6 },
        { label: "tagline", text: profile.tagline, weight: 5 },
        { label: "status", text: profile.status, weight: 4 },
        { label: "location", text: profile.location, weight: 3 },
        ...profile.specializations.map((text) => ({
          label: "specialization",
          text,
          weight: 4,
        })),
        ...profile.valueProps.flatMap((item) => [
          { label: "value", text: item.title, weight: 4 },
          { label: "value", text: item.description, weight: 4 },
        ]),
        ...profile.currentlyItems.map((item) => ({
          label: "currently",
          text: item.text,
          weight: 3,
        })),
        ...roleSignalTexts.map((text) => ({
          label: "role signal",
          text,
          weight: 3,
        })),
      ],
      quickActions: [
        { label: "Open home", fileId: "home" },
        { label: "View projects", fileId: "projects" },
        { label: "Contact", fileId: "contact" },
      ],
    },
    {
      id: "page:about",
      fileId: "about",
      fileName: aboutFile?.name ?? "about.css",
      extension: aboutFile?.extension ?? "css",
      group: "Pages",
      title: "About Profile",
      subtitle: `${profile.education.degree} | ${profile.location}`,
      fields: [
        ...about.bio.map((text) => ({ label: "bio", text, weight: 5 })),
        ...about.interests.map((text) => ({
          label: "interest",
          text,
          weight: 3,
        })),
        ...about.certifications.flatMap((cert) => [
          { label: "certification", text: cert.name, weight: 5 },
          { label: "issuer", text: cert.issuer, weight: 4 },
          { label: "year", text: cert.year, weight: 2 },
        ]),
        { label: "education", text: profile.education.degree, weight: 4 },
        { label: "education", text: profile.education.university, weight: 4 },
        ...roleSignalTexts.map((text) => ({
          label: "role signal",
          text,
          weight: 3,
        })),
      ],
      quickActions: [
        { label: "Open about", fileId: "about" },
        { label: "Open resume", fileId: "resume" },
      ],
    },
    {
      id: "page:projects",
      fileId: "projects",
      fileName: projectsFile?.name ?? "projects.py",
      extension: projectsFile?.extension ?? "py",
      group: "Projects",
      title: "Projects Overview",
      subtitle: `${projects.length} role-mapped AI and data projects`,
      fields: [
        ...projects.flatMap((project) => [
          { label: "project", text: project.title, weight: 5 },
          { label: "summary", text: project.description, weight: 4 },
          ...project.domains.map((text) => ({
            label: "role fit",
            text,
            weight: 4,
          })),
        ]),
      ],
      quickActions: [
        { label: "Browse projects", fileId: "projects" },
        { label: "Open featured", fileId: `project:${projects[0]?.slug ?? "projects"}` },
      ],
    },
    {
      id: "page:experience",
      fileId: "experience",
      fileName: experienceFile?.name ?? "experience.json",
      extension: experienceFile?.extension ?? "json",
      group: "Experience",
      title: "Experience Overview",
      subtitle: `${experiences.length} roles and practical project work`,
      fields: experiences.flatMap((experience) => [
        { label: "role", text: experience.role, weight: 5 },
        { label: "company", text: experience.company, weight: 4 },
        { label: "period", text: experience.period, weight: 2 },
        ...roleSignalTexts.map((text) => ({
          label: "role signal",
          text,
          weight: 2,
        })),
      ]),
      quickActions: [
        { label: "Open experience", fileId: "experience" },
        { label: "Open contact", fileId: "contact" },
      ],
    },
    {
      id: "page:skills",
      fileId: "skills",
      fileName: skillsFile?.name ?? "skills.ts",
      extension: skillsFile?.extension ?? "ts",
      group: "Skills",
      title: "Skills Overview",
      subtitle: `${skills.length} skills mapped to AI Engineer and Data Scientist fit`,
      fields: skills.flatMap((skill) => [
        { label: "skill", text: skill.name, weight: 5 },
        { label: "category", text: skill.category, weight: 3 },
        ...skill.roleFit.map((text) => ({
          label: "role fit",
          text,
          weight: 4,
        })),
        ...skill.keywords.map((text) => ({
          label: "keyword",
          text,
          weight: 4,
        })),
      ]),
      quickActions: [
        { label: "Open skills", fileId: "skills" },
        { label: "View projects", fileId: "projects" },
      ],
    },
    {
      id: "page:contact",
      fileId: "contact",
      fileName: contactFile?.name ?? "contact.tsx",
      extension: contactFile?.extension ?? "tsx",
      group: "Career",
      title: "Contact & Links",
      subtitle: "Reach out, collaborate, or request a resume",
      fields: [
        { label: "email", text: profile.email, weight: 6 },
        { label: "github", text: profile.github, weight: 4 },
        { label: "linkedin", text: profile.linkedin, weight: 4 },
        { label: "contact", text: "Get In Touch", weight: 3 },
        { label: "contact", text: "Send a message", weight: 3 },
      ],
      quickActions: [
        { label: "Open contact", fileId: "contact" },
        { label: "Open resume", fileId: "resume" },
      ],
    },
    {
      id: "page:resume",
      fileId: "resume",
      fileName: resumeFile?.name ?? "resume.pdf",
      extension: resumeFile?.extension ?? "pdf",
      group: "Career",
      title: "Resume",
      subtitle: `${profile.role} | ${profile.location}`,
      fields: [
        { label: "resume", text: "Resume", weight: 6 },
        { label: "name", text: profile.name, weight: 5 },
        { label: "role", text: profile.role, weight: 4 },
        { label: "education", text: profile.education.degree, weight: 3 },
        { label: "education", text: profile.education.university, weight: 3 },
        ...roleSignalTexts.map((text) => ({
          label: "role signal",
          text,
          weight: 3,
        })),
      ],
      quickActions: [
        { label: "Open resume", fileId: "resume" },
        { label: "Open contact", fileId: "contact" },
      ],
    },
    ...projects.map((project) => ({
      id: `project:${project.slug}`,
      fileId: `project:${project.slug}`,
      fileName: `${project.title}.py`,
      extension: "py",
      group: "Projects" as const,
      title: project.title,
      subtitle: `${project.domains.join(" + ")} | ${project.status}`,
      fields: buildProjectFields(project),
      quickActions: [
        { label: "Open project", fileId: `project:${project.slug}` },
        { label: "All projects", fileId: "projects" },
      ],
    })),
    ...experiences.map((experience, index) => ({
      id: `experience:${index}`,
      fileId: "experience",
      fileName: experienceFile?.name ?? "experience.json",
      extension: experienceFile?.extension ?? "json",
      group: "Experience" as const,
      title: experience.role,
      subtitle: `${experience.company} | ${experience.period}`,
      fields: [
        { label: "role", text: experience.role, weight: 6 },
        { label: "company", text: experience.company, weight: 5 },
        { label: "period", text: experience.period, weight: 2 },
        ...experience.description.map((text) => ({
          label: "impact",
          text,
          weight: 4,
        })),
        ...experience.techStack.map((text) => ({
          label: "stack",
          text,
          weight: 3,
        })),
      ],
      quickActions: [
        { label: "Open experience", fileId: "experience" },
        { label: "Contact", fileId: "contact" },
      ],
    })),
    ...skills.map((skill) => ({
      id: `skill:${skill.name.toLowerCase().replace(/\s+/g, "-")}`,
      fileId: "skills",
      fileName: skillsFile?.name ?? "skills.ts",
      extension: skillsFile?.extension ?? "ts",
      group: "Skills" as const,
      title: skill.name,
      subtitle: `${skill.category} • ${skill.publisher}`,
      fields: [
        { label: "skill", text: skill.name, weight: 6 },
        { label: "category", text: skill.category, weight: 4 },
        ...skill.roleFit.map((text) => ({
          label: "role fit",
          text,
          weight: 4,
        })),
        { label: "publisher", text: skill.publisher, weight: 3 },
        { label: "description", text: skill.description, weight: 4 },
        ...skill.keywords.map((text) => ({
          label: "keyword",
          text,
          weight: 4,
        })),
      ],
      quickActions: [
        { label: "Open skills", fileId: "skills" },
        { label: "View projects", fileId: "projects" },
      ],
    })),
  ];

  return entries;
}

function buildContext(text: string, query: string, terms: string[]) {
  const lowerText = text.toLowerCase();
  const matchIndex = lowerText.indexOf(query);
  const firstTermIndex = terms
    .map((term) => lowerText.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  const index = matchIndex >= 0 ? matchIndex : firstTermIndex;

  if (index === undefined || index < 0) {
    return text;
  }

  const start = Math.max(0, index - 42);
  const end = Math.min(text.length, index + Math.max(query.length, 18) + 42);
  let context = text.slice(start, end);

  if (start > 0) context = "..." + context;
  if (end < text.length) context += "...";

  return context;
}

function highlightMatch(text: string, query: string, terms: string[]) {
  if (!query) return text;

  const escaped = [query, ...terms]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.replace(regex, "<<HIGHLIGHT>>$1<</HIGHLIGHT>>");
}

function createSearchResult(
  entry: SearchEntry,
  query: string,
  terms: string[]
): SearchResult | null {
  const lowerQuery = query.toLowerCase();
  const lowerTitle = entry.title.toLowerCase();
  const matches: SearchMatch[] = [];
  let score = 0;

  if (lowerTitle === lowerQuery) score += 80;
  else if (lowerTitle.includes(lowerQuery)) score += 40;

  if (entry.subtitle?.toLowerCase().includes(lowerQuery)) {
    score += 18;
  }

  entry.fields.forEach((field) => {
    const lowerText = field.text.toLowerCase();
    const fullQueryMatch = lowerText.includes(lowerQuery);
    const matchedTerms = terms.filter((term) => lowerText.includes(term));

    if (!fullQueryMatch && matchedTerms.length === 0) return;

    let fieldScore = 0;
    if (fullQueryMatch) fieldScore += field.weight * 6;
    fieldScore += matchedTerms.length * field.weight * 2;
    if (field.label === "title" || field.label === "skill" || field.label === "role") {
      fieldScore += 6;
    }

    score += fieldScore;
    matches.push({
      label: field.label,
      text: field.text,
      context: buildContext(field.text, lowerQuery, terms),
      score: fieldScore,
    });
  });

  if (score === 0) return null;

  const dedupedMatches = matches
    .sort((a, b) => b.score - a.score)
    .filter(
      (match, index, allMatches) =>
        allMatches.findIndex(
          (candidate) =>
            candidate.label === match.label && candidate.context === match.context
        ) === index
    );

  return {
    id: entry.id,
    fileId: entry.fileId,
    fileName: entry.fileName,
    extension: entry.extension,
    group: entry.group,
    title: entry.title,
    subtitle: entry.subtitle,
    matches: dedupedMatches,
    score,
    quickActions: entry.quickActions ?? [{ label: "Open", fileId: entry.fileId }],
  };
}

export default function SearchPanel({ onFileSelect }: SearchPanelProps) {
  const { openFile } = useApp();
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const searchData = useMemo(() => buildSearchData(), []);

  const uniqueExtensions = useMemo(
    () => [...new Set(searchData.map((entry) => entry.extension))],
    [searchData]
  );

  const toggleFilter = useCallback((ext: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(ext)) next.delete(ext);
      else next.add(ext);
      return next;
    });
  }, []);

  const results = useMemo(() => {
    const trimmedQuery = query.trim();
    const lowerQuery = trimmedQuery.toLowerCase();
    const terms = lowerQuery
      .split(/\s+/)
      .map((term) => term.trim())
      .filter((term) => term.length >= 2);

    if (!lowerQuery || lowerQuery.length < 2) return [] as SearchResult[];

    const filteredData =
      activeFilters.size > 0
        ? searchData.filter((entry) => activeFilters.has(entry.extension))
        : searchData;

    return filteredData
      .map((entry) => createSearchResult(entry, lowerQuery, terms))
      .filter(Boolean)
      .sort((a, b) => {
        if (!a || !b) return 0;
        if (b.score !== a.score) return b.score - a.score;
        return a.title.localeCompare(b.title);
      }) as SearchResult[];
  }, [query, searchData, activeFilters]);

  const groupedResults = useMemo(() => {
    const groups = new Map<SearchGroup, SearchResult[]>();

    results.forEach((result) => {
      const existing = groups.get(result.group) ?? [];
      existing.push(result);
      groups.set(result.group, existing);
    });

    return Array.from(groups.entries());
  }, [results]);

  const totalMatches = results.reduce(
    (sum, result) => sum + result.matches.length,
    0
  );

  const quickActions = useMemo(() => {
    const actions: SearchAction[] = [];

    if (results[0]) {
      actions.push({
        label: `Open ${results[0].title}`,
        fileId: results[0].fileId,
      });
    }

    const supplementalActions: SearchAction[] = [
      { label: "Browse projects", fileId: "projects" },
      { label: "Open skills", fileId: "skills" },
      { label: "Open experience", fileId: "experience" },
      { label: "Contact", fileId: "contact" },
      { label: "Resume", fileId: "resume" },
    ];

    supplementalActions.forEach((action) => {
      if (!actions.some((item) => item.fileId === action.fileId)) {
        actions.push(action);
      }
    });

    return actions.slice(0, 5);
  }, [results]);

  const handleResultClick = useCallback(
    (fileId: string) => {
      openFile(fileId);
      onFileSelect?.();
    },
    [openFile, onFileSelect]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="px-3 py-2 shrink-0">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2 top-1/2 -translate-y-1/2"
            style={{ color: "var(--editor-line-number)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, skills, experience, and case studies..."
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="Search portfolio content"
            className="ds-input pl-7 pr-7 py-1.5 text-[12px]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 ds-inline-action ds-inline-action-muted"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="ds-panel-hint">
            <Keyboard size={12} />
            Search projects, case studies, skills, and trust signals
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <span className="ds-panel-hint">Command palette</span>
            <span className="ds-kbd">Ctrl</span>
            <span className="ds-kbd">Shift</span>
            <span className="ds-kbd">P</span>
          </div>
        </div>
      </div>

      <div
        className="px-3 py-1.5 flex flex-wrap gap-1 shrink-0 border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          type="button"
          onClick={() => setActiveFilters(new Set())}
          aria-pressed={activeFilters.size === 0}
          data-state={activeFilters.size === 0 ? "active" : "inactive"}
          className="ds-chip px-2 py-0.5 text-[10px]"
        >
          All
        </button>
        {uniqueExtensions.map((ext) => {
          const isActive = activeFilters.has(ext);
          return (
            <button
              key={ext}
              type="button"
              onClick={() => toggleFilter(ext)}
              aria-pressed={isActive}
              data-state={isActive ? "active" : "inactive"}
              className="ds-chip px-2 py-0.5 text-[10px]"
            >
              <FileIcon extension={ext} size={10} />
              .{ext}
            </button>
          );
        })}
      </div>

      {query.length >= 2 && (
        <div className="px-3 py-1 text-[11px] shrink-0 ds-text-muted">
          {totalMatches > 0
            ? `${totalMatches} matches across ${results.length} result${results.length !== 1 ? "s" : ""}`
            : "No results found"}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {query.length < 2 && (
          <div className="px-3 py-4">
            <div className="ds-empty-state">
              <div className="ds-empty-icon">
                <Sparkles size={16} />
              </div>
              <div className="space-y-1">
                <p className="ds-empty-title">
                  Start with a topic, role, or project signal
                </p>
                <p className="ds-empty-copy">
                  Type at least 2 characters to search the workspace. This panel
                  indexes projects, case studies, trust notes, certifications, and
                  experience details.
                </p>
              </div>
              <div className="ds-empty-actions">
                {[
                  "analytics",
                  "feature engineering",
                  "evaluation",
                  "rag",
                  "deployment",
                ].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="ds-chip px-2.5 py-1 text-[11px]"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="ds-panel-hint">Quick jump</span>
                <span className="ds-kbd">Ctrl</span>
                <span className="ds-kbd">Shift</span>
                <span className="ds-kbd">P</span>
              </div>
            </div>
          </div>
        )}

        {query.length >= 2 && results.length > 0 && (
          <div
            className="px-3 py-2 border-b space-y-2"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="text-[10px] uppercase tracking-wider ds-text-faint">
              Quick Actions
            </div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={`${action.label}-${action.fileId}`}
                  type="button"
                  onClick={() => handleResultClick(action.fileId)}
                  className="ds-chip px-2.5 py-1 text-[11px]"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="px-3 py-4">
            <div className="ds-empty-state">
              <div className="ds-empty-icon">
                <SearchX size={16} />
              </div>
              <div className="space-y-1">
                <p className="ds-empty-title">No matching workspace results</p>
                <p className="ds-empty-copy">
                  Try broader keywords, remove one filter, or jump straight to the
                  page you want.
                </p>
              </div>
              <div className="ds-empty-actions">
                {activeFilters.size > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveFilters(new Set())}
                    className="ds-btn ds-btn-secondary px-3 py-1.5 text-[12px]"
                  >
                    Clear filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleResultClick("projects")}
                  className="ds-btn ds-btn-secondary px-3 py-1.5 text-[12px]"
                >
                  Browse projects
                </button>
                <button
                  type="button"
                  onClick={() => handleResultClick("resume")}
                  className="ds-btn ds-btn-secondary px-3 py-1.5 text-[12px]"
                >
                  Open resume
                </button>
              </div>
            </div>
          </div>
        )}

        {groupedResults.map(([group, groupResults]) => (
          <div key={group} className="py-2">
            <div className="px-3 pb-1 text-[10px] uppercase tracking-wider ds-text-faint">
              {group} ({groupResults.length})
            </div>

            {groupResults.slice(0, 6).map((result) => (
              <div key={result.id} className="mb-2">
                <button
                  type="button"
                  onClick={() => handleResultClick(result.fileId)}
                  className="ds-list-row ds-list-row-soft items-start px-3 py-2 text-left"
                >
                  <FileIcon extension={result.extension} size={14} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[12px] font-medium truncate ds-text-primary">
                        {result.title}
                      </span>
                      <span className="text-[10px] truncate ds-text-faint">
                        {result.fileName}
                      </span>
                    </div>
                    {result.subtitle && (
                      <div className="text-[10px] truncate ds-text-muted">
                        {result.subtitle}
                      </div>
                    )}
                  </div>
                </button>

                <div className="pl-8 pr-3 pt-1 space-y-1">
                  {result.matches.slice(0, 3).map((match, index) => {
                    const highlighted = highlightMatch(
                      match.context,
                      query.trim().toLowerCase(),
                      query
                        .trim()
                        .toLowerCase()
                        .split(/\s+/)
                        .filter((term) => term.length >= 2)
                    );
                    const parts = highlighted.split(/<<HIGHLIGHT>>|<<\/HIGHLIGHT>>/);

                    return (
                      <button
                        key={`${result.id}-${index}`}
                        type="button"
                        onClick={() => handleResultClick(result.fileId)}
                        className="ds-list-row ds-list-row-soft items-start px-2 py-1 text-left"
                      >
                        <FileText
                          size={11}
                          className="mt-0.5 shrink-0"
                          style={{ color: "var(--editor-line-number)" }}
                        />
                        <span className="min-w-0 text-[11px] leading-relaxed ds-text-secondary">
                          <span className="font-medium ds-text-muted capitalize">
                            {match.label}:{" "}
                          </span>
                          {parts.map((part, partIndex) =>
                            partIndex % 2 === 1 ? (
                              <span
                                key={partIndex}
                                style={{
                                  backgroundColor: "var(--selection-bg)",
                                  color: "var(--tab-active-fg)",
                                  fontWeight: 600,
                                }}
                              >
                                {part}
                              </span>
                            ) : (
                              <span key={partIndex}>{part}</span>
                            )
                          )}
                        </span>
                      </button>
                    );
                  })}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.quickActions.map((action) => (
                      <button
                        key={`${result.id}-${action.label}`}
                        type="button"
                        onClick={() => handleResultClick(action.fileId)}
                        className="ds-inline-action text-[11px]"
                      >
                        {action.label}
                        <ArrowRight size={11} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {groupResults.length > 6 && (
              <div className="px-3 text-[10px] ds-text-faint">
                +{groupResults.length - 6} more in {group}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

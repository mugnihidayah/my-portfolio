import { projects } from "./projects";

export interface PortfolioFile {
  id: string;
  name: string;
  extension: string;
  language: string;
  path: string;
}

export const files: PortfolioFile[] = [
  {
    id: "home",
    name: "home.html",
    extension: "html",
    language: "HTML",
    path: "src/components/pages/HomePage.tsx",
  },
  {
    id: "about",
    name: "about.css",
    extension: "css",
    language: "CSS",
    path: "src/components/pages/AboutPage.tsx",
  },
  {
    id: "projects",
    name: "projects.py",
    extension: "py",
    language: "Python",
    path: "src/components/pages/ProjectsPage.tsx",
  },
  {
    id: "experience",
    name: "experience.json",
    extension: "json",
    language: "JSON",
    path: "src/components/pages/ExperiencePage.tsx",
  },
  {
    id: "skills",
    name: "skills.ts",
    extension: "ts",
    language: "TypeScript",
    path: "src/components/pages/SkillsPage.tsx",
  },
  {
    id: "contact",
    name: "contact.tsx",
    extension: "tsx",
    language: "TypeScript React",
    path: "src/components/pages/ContactPage.tsx",
  },
  {
    id: "resume",
    name: "resume.pdf",
    extension: "pdf",
    language: "PDF",
    path: "public/resume.pdf",
  },
];

export function resolveTabFile(tabId: string): PortfolioFile | null {
  const staticFile = files.find((f) => f.id === tabId);
  if (staticFile) return staticFile;

  if (tabId.startsWith("project:")) {
    const slug = tabId.replace("project:", "");
    const project = projects.find((p) => p.slug === slug);
    if (project) {
      return {
        id: tabId,
        name: `${project.title}.py`,
        extension: "py",
        language: "Python",
        path: "src/data/projects.ts",
      };
    }
  }

  return null;
}

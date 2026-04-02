import { projects } from "@/data/projects";

export type ChatMode = "general" | "recruiter";

export interface ChatRequestContext {
  mode: ChatMode;
  activeTab: string | null;
}

export interface ChatSuggestedPrompt {
  id: string;
  label: string;
  prompt: string;
}

export interface ChatQuickAction {
  id: string;
  label: string;
  targetTab: string;
  sectionId?: string;
}

export interface ChatInlineAction {
  id: string;
  label: string;
  targetTab: string;
  sectionId?: string;
}

export interface ChatContextInfo {
  title: string;
  description: string;
}

const pageContextMap: Record<string, ChatContextInfo> = {
  home: {
    title: "Portfolio overview",
    description:
      "Good for quick summaries, strongest projects, and how Mugni positions across AI Engineer and Data Scientist roles.",
  },
  about: {
    title: "Background and positioning",
    description:
      "Helpful for questions about Mugni's background across AI engineering and data science, positioning, and personal interests.",
  },
  projects: {
    title: "Project exploration",
    description:
      "Best for comparing projects, stacks, and which work is most relevant for AI Engineer versus Data Scientist use cases.",
  },
  experience: {
    title: "Experience and impact",
    description: "Useful for work history, business impact, and how Mugni applies AI and data skills.",
  },
  skills: {
    title: "Skills and technical depth",
    description:
      "Helpful for discussing tools, role fit, and where Mugni is strongest today as an AI Engineer, Data Scientist, or hybrid profile.",
  },
  contact: {
    title: "Contact and collaboration",
    description: "Best for next steps, collaboration, and how to reach Mugni quickly.",
  },
  resume: {
    title: "Resume and hiring summary",
    description:
      "Ideal for recruiter-style questions about AI Engineer fit, Data Scientist fit, hiring readiness, and next steps.",
  },
};

export function getActiveProject(activeTab: string | null) {
  if (!activeTab?.startsWith("project:")) return null;
  const slug = activeTab.replace("project:", "");
  return projects.find((project) => project.slug === slug) ?? null;
}

export function getChatContextInfo(
  context: ChatRequestContext
): ChatContextInfo {
  const project = getActiveProject(context.activeTab);

  if (project) {
    return {
      title: `Focused on ${project.title}`,
      description:
        "The assistant will prioritize the current project, including architecture, case study details, concrete artifacts, trust signals, tradeoffs, and results.",
    };
  }

  if (context.mode === "recruiter") {
    return {
      title: "Recruiter mode",
      description:
        "Answers focus on AI Engineer fit, Data Scientist fit, strongest projects, practical impact, and the fastest path to resume or contact details.",
    };
  }

  return (
    pageContextMap[context.activeTab ?? "home"] ?? {
      title: "Portfolio exploration",
      description:
        "Ask about projects, experience, skills, or the best place to start in the portfolio.",
    }
  );
}

export function getSuggestedPrompts(
  context: ChatRequestContext
): ChatSuggestedPrompt[] {
  const project = getActiveProject(context.activeTab);

  if (context.mode === "recruiter") {
    const recruiterPrompts: ChatSuggestedPrompt[] = [
      {
        id: "show-ai-projects",
        label: "AI Eng projects",
        prompt:
          "Show the projects that best support Mugni for AI Engineer roles, and explain why they are the strongest signals.",
      },
      {
        id: "show-ds-projects",
        label: "DS projects",
        prompt:
          "Show the projects that best support Mugni for Data Scientist roles, and explain why they are the strongest signals.",
      },
      {
        id: "why-both-roles",
        label: "Why both roles",
        prompt:
          "Why does Mugni fit both AI Engineer and Data Scientist roles instead of only one of them?",
      },
      {
        id: "compare-role-strengths",
        label: "Compare strengths",
        prompt:
          "Compare Mugni's AI Engineer strengths versus Data Scientist strengths, and explain where each one is most convincing.",
      },
    ];

    if (project) {
      recruiterPrompts[0] = {
        id: "project-ai-fit",
        label: "AI Eng signal",
        prompt: `How does ${project.title} support Mugni's AI Engineer positioning?`,
      };
      recruiterPrompts[1] = {
        id: "project-ds-fit",
        label: "DS signal",
        prompt: `How does ${project.title} support Mugni's Data Scientist positioning, if at all?`,
      };
    }

    return recruiterPrompts;
  }

  if (project) {
    const comparisonTarget =
      projects.find(
        (candidate) =>
          candidate.slug !== project.slug &&
          candidate.domains.some((domain) => project.domains.includes(domain))
      ) ??
      projects.find((candidate) => candidate.slug !== project.slug) ??
      null;

    return [
      {
        id: "project-overview",
        label: "How it works",
        prompt: `Explain how ${project.title} works in a practical, easy-to-follow way.`,
      },
      {
        id: "project-tradeoffs",
        label: "Tradeoffs",
        prompt: `What were the main tradeoffs and engineering decisions in ${project.title}?`,
      },
      {
        id: "project-results",
        label: "Results",
        prompt: `What results, strengths, and lessons came out of ${project.title}?`,
      },
      {
        id: "project-compare",
        label: "Compare",
        prompt: comparisonTarget
          ? `Compare ${project.title} with ${comparisonTarget.title} in terms of use case, architecture, tradeoffs, and what each project proves technically.`
          : `Compare ${project.title} with Mugni's other projects in terms of use case, architecture, tradeoffs, and what each one proves technically.`,
      },
    ];
  }

  if (context.activeTab === "projects") {
    return [
      {
        id: "show-ai-projects",
        label: "AI Eng projects",
        prompt:
          "Show the projects that best represent Mugni's AI Engineer strengths, and explain why.",
      },
      {
        id: "show-ds-projects",
        label: "DS projects",
        prompt:
          "Show the projects that best represent Mugni's Data Scientist strengths, and explain why.",
      },
      {
        id: "why-both-roles",
        label: "Why both roles",
        prompt:
          "Why does Mugni fit both AI Engineer and Data Scientist roles based on the project portfolio?",
      },
      {
        id: "compare-role-strengths",
        label: "Compare strengths",
        prompt:
          "Compare the project evidence for Mugni as an AI Engineer versus as a Data Scientist.",
      },
    ];
  }

  if (context.activeTab === "skills") {
    return [
      {
        id: "skills-ai-fit",
        label: "AI Eng stack",
        prompt:
          "Which skills most strongly support Mugni's AI Engineer positioning, and why?",
      },
      {
        id: "skills-ds-fit",
        label: "DS stack",
        prompt:
          "Which skills most strongly support Mugni's Data Scientist positioning, and why?",
      },
      {
        id: "skills-both-roles",
        label: "Why both roles",
        prompt:
          "Why do Mugni's skills support both AI Engineer and Data Scientist roles?",
      },
      {
        id: "skills-compare-strengths",
        label: "Compare strengths",
        prompt:
          "Compare Mugni's AI Engineer strengths versus Data Scientist strengths based on the skills page.",
      },
    ];
  }

  if (context.activeTab === "resume") {
    return [
      {
        id: "resume-ai-fit",
        label: "AI Eng fit",
        prompt:
          "Summarize Mugni's strongest evidence for AI Engineer roles based on the resume page.",
      },
      {
        id: "resume-ds-fit",
        label: "DS fit",
        prompt:
          "Summarize Mugni's strongest evidence for Data Scientist roles based on the resume page.",
      },
      {
        id: "resume-both-roles",
        label: "Why both roles",
        prompt:
          "Why does Mugni fit both AI Engineer and Data Scientist roles based on this resume?",
      },
      {
        id: "resume-next-step",
        label: "Next step",
        prompt:
          "What is the best next step after reviewing this resume page?",
      },
    ];
  }

  if (context.activeTab === "contact") {
    return [
      {
        id: "contact-fastest",
        label: "Best contact path",
        prompt: "What is the fastest way to contact Mugni and what should I include?",
      },
      {
        id: "contact-collab",
        label: "Collaboration",
        prompt:
          "What kinds of collaboration or roles would fit Mugni best right now?",
      },
      {
        id: "contact-before-reachout",
        label: "Before reaching out",
        prompt:
          "What should I review first before contacting Mugni: projects, resume, or skills?",
      },
    ];
  }

  return [
    {
      id: "show-ai-projects",
      label: "AI Eng projects",
      prompt:
        "Show the projects that best represent Mugni's AI Engineer strengths.",
    },
    {
      id: "show-ds-projects",
      label: "DS projects",
      prompt:
        "Show the projects that best represent Mugni's Data Scientist strengths.",
    },
    {
      id: "why-both-roles",
      label: "Why both roles",
      prompt:
        "Why does Mugni fit both AI Engineer and Data Scientist roles?",
    },
    {
      id: "compare-role-strengths",
      label: "Compare strengths",
      prompt:
        "Compare Mugni's AI Engineer strengths versus Data Scientist strengths.",
    },
  ];
}

export function getQuickActions(
  context: ChatRequestContext
): ChatQuickAction[] {
  const project = getActiveProject(context.activeTab);
  const actions: ChatQuickAction[] = [];

  if (project) {
    actions.push({
      id: "open-current-project",
      label: "Open current project",
      targetTab: `project:${project.slug}`,
    });
    if (project.architecture) {
      actions.push({
        id: "open-architecture",
        label: "Open architecture",
        targetTab: `project:${project.slug}`,
        sectionId: "architecture",
      });
    }
    if (project.trust) {
      actions.push({
        id: "open-trust",
        label: "Show trust signals",
        targetTab: `project:${project.slug}`,
        sectionId: "trust",
      });
    }
  }

  if (context.mode === "recruiter") {
    actions.push(
      { id: "open-resume", label: "Open resume", targetTab: "resume" },
      { id: "open-contact", label: "Open contact", targetTab: "contact" }
    );
  } else {
    actions.push(
      { id: "open-projects", label: "View projects", targetTab: "projects" },
      { id: "open-contact", label: "Open contact", targetTab: "contact" }
    );
  }

  actions.push({
    id: "open-skills",
    label: "View skills",
    targetTab: "skills",
  });

  const seen = new Set<string>();
  return actions.filter((action) => {
    const actionKey = `${action.targetTab}:${action.sectionId ?? ""}`;
    if (seen.has(actionKey)) return false;
    seen.add(actionKey);
    return true;
  });
}

export function getWelcomeMessage(context: ChatRequestContext): string {
  const project = getActiveProject(context.activeTab);

  if (context.mode === "recruiter") {
    return project
      ? `Hi, I am Mugni Hidayah's AI assistant. I am currently focused on ${project.title} and can help you evaluate Mugni's AI Engineer fit, Data Scientist fit, strongest projects, and the fastest path to resume or contact details.`
      : "Hi, I am Mugni Hidayah's AI assistant. Recruiter mode is on, so I can help you quickly evaluate AI Engineer fit, Data Scientist fit, strongest projects, and the best next step to resume or contact details.";
  }

  return project
    ? `Hi, I am Mugni Hidayah's AI assistant. I am currently focused on ${project.title}, so you can ask about the architecture, tradeoffs, results, or what this project says about Mugni's skills.`
    : "Hi, I am Mugni Hidayah's AI assistant. Ask me about Mugni's projects, experience, skills, or where to start exploring the portfolio.";
}

export function getInlineActionsForAssistantMessage(
  content: string,
  context: ChatRequestContext,
  userMessage?: string
): ChatInlineAction[] {
  const lowerContent = content.toLowerCase();
  const lowerUserMessage = userMessage?.trim().toLowerCase() ?? "";
  const focusedProject = getActiveProject(context.activeTab);
  const directlyMentionedProject =
    projects.find((project) =>
      lowerContent.includes(project.title.toLowerCase())
    ) ?? null;

  const isGreetingOnly =
    lowerUserMessage.length > 0 &&
    lowerUserMessage.length <= 24 &&
    /^(hi|hello|hey|halo|hai|yo|sup|selamat pagi|selamat siang|selamat sore|selamat malam)[!. ]*$/.test(
      lowerUserMessage
    );

  if (isGreetingOnly) {
    return [];
  }

  const projectIntentPattern =
    /\b(project|proyek|portfolio|work|this|it|explain|jelaskan|detail|how|bagaimana|stack|architecture|arsitektur|tradeoff|result|hasil|feature|fitur|demo|repo|github|code|build|system)\b/;
  const architectureIntentPattern =
    /\b(architecture|arsitektur|system design|diagram|flow|pipeline|how it works)\b/;
  const trustIntentPattern =
    /\b(trust|proof|evidence|scope|owned|ownership|tradeoff|tradeoffs|metric|metrics|result|results|impact)\b/;
  const compareIntentPattern =
    /\b(compare|comparison|versus|vs|beda|difference|bandingkan)\b/;
  const resumeIntentPattern =
    /\b(resume|cv|hiring|recruiter|fit|role|apply|lamar)\b/;
  const contactIntentPattern =
    /\b(contact|kontak|reach|email|linkedin|get in touch|hubungi)\b/;
  const skillsIntentPattern =
    /\b(skill|skills|stack|technology|technologies|tool|tools|teknologi)\b/;

  const hasProjectIntent =
    projectIntentPattern.test(lowerUserMessage) ||
    projectIntentPattern.test(lowerContent);
  const hasArchitectureIntent =
    architectureIntentPattern.test(lowerUserMessage) ||
    architectureIntentPattern.test(lowerContent);
  const hasTrustIntent =
    trustIntentPattern.test(lowerUserMessage) ||
    trustIntentPattern.test(lowerContent);
  const hasCompareIntent =
    compareIntentPattern.test(lowerUserMessage) ||
    compareIntentPattern.test(lowerContent);
  const hasResumeIntent =
    resumeIntentPattern.test(lowerUserMessage) ||
    resumeIntentPattern.test(lowerContent);
  const hasContactIntent =
    contactIntentPattern.test(lowerUserMessage) ||
    contactIntentPattern.test(lowerContent);
  const hasSkillsIntent =
    skillsIntentPattern.test(lowerUserMessage) ||
    skillsIntentPattern.test(lowerContent);

  const actions: ChatInlineAction[] = [];
  const ctaProject = directlyMentionedProject ?? focusedProject;

  if (ctaProject && hasArchitectureIntent) {
    actions.push({
      id: `architecture-${ctaProject.slug}`,
      label: "Open architecture",
      targetTab: `project:${ctaProject.slug}`,
      sectionId: "architecture",
    });
  }

  if (ctaProject?.trust && hasTrustIntent) {
    actions.push({
      id: `trust-${ctaProject.slug}`,
      label: "Show trust signals",
      targetTab: `project:${ctaProject.slug}`,
      sectionId: "trust",
    });
  }

  if (directlyMentionedProject && hasProjectIntent) {
    actions.push({
      id: `project-${directlyMentionedProject.slug}`,
      label:
        focusedProject?.slug === directlyMentionedProject.slug
          ? "Open this project"
          : `Open ${directlyMentionedProject.title}`,
      targetTab: `project:${directlyMentionedProject.slug}`,
    });
  } else if (focusedProject && hasProjectIntent) {
    actions.push({
      id: `project-${focusedProject.slug}`,
      label: "Open this project",
      targetTab: `project:${focusedProject.slug}`,
    });
  } else if (hasProjectIntent) {
    actions.push({
      id: "projects",
      label: "View projects",
      targetTab: "projects",
    });
  }

  if (hasCompareIntent) {
    actions.push({
      id: "compare-projects",
      label: "Compare projects",
      targetTab: "projects",
    });
  }

  if (context.mode === "recruiter" ? hasResumeIntent || hasContactIntent : hasResumeIntent) {
    actions.push({
      id: "resume",
      label: "View resume",
      targetTab: "resume",
    });
  }

  if (context.mode === "recruiter" ? hasContactIntent || hasResumeIntent : hasContactIntent) {
    actions.push({
      id: "contact",
      label: "Contact Mugni",
      targetTab: "contact",
    });
  }

  if (hasSkillsIntent) {
    actions.push({
      id: "skills",
      label: "View skills",
      targetTab: "skills",
    });
  }

  const seen = new Set<string>();
  return actions
    .filter((action) => {
      const actionKey = `${action.targetTab}:${action.sectionId ?? ""}`;
      if (seen.has(actionKey)) return false;
      seen.add(actionKey);
      return true;
    })
    .slice(0, 4);
}

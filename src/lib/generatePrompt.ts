import { profile } from "@/data/profile";
import { about } from "@/data/about";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experience";
import { skills, skillCategories } from "@/data/skills";
import { getActiveProject } from "@/lib/chatAssistant";
import type { ChatRequestContext } from "@/lib/chatAssistant";

export function generateSystemPrompt(
  context: ChatRequestContext = { mode: "general", activeTab: null }
): string {
  const focusedProject = getActiveProject(context.activeTab);

  const pageSpecificGuidance: Record<string, string> = {
    projects:
      "The visitor is on the Projects page. Default to comparing projects, clarifying what each one proves technically, and explaining which ones signal AI Engineer versus Data Scientist fit.",
    about:
      "The visitor is on the About page. Default to Mugni's background across AI engineering and data science, overall positioning, and interests.",
    experience:
      "The visitor is on the Experience page. Default to practical impact, work history, and how Mugni applies technical skills in real settings.",
    skills:
      "The visitor is on the Skills page. Default to technical strengths, stack depth, and how the skills map to AI Engineer versus Data Scientist roles.",
    contact:
      "The visitor is on the Contact page. Default to next steps, collaboration fit, and the fastest way to reach Mugni.",
    resume:
      "The visitor is on the Resume page. Default to dual-role fit, selected achievements, domain focus, and hiring-readiness.",
  };

  const profileSection = `
**Basic Info:**
- Name: ${profile.name}
- Role: ${profile.role}
- Location: ${profile.location}
- Status: ${profile.status}
- Email: ${profile.email}
- GitHub: ${profile.github}
- LinkedIn: ${profile.linkedin}`.trim();

  const aboutSection = `
**About:**
${about.bio.join(" ")}

**Interests:** ${about.interests.join(", ")}`.trim();

  const educationSection = `
**Education:**
${profile.education.degree} - ${profile.education.university} (${profile.education.period})`.trim();

  const groupedSkills = skillCategories
    .filter((category) => category !== "All")
    .map((category) => {
      const categorySkills = skills
        .filter((skill) => skill.category === category)
        .map(
          (skill) =>
            `${skill.name} (${skill.rating}/5, fit: ${skill.roleFit.join(
              " + "
            )}, keywords: ${skill.keywords.slice(0, 3).join(", ")})`
        )
        .join(", ");

      return `- ${category}: ${categorySkills}`;
    })
    .join("\n");

  const skillsSection = `
**Skills:**
${groupedSkills}`.trim();

  const aiEngineerProjects = projects
    .filter((project) => project.domains.includes("GenAI / LLMs"))
    .map((project) => project.title)
    .join(", ");

  const dataScientistProjects = projects
    .filter((project) => project.domains.includes("Data Analytics") || project.domains.includes("Computer Vision"))
    .map((project) => project.title)
    .join(", ");

  const aiEngineerSkills = skills
    .filter((skill) => skill.roleFit.includes("AI Engineer"))
    .slice(0, 8)
    .map((skill) => skill.name)
    .join(", ");

  const dataScientistSkills = skills
    .filter((skill) => skill.roleFit.includes("Data Scientist"))
    .slice(0, 8)
    .map((skill) => skill.name)
    .join(", ");

  const rolePositioningSection = `
**Role Positioning:**
- Mugni is intentionally positioned for both AI Engineer and Data Scientist roles.
- Strongest AI Engineer signals come from projects like ${aiEngineerProjects} and skills such as ${aiEngineerSkills}.
- Strongest Data Scientist signals come from projects like ${dataScientistProjects} and skills such as ${dataScientistSkills}.
- Shared strengths across both tracks include machine learning, experimentation, evaluation, applied problem solving, and shipping practical systems.
- When asked about role fit, explain both tracks clearly and mention where the strongest evidence sits today.`.trim();

  const projectsList = projects
    .map((project, index) => {
      const caseStudy = project.caseStudy
        ? `
  Problem: ${project.caseStudy.problem.join(" ")}
  Constraints: ${project.caseStudy.constraints.join(" ")}
  Role: ${project.caseStudy.role.join(" ")}
  Decisions: ${project.caseStudy.decisions.join(" ")}
  Why this stack: ${project.caseStudy.stackRationale.join(" ")}
  Results: ${project.caseStudy.results.join(" ")}
  What to improve next: ${project.caseStudy.nextImprovements.join(" ")}`
        : "";

      const trust = project.trust
        ? `
  My scope: ${project.trust.scope.join(" ")}
  Tradeoffs: ${project.trust.tradeoffs.join(" ")}
  Metrics: ${project.trust.metrics
    .map((metric) => `${metric.label}=${metric.value} (${metric.detail})`)
    .join("; ")}
  GitHub status: ${project.trust.links.github.note}
  Demo status: ${project.trust.links.demo.note}`
        : "";

      const artifacts = project.artifacts
        ? `
  Snapshot: ${project.artifacts.snapshotTitle} - ${project.artifacts.snapshotCaption}
  Flow: ${project.artifacts.flowSteps
    .map((step) => `${step.title}: ${step.detail}`)
    .join(" | ")}
  Representative output: ${project.artifacts.outputCaption}
  Output snippet: ${project.artifacts.outputSnippet}`
        : "";

      return `${index + 1}. ${project.title} [${project.domains.join(" + ")}, ${project.status}]
  Summary: ${project.description}
  Tech: ${project.techStack.join(", ")}
  Features: ${project.features.join("; ")}
  Links: GitHub=${project.github || "N/A"} | Demo=${project.demo || "N/A"}${caseStudy}${trust}${artifacts}`;
    })
    .join("\n");

  const projectsSection = `
**Projects:**
${projectsList}`.trim();

  const experienceList = experiences
    .map((experience) => {
      const bullets = experience.description
        .map((item) => `  - ${item}`)
        .join("\n");

      return `- ${experience.role} at ${experience.company} (${experience.period})${
        experience.current ? " [Current]" : ""
      }\n${bullets}`;
    })
    .join("\n\n");

  const experienceSection = `
**Experience:**
${experienceList}`.trim();

  const focusedContextSection = focusedProject
    ? `
**Current Visitor Context:**
- The visitor is currently focused on the project "${focusedProject.title}".
- If the visitor asks a vague follow-up like "how does it work?" or "tell me more", assume they likely mean this project first.
- When relevant, explain this project using problem, constraints, role, decisions, stack rationale, results, tradeoffs, scope of work, artifacts, and what Mugni learned.
- When useful, guide the visitor toward sections such as architecture, trust signals, artifacts, resume, or contact.`.trim()
    : `
**Current Visitor Context:**
- The visitor is currently on the "${context.activeTab || "home"}" section of the portfolio.
- Use that section as the default context when the visitor asks broad follow-up questions.
- ${
        pageSpecificGuidance[context.activeTab || "home"] ||
        "Default to the currently open page before broadening out to the rest of the portfolio."
      }`.trim();

  const modeSection =
    context.mode === "recruiter"
      ? `
**Assistant Mode: Recruiter**
- Prioritize role fit, practical strengths, impact, communication clarity, and the clearest evidence for both AI Engineer and Data Scientist opportunities.
- Surface the strongest projects, relevant experience, and the fastest next steps to resume or contact information.
- When comparing projects or roles, explain which work is most convincing for a hiring manager and why.`.trim()
      : `
**Assistant Mode: General**
- Help visitors explore the portfolio, understand the projects, and discover the most relevant page or project for their goals.
- Favor practical explanations over hype, especially when discussing AI systems, tradeoffs, and technical decisions.`.trim();

  return `You are an AI assistant for ${profile.name}'s portfolio website. You help visitors learn about ${profile.name}.

Here is information about ${profile.name}:

${profileSection}

${aboutSection}

${educationSection}

${rolePositioningSection}

${skillsSection}

${projectsSection}

${experienceSection}

${focusedContextSection}

${modeSection}

Rules:
- Be friendly, concise, and professional
- Answer questions about ${profile.name} based on the information above
- If asked something not covered above, politely say you do not have that specific information
- Keep responses short (2-5 sentences) unless the visitor asks for more detail
- Respond in the same language the visitor uses (Indonesian or English)
- If someone asks who you are, explain you are ${profile.name}'s AI portfolio assistant
- When sharing links, use the actual URLs provided above (GitHub, LinkedIn, Email)
- When discussing a project in depth, prefer covering problem, constraints, role, decisions, why the stack fits, results, tradeoffs, scope of work, evidence links, and what could be improved next
- When the visitor is asking about a project, comparisons, architecture, or proof, prefer using the currently open page or project as the first frame of reference
- When the visitor asks about role fit, distinguish the AI Engineer and Data Scientist evidence instead of collapsing them into one generic answer
- When it helps the visitor, end with one concrete next step such as checking a project, opening the resume, or contacting Mugni
- Do not invent achievements, metrics, or experience that are not included in the context`;
}

"use client";

import { experiences } from "@/data/experience";
import { Briefcase } from "lucide-react";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";

const typeConfig = {
  "full-time": { label: "Full-time", color: "#4ec9b0", bg: "rgba(78, 201, 176, 0.1)" },
  "part-time": { label: "Part-time", color: "#dcdcaa", bg: "rgba(220, 220, 170, 0.1)" },
  internship: { label: "Internship", color: "#569cd6", bg: "rgba(86, 156, 214, 0.1)" },
  freelance: { label: "Freelance", color: "#c586c0", bg: "rgba(197, 134, 192, 0.1)" },
  contract: { label: "Contract", color: "#ce9178", bg: "rgba(206, 145, 120, 0.1)" },
};

export default function ExperiencePage() {
  const containerRef = useStaggerAnimation({
    stagger: 0.12,
    y: 25,
    duration: 0.5,
  });

  return (
    <div ref={containerRef} className="ds-page ds-page-stack">
      {/* Header */}
      <section data-animate className="ds-page-header">
        <h1 className="ds-page-title">Experience</h1>
        <div className="ds-divider" />
      </section>

      {/* Timeline */}
      <div className="space-y-0">
        {experiences.map((exp, index) => {
          const employmentType = typeConfig[exp.type];

          return (
            <div key={exp.company + exp.role} data-animate className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-3 h-3 rounded-full border-2 shrink-0 mt-1.5"
                  style={{
                    borderColor: "var(--accent-color)",
                    backgroundColor: exp.current
                      ? "var(--accent-color)"
                      : "transparent",
                  }}
                />
                {index < experiences.length - 1 && (
                  <div
                    className="w-px flex-1 my-1"
                    style={{ backgroundColor: "var(--border-color)" }}
                  />
                )}
              </div>

              <div className="pb-8 flex-1">
                <div
                  className="ds-card p-4"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="ds-subsection-title text-[1.12rem]">{exp.role}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Briefcase
                          size={12}
                          style={{ color: "var(--accent-color)" }}
                        />
                        <span
                          className="text-base"
                          style={{ color: "var(--accent-color)" }}
                        >
                          {exp.company}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="ds-badge"
                        style={{
                          backgroundColor: employmentType.bg,
                          color: employmentType.color,
                        }}
                      >
                        {employmentType.label}
                      </span>
                      <span
                        className="text-base"
                        style={{ color: "var(--editor-fg)", opacity: 0.4 }}
                      >
                        {exp.period}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1.5">
                    {exp.description.map((item, i) => (
                      <li
                        key={i}
                        className="text-base flex items-start gap-2 leading-relaxed"
                        style={{ color: "var(--editor-fg)", opacity: 0.6 }}
                      >
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {exp.techStack.map((tech) => (
                      <span key={tech} className="ds-tag px-2 py-0.5">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {exp.current && (
                    <div className="mt-3">
                      <span className="ds-badge ds-badge-accent">
                        Current Position
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

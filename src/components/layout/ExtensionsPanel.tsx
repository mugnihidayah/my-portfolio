"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { skills, skillCategories } from "@/data/skills";
import { Search, Star, X, CheckCircle2 } from "lucide-react";
import { techIconMap } from "@/components/icons/TechIcons";

interface ExtensionsPanelProps {
  onFileSelect?: () => void;
}

export default function ExtensionsPanel({ onFileSelect }: ExtensionsPanelProps) {
  const { openFile } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchCategory =
        activeCategory === "All" || skill.category === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: skills.length };
    skills.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleOpenSkills = () => {
    openFile("skills");
    onFileSelect?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="px-3 py-2 shrink-0">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2 top-1/2 -translate-y-1/2"
            style={{ color: "var(--editor-line-number)" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search extensions..."
            autoFocus
            spellCheck={false}
            autoComplete="off"
            className="w-full pl-7 pr-7 py-1.5 text-[12px] rounded-sm border outline-none transition-colors"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-color)",
              color: "var(--editor-fg)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--focus-border)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border-color)")
            }
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:opacity-100"
              style={{ color: "var(--editor-fg)", opacity: 0.4 }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div
        className="flex gap-0 px-1 shrink-0 border-b overflow-x-auto scrollbar-none"
        style={{ borderColor: "var(--border-color)" }}
      >
        {skillCategories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="px-2 py-1.5 text-[10px] font-medium whitespace-nowrap transition-colors relative shrink-0"
              style={{
                color: isActive
                  ? "var(--tab-active-fg)"
                  : "var(--tab-inactive-fg)",
              }}
            >
              {category}
              <span
                className="ml-1 text-[9px]"
                style={{ opacity: 0.4 }}
              >
                {categoryCounts[category] || 0}
              </span>
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ backgroundColor: "var(--accent-color)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div
        className="px-3 py-1.5 text-[10px] shrink-0"
        style={{ color: "var(--editor-fg)", opacity: 0.4 }}
      >
        {filteredSkills.length} installed
      </div>

      {/* Extension List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSkills.map((skill) => (
          <button
            key={skill.name}
            onClick={handleOpenSkills}
            className="flex items-start gap-2.5 w-full px-3 py-2 text-left transition-colors"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--list-hover-bg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {/* Icon */}
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--active-bg)" }}
            >
              {techIconMap[skill.icon] ? (
                (() => {
                  const Icon = techIconMap[skill.icon];
                  return <Icon size={18} />;
                })()
              ) : (
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--accent-color)" }}
                >
                  {skill.icon.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-0.5">
              {/* Name */}
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[12px] font-medium truncate"
                  style={{ color: "var(--tab-active-fg)" }}
                >
                  {skill.name}
                </span>
              </div>

              {/* Publisher */}
              <div
                className="text-[10px] truncate"
                style={{ color: "var(--editor-fg)", opacity: 0.5 }}
              >
                {skill.publisher}
              </div>

              {/* Description */}
              <div
                className="text-[10px] leading-snug line-clamp-2"
                style={{ color: "var(--editor-fg)", opacity: 0.4 }}
              >
                {skill.description}
              </div>

              {/* Bottom row: Stars + Badge */}
              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex items-center gap-px">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={8}
                      fill={
                        i < skill.rating
                          ? "var(--accent-color)"
                          : "transparent"
                      }
                      style={{
                        color:
                          i < skill.rating
                            ? "var(--accent-color)"
                            : "var(--editor-line-number)",
                      }}
                    />
                  ))}
                </div>

                {skill.installed && (
                  <div
                    className="flex items-center gap-0.5 text-[9px]"
                    style={{ color: "var(--accent-color)" }}
                  >
                    <CheckCircle2 size={8} />
                    <span>Installed</span>
                  </div>
                )}

                <span
                  className="text-[9px] px-1 py-px rounded-sm ml-auto"
                  style={{
                    backgroundColor: "var(--active-bg)",
                    color: "var(--editor-fg)",
                    opacity: 0.5,
                  }}
                >
                  {skill.category}
                </span>
              </div>
            </div>
          </button>
        ))}

        {filteredSkills.length === 0 && (
          <div
            className="px-3 py-6 text-center text-[11px]"
            style={{ color: "var(--editor-fg)", opacity: 0.3 }}
          >
            No extensions found
            {searchQuery && (
              <>
                {" "}matching &quot;{searchQuery}&quot;
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer — View All Skills */}
      <button
        onClick={handleOpenSkills}
        className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] font-medium border-t shrink-0 transition-colors"
        style={{
          borderColor: "var(--border-color)",
          color: "var(--accent-color)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--list-hover-bg)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        {activeCategory === "All"
          ? "View All Skills →"
          : `View All ${activeCategory} Skills →`}
      </button>
    </div>
  );
}
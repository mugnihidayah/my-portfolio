"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { profile } from "@/data/profile";
import { about, Certification } from "@/data/about";
import {
  MapPin,
  GraduationCap,
  Heart,
  Award,
  ExternalLink,
  Eye,
  X,
  ImageOff,
  Github as GithubIcon,
} from "lucide-react";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const ContributionSnake = dynamic(
  () => import("@/components/3d/ContributionSnake"),
  {
    ssr: false,
    loading: () => (
      <div className="ds-card w-full h-40 flex items-center justify-center">
        <span className="text-sm ds-text-muted animate-pulse">Loading...</span>
      </div>
    ),
  }
);

function highlightKeywords(text: string, keywords: string[]) {
  const pattern = new RegExp(
    `(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g"
  );
  const parts = text.split(pattern);

  return parts.map((part, i) =>
    keywords.includes(part) ? (
      <strong key={i} style={{ color: "var(--tab-active-fg)" }}>
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function AboutPage() {
  const containerRef = useStaggerAnimation({ stagger: 0.1 });
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [imageError, setImageError] = useState<Set<string>>(new Set());

  const handleImageError = (certName: string) => {
    setImageError((prev) => new Set(prev).add(certName));
  };

  return (
    <div ref={containerRef} className="ds-page ds-page-stack">
      {/* Header */}
      <section data-animate className="ds-page-header">
        <h1 className="ds-page-title">About Me</h1>
        <div className="ds-divider" />
      </section>

      {/* Bio */}
      <section data-animate className="flex flex-col md:flex-row gap-8">
        <div
          className="w-32 h-32 rounded-sm overflow-hidden shrink-0"
          style={{ backgroundColor: "var(--sidebar-bg)" }}
        >
          <Image
            src="/profile.jpg"
            alt={profile.name}
            width={256}
            height={256}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <div className="space-y-4">
          {about.bio.map((paragraph, i) => (
            <p
              key={i}
              className="text-[1.08rem] leading-relaxed ds-text-secondary"
            >
              {highlightKeywords(paragraph, [profile.name, profile.role])}
            </p>
          ))}

          <div className="flex items-center gap-2 text-[1.02rem] ds-text-muted">
            <MapPin size={14} />
            <span>{profile.location}</span>
          </div>
        </div>
      </section>

      <section className="ds-section-stack">
        <div data-animate className="ds-section-header">
          <div className="flex items-center gap-2">
            <GithubIcon size={18} style={{ color: "var(--accent-color)" }} />
            <h2 className="ds-section-title">Coding Activity</h2>
          </div>
          <span className="ds-panel-hint">watch the snake eat contributions 🐍</span>
        </div>
        <div data-animate>
          <ContributionSnake />
        </div>
      </section>

      {/* Education */}
      <section className="ds-section-stack">
        <div data-animate className="flex items-center gap-2">
          <GraduationCap size={20} style={{ color: "var(--accent-color)" }} />
          <h2 className="ds-section-title">Education</h2>
        </div>

        <div
          data-animate
          className="ds-card p-4"
        >
          <h3 className="ds-subsection-title text-[1.08rem]">{profile.education.degree}</h3>
          <p className="text-base mt-1 ds-text-muted">
            {profile.education.university} • {profile.education.period}
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="ds-section-stack">
        <div data-animate className="flex items-center gap-2">
          <Award size={20} style={{ color: "var(--accent-color)" }} />
          <h2 className="ds-section-title">Certifications</h2>
        </div>

        <div data-animate className="ds-card p-4 md:p-5 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="ds-badge ds-badge-success">
              {about.certifications.length} credentials
            </span>
            <span className="ds-badge ds-badge-accent">Verifiable links</span>
            <span className="ds-badge ds-badge-info">Proof images</span>
          </div>
          <p className="text-sm leading-relaxed ds-text-secondary">
            Every certification listed here includes a verification link, and
            most also include a preview image so visitors can validate the
            credential more directly.
          </p>
        </div>

        <div className="space-y-2">
          {about.certifications.map((cert) => {
            const hasImage = cert.image && !imageError.has(cert.name);

            return (
              <div
                key={cert.name}
                data-animate
                className="ds-card ds-card-interactive flex flex-col gap-4 p-4 sm:flex-row sm:items-start"
              >
                {/* Thumbnail */}
                {cert.image && (
                  <button
                    type="button"
                    onClick={() => hasImage && setSelectedCert(cert)}
                    className="shrink-0 overflow-hidden rounded-sm border transition-opacity hover:opacity-80 w-full sm:w-auto sm:self-start"
                    style={{
                      borderColor: "var(--border-color)",
                      cursor: hasImage ? "pointer" : "default",
                    }}
                  >
                    <div
                      className="flex h-28 w-full items-center justify-center px-2 py-2 sm:h-20 sm:w-30 md:h-22 md:w-34"
                      style={{ backgroundColor: "var(--active-bg)" }}
                    >
                      {hasImage ? (
                        <Image
                          src={cert.image}
                          alt={cert.name}
                          width={176}
                          height={124}
                          className="h-full w-full object-contain"
                          onError={() => handleImageError(cert.name)}
                        />
                      ) : (
                        <ImageOff
                          size={18}
                          style={{ color: "var(--editor-line-number)" }}
                        />
                      )}
                    </div>
                  </button>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="ds-subsection-title text-[1.02rem]">{cert.name}</h3>
                  <p className="text-base ds-text-muted">
                    {cert.issuer} • {cert.year}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {cert.credentialUrl && (
                      <span className="ds-badge ds-badge-success">
                        Verifiable
                      </span>
                    )}
                    {hasImage && (
                      <span className="ds-badge ds-badge-info">
                        Preview available
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-1">
                    {hasImage && (
                      <button
                        type="button"
                        onClick={() => setSelectedCert(cert)}
                        className="ds-inline-action cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ds-inline-action ds-inline-action-muted"
                      >
                        <ExternalLink size={12} />
                        <span>Verify</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interests */}
      <section className="ds-section-stack">
        <div data-animate className="flex items-center gap-2">
          <Heart size={20} style={{ color: "var(--accent-color)" }} />
          <h2 className="ds-section-title">Interests</h2>
        </div>

        <div data-animate className="flex flex-wrap gap-2">
          {about.interests.map((interest) => (
            <span key={interest} className="ds-tag px-3 py-1 text-base">
              {interest}
            </span>
          ))}
        </div>
      </section>

      {/* Certificate Image Dialog */}
      <Dialog
        open={selectedCert !== null}
        onOpenChange={(open) => !open && setSelectedCert(null)}
      >
        <DialogContent
          className="max-w-2xl w-[90vw] p-0 overflow-hidden border"
          style={{
            backgroundColor: "var(--editor-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <DialogHeader
            className="flex flex-row items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="space-y-0.5 w-full">
              <DialogTitle
                className="text-base font-semibold text-center"
                style={{ color: "var(--tab-active-fg)" }}
              >
                {selectedCert?.name}
              </DialogTitle>
              <p
                className="text-sm text-center ds-text-muted"
              >
                {selectedCert?.issuer} • {selectedCert?.year}
              </p>
            </div>
            <DialogClose className="ds-inline-action ds-inline-action-muted shrink-0 p-1">
              <X size={16} />
            </DialogClose>
          </DialogHeader>

          {selectedCert?.image && (
            <div className="relative w-full">
              <Image
                src={selectedCert.image}
                alt={selectedCert.name}
                width={800}
                height={600}
                className="w-full h-auto object-contain"
                style={{ backgroundColor: "var(--sidebar-bg)" }}
              />
            </div>
          )}

          {selectedCert?.credentialUrl && (
            <div
              className="px-4 py-3 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <a
                href={selectedCert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ds-inline-action text-sm"
              >
                <ExternalLink size={12} />
                <span>Verify Credential</span>
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useRef, useCallback } from "react";
import { ArrowUpRight, Code2 } from "lucide-react";
import type { Project } from "../../../types/dashboard.types";

/* ── Normalised project shape used by the card ─────────────────────────── */
interface NormalisedProject {
  id: number | string;
  name: string;
  description: string;
  image: string;
  link: string;
  sourceCode: string;
  skills: string[];
}

function normalise(p: Project): NormalisedProject {
  const skillList = (p.skills?.length ? p.skills : p.Skills ?? p.technologies ?? p.Technologies ?? []).filter(Boolean);
  const liveLink = p.link || p.url || p.liveDemo || p.livePreview || "";
  const repoLink = p.sourceCode || p.sourceCodeUrl || p.repo || p.github || p.repository || "";

  return {
    id: p.id,
    name: p.name || p.Name || "Untitled Project",
    description: p.description || p.Content || "",
    image: p.image || "",
    link: liveLink,
    sourceCode: repoLink,
    skills: skillList.map((skill) => String(skill).trim().replace(/^"+|"+$/g, "")),
  };
}

/* ── Props ─────────────────────────────────────────────────────────────── */
interface PortfolioCardProps {
  project: Project;
  index: number;
  cardRef?: (el: HTMLElement | null) => void;
}

const MAX_VISIBLE_TAGS = 5;

export default function PortfolioCard({ project, index, cardRef }: PortfolioCardProps) {
  const p = normalise(project);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const visibleSkills = tagsExpanded ? p.skills : p.skills.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = p.skills.length - MAX_VISIBLE_TAGS;

  const handleImgError = useCallback(() => setImgError(true), []);
  const handleImgLoad  = useCallback(() => setImgLoaded(true), []);

  /* Format index e.g. 01, 02 … */
  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={cardRef}
      className="proj-card"
      aria-label={`Project: ${p.name}`}
    >
      {/* Image area */}
      <div className="proj-card-img-wrap">
        <div className="proj-card-img-inner">
          {!imgError && p.image ? (
            <>
              {/* Skeleton shown until image loads */}
              {!imgLoaded && <div className="proj-card-img-skeleton" aria-hidden="true" />}
              <img
                ref={imgRef}
                src={p.image}
                alt={p.name}
                loading="lazy"
                decoding="async"
                onError={handleImgError}
                onLoad={handleImgLoad}
                className={`proj-card-img${imgLoaded ? " proj-card-img--loaded" : ""}`}
              />
            </>
          ) : (
            <div className="proj-card-img-fallback" aria-label="Image unavailable">
              <span className="proj-card-img-fallback-icon" aria-hidden="true">◻</span>
              <span className="proj-card-img-fallback-text">Preview unavailable</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="proj-card-overlay" aria-hidden="true" />

          {/* Index badge on image */}
          <span className="proj-card-index" aria-hidden="true">{indexLabel}</span>
        </div>
      </div>

      {/* Content */}
      <div className="proj-card-body">
        {/* Accent line */}
        <span className="proj-card-accent-line" aria-hidden="true" />

        <h3 className="proj-card-title">{p.name}</h3>

        {p.description && (
          <p className="proj-card-desc">{p.description}</p>
        )}

        {/* Tech tags */}
        {p.skills.length > 0 && (
          <div className="proj-card-tags" aria-label="Technologies used">
            {visibleSkills.map((skill, i) => (
              <span key={`${skill}-${i}`} className="proj-tag">
                {skill}
              </span>
            ))}
            {!tagsExpanded && hiddenCount > 0 && (
              <button
                type="button"
                className="proj-tag proj-tag--more"
                onClick={() => setTagsExpanded(true)}
                aria-label={`Show ${hiddenCount} more technologies`}
              >
                +{hiddenCount}
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="proj-card-actions">
          {p.link ? (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="proj-action proj-action--primary"
              aria-label={`Open live preview of ${p.name}`}
            >
              Live Preview
              <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
            </a>
          ) : null}

          {p.sourceCode ? (
            <a
              href={p.sourceCode}
              target="_blank"
              rel="noopener noreferrer"
              className="proj-action proj-action--secondary"
              aria-label={`Open source code for ${p.name}`}
            >
              <Code2 size={14} strokeWidth={2} aria-hidden="true" />
              Source Code
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

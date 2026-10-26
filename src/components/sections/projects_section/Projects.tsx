import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectKeys } from "../../../queries/projects.queries";
import gsap from "gsap";
import PortfolioCard from "./ProjectCard";
import "./Projects.css";

/* ── Loading skeletons ──────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="proj-skeleton" aria-hidden="true">
      <div className="proj-skeleton-img" />
      <div className="proj-skeleton-body">
        <div className="proj-skeleton-line proj-skeleton-line--title" />
        <div className="proj-skeleton-line proj-skeleton-line--desc" />
        <div className="proj-skeleton-line proj-skeleton-line--desc proj-skeleton-line--short" />
        <div className="proj-skeleton-tags">
          <div className="proj-skeleton-tag" />
          <div className="proj-skeleton-tag" />
          <div className="proj-skeleton-tag proj-skeleton-tag--wide" />
        </div>
      </div>
    </div>
  );
}

/* ── Main Projects Section ──────────────────────────────────────────────── */
export default function Projects() {
  const { data: projects, isLoading, isError, error, refetch } = useQuery(projectKeys.list());

  const sectionRef      = useRef<HTMLElement>(null);
  const eyebrowRef      = useRef<HTMLDivElement>(null);
  const titleRef        = useRef<HTMLHeadingElement>(null);
  const lineRef         = useRef<HTMLSpanElement>(null);
  const descRef         = useRef<HTMLParagraphElement>(null);
  const countRef        = useRef<HTMLSpanElement>(null);
  const cardRefs        = useRef<(HTMLElement | null)[]>([]);

  /* ── Entrance animation ─────────────────────────────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const headerEls = [eyebrowRef.current, titleRef.current, lineRef.current, descRef.current, countRef.current];

    headerEls.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, y: 20 });
    });
    if (lineRef.current) gsap.set(lineRef.current, { scaleX: 0, opacity: 1 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const tl = gsap.timeline({ overwrite: "auto" });
          tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" })
            .to(titleRef.current,   { opacity: 1, y: 0, duration: 0.8,  ease: "power3.out" }, "-=0.45")
            .to(lineRef.current,    { scaleX: 1, duration: 0.7, ease: "power2.inOut" },        "-=0.5")
            .to(descRef.current,    { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },  "-=0.45")
            .to(countRef.current,   { opacity: 1, y: 0, duration: 0.5,  ease: "power2.out" },  "-=0.35");

          observer.disconnect();
        });
      },
      { threshold: 0 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* ── Card entrance animation (fires when data arrives) ─────────────── */
  useEffect(() => {
    if (!projects?.length) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 40 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
          });

          observer.disconnect();
        });
      },
      { threshold: 0 },
    );

    const gridEl = sectionRef.current?.querySelector(".proj-grid");
    if (gridEl) observer.observe(gridEl);

    return () => observer.disconnect();
  }, [projects]);

  /* Derive count label e.g. "05 PROJECTS" */
  const countLabel = projects?.length
    ? `${String(projects.length).padStart(2, "0")} PROJECT${projects.length !== 1 ? "S" : ""}`
    : null;

  return (
    <section id="projects" ref={sectionRef} className="proj-section">
      <div className="proj-container">
        {/* Header */}
        <header className="proj-header">
          <div ref={eyebrowRef} className="proj-eyebrow-wrap">
            <span className="proj-eyebrow-dot" aria-hidden="true" />
            <span className="proj-eyebrow">SELECTED WORK</span>
          </div>

          <div className="proj-title-mask">
            <h2 ref={titleRef} className="proj-title">
              Projects &amp;{" "}
              <em className="proj-title-italic">Experiments</em>
            </h2>
          </div>

          <div className="proj-header-line-wrap" aria-hidden="true">
            <span ref={lineRef} className="proj-header-line" />
          </div>

          <div className="proj-header-meta">
            <p ref={descRef} className="proj-description">
              A selection of digital experiences, interfaces, and products built
              with attention to detail.
            </p>
            {countLabel && (
              <span ref={countRef} className="proj-count" aria-label={countLabel}>
                {countLabel}
              </span>
            )}
          </div>
        </header>

        {/* Loading state */}
        {isLoading && (
          <div className="proj-grid" aria-busy="true" aria-label="Loading projects">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="proj-error" role="alert">
            <p className="proj-error-msg">
              {error instanceof Error
                ? error.message
                : "Failed to load projects. Please try again."}
            </p>
            <button
              type="button"
              className="proj-error-retry"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && projects && projects.length === 0 && (
          <div className="proj-empty" aria-live="polite">
            <p className="proj-empty-msg">No projects yet. Check back soon.</p>
          </div>
        )}

        {/* Projects grid */}
        {!isLoading && !isError && projects && projects.length > 0 && (
          <div className="proj-grid">
            {projects.map((project, index) => (
              <PortfolioCard
                key={project.id}
                project={project}
                index={index}
                cardRef={(el) => {
                  cardRefs.current[index] = el;
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

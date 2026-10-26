import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectKeys } from "../../../queries/projects.queries";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
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
  const sliderRef       = useRef<HTMLDivElement>(null);
  const pointerInsideRef = useRef(false);
  const focusInsideRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [slidesPerPage, setSlidesPerPage] = useState(() =>
    window.matchMedia("(max-width: 600px)").matches ? 1 : 2,
  );

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

    const sliderEl = sliderRef.current;
    if (sliderEl) observer.observe(sliderEl);

    return () => observer.disconnect();
  }, [projects]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 600px)");
    const updateSlidesPerPage = () => {
      setSlidesPerPage(mobileQuery.matches ? 1 : 2);
    };

    updateSlidesPerPage();
    mobileQuery.addEventListener("change", updateSlidesPerPage);

    return () => {
      mobileQuery.removeEventListener("change", updateSlidesPerPage);
    };
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setPrefersReducedMotion(motionQuery.matches);
    };

    motionQuery.addEventListener("change", updateMotionPreference);
    return () => {
      motionQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  function updateActiveSlide() {
    const slider = sliderRef.current;
    if (!slider) return;

    const slides = Array.from(slider.children);
    const nextIndex = slides.reduce(
      (closestIndex, slide, index) => {
        const closestSlide = slides[closestIndex];
        return Math.abs(slide.getBoundingClientRect().left - slider.getBoundingClientRect().left) <
          Math.abs(closestSlide.getBoundingClientRect().left - slider.getBoundingClientRect().left)
          ? index
          : closestIndex;
      },
      0,
    );

    setActiveIndex((currentIndex) =>
      currentIndex === nextIndex ? currentIndex : nextIndex,
    );
  }

  function goToSlide(index: number) {
    const slide = sliderRef.current?.children.item(index);
    if (!slide) return;

    slide.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "nearest",
      inline: "start",
    });
    setActiveIndex(index);
  }

  useEffect(() => {
    const pageCount = Math.ceil((projects?.length ?? 0) / slidesPerPage);
    if (
      isLoading ||
      isError ||
      pageCount < 2 ||
      isAutoplayPaused ||
      prefersReducedMotion
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (
        document.hidden ||
        pointerInsideRef.current ||
        focusInsideRef.current
      ) {
        return;
      }

      const currentPage = Math.floor(activeIndex / slidesPerPage);
      const nextPage = (currentPage + 1) % pageCount;
      const nextIndex = nextPage * slidesPerPage;
      const slide = sliderRef.current?.children.item(nextIndex);
      if (!slide) return;

      slide.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
      setActiveIndex(nextIndex);
    }, 5500);

    return () => window.clearInterval(intervalId);
  }, [
    activeIndex,
    isAutoplayPaused,
    isError,
    isLoading,
    prefersReducedMotion,
    projects?.length,
    slidesPerPage,
  ]);

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

        {/* Projects slider */}
        {!isLoading && !isError && projects && projects.length > 0 && (
          <div
            className="proj-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="Selected projects"
            onMouseEnter={() => {
              pointerInsideRef.current = true;
            }}
            onMouseLeave={() => {
              pointerInsideRef.current = false;
            }}
            onFocusCapture={() => {
              focusInsideRef.current = true;
            }}
            onBlurCapture={(event) => {
              if (
                !(event.relatedTarget instanceof Node) ||
                !event.currentTarget.contains(event.relatedTarget)
              ) {
                focusInsideRef.current = false;
              }
            }}
          >
            <div
              ref={sliderRef}
              className="proj-slider-track"
              onScroll={updateActiveSlide}
              tabIndex={0}
              aria-label="Project slides"
            >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="proj-slider-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${projects.length}: ${project.name || project.Name || "Untitled Project"}`}
              >
                <PortfolioCard
                  project={project}
                  index={index}
                  cardRef={(el) => {
                    cardRefs.current[index] = el;
                  }}
                />
              </div>
            ))}
            </div>

            {projects.length > 1 && (
              <div className="proj-slider-controls">
                <p className="proj-slider-position" aria-live="polite">
                  <span>
                    {String(Math.floor(activeIndex / slidesPerPage) + 1).padStart(2, "0")}
                  </span>
                  <span className="proj-slider-position-divider">/</span>
                  {String(Math.ceil(projects.length / slidesPerPage)).padStart(2, "0")}
                </p>

                <div className="proj-slider-progress">
                  {Array.from(
                    { length: Math.ceil(projects.length / slidesPerPage) },
                    (_, pageIndex) => (
                    <button
                      key={pageIndex}
                      type="button"
                      className={`proj-slider-progress-step${
                        Math.floor(activeIndex / slidesPerPage) === pageIndex
                          ? " is-active"
                          : ""
                      }`}
                      onClick={() => goToSlide(pageIndex * slidesPerPage)}
                      aria-label={`Go to project page ${pageIndex + 1}`}
                    />
                    ),
                  )}
                </div>

                <div className="proj-slider-buttons">
                  <button
                    type="button"
                    className="proj-slider-button proj-slider-autoplay"
                    aria-label={
                      isAutoplayPaused ? "Resume automatic sliding" : "Pause automatic sliding"
                    }
                    aria-pressed={isAutoplayPaused}
                    onClick={() => setIsAutoplayPaused((paused) => !paused)}
                  >
                    {isAutoplayPaused ? (
                      <Play size={16} strokeWidth={1.5} aria-hidden="true" />
                    ) : (
                      <Pause size={16} strokeWidth={1.5} aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="proj-slider-button"
                    aria-label="Previous project"
                    onClick={() => goToSlide(Math.max(0, activeIndex - 1))}
                    disabled={activeIndex === 0}
                  >
                    <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="proj-slider-button"
                    aria-label="Next project"
                    onClick={() =>
                      goToSlide(Math.min(projects.length - 1, activeIndex + 1))
                    }
                    disabled={activeIndex === projects.length - 1}
                  >
                    <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

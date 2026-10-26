import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Hero.css";

const highlightWords = [
  "matter.",
  "inspire.",
  "connect.",
  "create.",
  "evolve.",
  "delight.",
  "empower.",
  "impact.",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const section = sectionRef.current;
    const context = section && !prefersReducedMotion
      ? gsap.context(() => {
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(".hero-badge", { opacity: 0, y: 16, duration: 0.6 })
            .from(".hero-line-one", { opacity: 0, y: 36, duration: 0.75 }, "-=0.25")
            .from(".hero-line-two", { opacity: 0, y: 36, duration: 0.75 }, "-=0.5")
            .from(".hero-line-three", { opacity: 0, y: 36, duration: 0.75 }, "-=0.5")
            .from(".hero-description", { opacity: 0, y: 18, duration: 0.65 }, "-=0.35")
            .from(".hero-scroll-indicator", { opacity: 0, y: 14, duration: 0.6 }, "-=0.2");
        }, section)
      : null;

    const intervalId = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % highlightWords.length);
    }, 2000);

    return () => {
      window.clearInterval(intervalId);
      context?.revert();
    };
  }, []);

  return (
    <section id="home" ref={sectionRef} className="hero-section">
      <div className="hero-content">
        <div className="hero-copy">
          <span className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            Frontend Developer
          </span>

          <h1 className="hero-title">
            <span className="hero-line hero-line-one">Building digital</span>
            <span className="hero-line hero-line-two">experiences that</span>
            <span className="hero-line hero-line-three">
              <span className="hero-highlight" aria-live="polite">
                <span key={wordIndex} className="hero-word-box">
                  <span className="hero-word-mask">
                    <span className="hero-word-text">
                      {highlightWords[wordIndex]}
                    </span>
                  </span>
                  <svg
                    className="hero-word-line"
                    viewBox="0 0 200 18"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d="M3 13 C52 3, 143 2, 197 11" />
                  </svg>
                </span>
              </span>
            </span>
          </h1>

          <p className="hero-description">
            Frontend Developer crafting modern, interactive web experiences
            with React, Next.js, and a strong eye for design.
          </p>
        </div>
      </div>
      <button
        type="button"
        className="hero-scroll-indicator"
        aria-label="Scroll to the next section"
        onClick={() => {
          document.getElementById("about")?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
          });
        }}
      >
        <span className="hero-scroll-line" aria-hidden="true" />
        <span className="hero-scroll-mouse" aria-hidden="true">
          <span className="hero-scroll-dot" />
        </span>
        <span className="hero-scroll-label">Scroll to explore</span>
      </button>
    </section>
  );
}

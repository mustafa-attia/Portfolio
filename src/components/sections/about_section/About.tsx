import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./About.css";

const stats = [
  { value: "4+", label: "Years of Learning" },
  { value: "15+", label: "Projects Completed" },
  { value: "10+", label: "Technologies Used" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const context = gsap.context(() => {
      gsap.set(".about-header, .about-portrait-wrap, .about-bio", {
      opacity: 0,
      y: 24,
      });
      gsap.set(".about-stat-item", { opacity: 0, y: 16 });
    }, section);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        context.add(() => {
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .to(".about-header", { opacity: 1, y: 0, duration: 0.7 })
            .to(".about-portrait-wrap", { opacity: 1, y: 0, duration: 0.8 }, "-=0.35")
            .to(".about-bio", { opacity: 1, y: 0, duration: 0.8 }, "-=0.55")
            .to(".about-stat-item", { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 }, "-=0.4");
        });

        observer.disconnect();
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      context.revert();
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="about-container">
        {/* Section Heading */}
        <div className="about-header">
          <span className="about-eyebrow">About Me</span>
          <h2 className="about-title">
            Hi, I'm <span className="about-title-name">Mustafa</span>
          </h2>
        </div>

        {/* Two-Column Grid */}
        <div className="about-grid">
          {/* Left Column — Portrait */}
          <div className="about-portrait-wrap">
            <div className="about-portrait-frame">
              <div className="about-portrait-inner">
                <img
                  src="/profile.jpg"
                  alt="Mustafa - Frontend Developer"
                  width={800}
                  height={800}
                  decoding="async"
                  className="about-portrait-img"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Circular decorative detail below portrait */}
            <div className="about-portrait-ornament" aria-hidden="true">
              <span className="about-ornament-ring">
                <span className="about-ornament-dot" />
              </span>
            </div>
          </div>

          {/* Right Column — Biography */}
          <div className="about-bio">
            <p className="about-paragraph">
              I am a <strong>Frontend Developer</strong> crafting modern,
              interactive web experiences with React, Next.js, and TypeScript.
              My work combines clean code architecture with a refined aesthetic,
              transforming creative visions into high-performance, polished digital interfaces.
            </p>

            <p className="about-paragraph">
              With a strong emphasis on editorial elegance and responsive nuance,
              I obsess over micro-interactions, typography hierarchy, and effortless usability.
              Every layout is built with intention, ensuring seamless accessibility across all screens.
            </p>

            {/* Statistics Row */}
            <div className="about-stats-row">
              {stats.map((item) => (
                <div key={item.label} className="about-stat-item">
                  <span className="about-stat-number">{item.value}</span>
                  <span className="about-stat-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

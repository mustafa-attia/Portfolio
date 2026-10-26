
import { useEffect, useRef } from "react";
import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  ElementType,
} from "react";
import {
  ArrowLeftRight,
  Atom,
  Braces,
  Code2,
  FileCode,
  FileCode2,
  GitBranch,
  Globe,
  LayoutGrid,
  Package,
  Palette,
  Radio,
  Route,
  Send,
  Sparkles,
  Wind,
  Workflow,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import "./Skills.css";

type IconProps = ComponentPropsWithoutRef<"svg"> & {
  size?: number | string;
};

const GithubIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

interface Skill {
  name: string;
  Icon: ElementType;
  category: string;
}

const allSkills: Skill[] = [
  { name: "HTML5", Icon: Code2, category: "Core" },
  { name: "CSS3", Icon: Palette, category: "Core" },
  { name: "JavaScript", Icon: FileCode2, category: "Core" },
  { name: "TypeScript", Icon: FileCode, category: "Core" },
  { name: "JSON", Icon: Braces, category: "Core" },

  { name: "React", Icon: Atom, category: "Frontend" },
  { name: "Next.js", Icon: Sparkles, category: "Frontend" },
  { name: "React Router", Icon: Route, category: "Frontend" },
  { name: "Redux", Icon: Workflow, category: "Frontend" },
  { name: "Tailwind CSS", Icon: Wind, category: "Frontend" },
  { name: "Bootstrap", Icon: LayoutGrid, category: "Frontend" },

  { name: "REST APIs", Icon: Globe, category: "API" },
  { name: "Axios", Icon: ArrowLeftRight, category: "API" },
  { name: "Fetch API", Icon: Radio, category: "API" },

  { name: "Git", Icon: GitBranch, category: "Tools" },
  { name: "GitHub", Icon: GithubIcon, category: "Tools" },
  { name: "Postman", Icon: Send, category: "Tools" },
  { name: "Vite", Icon: Zap, category: "Tools" },
  { name: "npm", Icon: Package, category: "Tools" },
];

const row1 = allSkills.slice(0, 10);
const row2 = allSkills.slice(10);

interface SkillsRowProps {
  skills: Skill[];
  reversed?: boolean;
  duration?: number;
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      const headerElements = [
        eyebrowRef.current,
        titleRef.current,
        descriptionRef.current,
      ].filter(Boolean);

      gsap.set(headerElements, {
        autoAlpha: 0,
        y: 22,
      });

      gsap.set(lineRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      gsap.set(
        section.querySelectorAll(".skills-track-row, .skills-footer-strip"),
        {
          autoAlpha: 0,
          y: 24,
        },
      );

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (!entry?.isIntersecting) return;

          const timeline = gsap.timeline({
            defaults: {
              ease: "power3.out",
              overwrite: "auto",
            },
          });

          timeline
            .to(eyebrowRef.current, {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
            })
            .to(
              titleRef.current,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.85,
              },
              "-=0.35",
            )
            .to(
              lineRef.current,
              {
                scaleX: 1,
                duration: 0.8,
                ease: "power2.inOut",
              },
              "-=0.45",
            )
            .to(
              descriptionRef.current,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.65,
              },
              "-=0.4",
            )
            .to(
              section.querySelectorAll(".skills-track-row"),
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.15,
              },
              "-=0.15",
            )
            .to(
              footerRef.current,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
              },
              "-=0.2",
            );

          observer.disconnect();
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px",
        },
      );

      observer.observe(section);

      return () => observer.disconnect();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="skills-section"
      aria-labelledby="skills-title"
    >
      <div className="skills-container">
        <header ref={headerRef} className="skills-header">
          <div ref={eyebrowRef} className="skills-eyebrow-wrap">
            <span className="skills-eyebrow-dot" aria-hidden="true" />
            <span className="skills-eyebrow">WHAT I WORK WITH</span>
          </div>

          <h2 ref={titleRef} id="skills-title" className="skills-title">
            Skills <span className="skills-title-ampersand">&</span>{" "}
            <em className="skills-title-italic">Technologies</em>
          </h2>

          <div className="skills-header-line-wrap" aria-hidden="true">
            <span ref={lineRef} className="skills-header-line" />
            <span className="skills-header-line-dot" />
          </div>

          <p ref={descriptionRef} className="skills-description">
            The tools and technologies I use to build modern, responsive, and
            engaging digital experiences.
          </p>
        </header>
      </div>

      <div ref={rowsRef} className="skills-tracks-wrapper">
        <MarqueeRow
          skills={row1}
          duration={72}
        />

        <MarqueeRow
          skills={row2}
          reversed
          duration={72}
        />
      </div>

      <div className="skills-container">
        <footer ref={footerRef} className="skills-footer-strip">
          <span className="skills-footer-flourish" aria-hidden="true" />
          <span className="skills-footer-badge">
            <Sparkles size={13} strokeWidth={1.6} aria-hidden="true" />
            Built to keep learning
          </span>
          <span className="skills-footer-flourish" aria-hidden="true" />
        </footer>
      </div>
    </section>
  );
}

function MarqueeRow({
  skills,
  reversed = false,
  duration = 48,
}: SkillsRowProps) {
  return (
    <div
      className={`skills-track-row${reversed ? " skills-track-row--reversed" : ""}`}
    >
      <ul className="skills-sr-only" aria-label="Skills">
        {skills.map((skill) => (
          <li key={skill.name}>{skill.name}</li>
        ))}
      </ul>

      <div className="skills-track-viewport">
        <div className="skills-track-fade skills-track-fade--left" aria-hidden="true" />
        <div className="skills-track-fade skills-track-fade--right" aria-hidden="true" />

        <div
          className="skills-track-inner"
          style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
          aria-hidden="true"
        >
          {[false, true].map((isDuplicate) => (
            <div
              key={isDuplicate ? "duplicate" : "original"}
              className="skills-track-group"
            >
              {Array.from({ length: 4 }, (_, repeatIndex) => (
                <div className="skills-track-set" key={repeatIndex}>
                  {skills.map((skill) => {
                    const Icon = skill.Icon;

                    return (
                      <div key={skill.name} className="skill-pill">
                        <span className="skill-pill-icon" aria-hidden="true">
                          <Icon size={17} strokeWidth={1.7} />
                        </span>

                        <span className="skill-pill-name">{skill.name}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import "./Footer.css";

const footerLinks = [
  { label: "Home", section: "home", href: "/#home" },
  { label: "About", section: "about", href: "/#about" },
  { label: "Skills", section: "skills", href: "/#skills" },
  { label: "Projects", section: "projects", href: "/#projects" },
];

type FooterProps = {
  onNavigateToSection: (section: string) => void;
  onOpenContact: () => void;
};

export default function Footer({ onNavigateToSection, onOpenContact }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      footer.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`editorial-footer${isVisible ? " is-visible" : ""}`}
    >
      <div className="footer-inner">
        <div className="footer-opening">
          <div className="footer-copy">
            <p className="footer-eyebrow">A good place to begin</p>
            <h2 className="footer-title">
              Have an idea?
              <br />
              Let&apos;s make it <em>matter.</em>
            </h2>
            <p className="footer-description">
              Have a project in mind or just want to connect? I&apos;m always
              open to interesting ideas and meaningful collaborations.
            </p>
          </div>

          <button className="footer-cta" type="button" onClick={onOpenContact}>
            <span>LET&apos;S TALK</span>
            <ArrowUpRight aria-hidden="true" size={19} strokeWidth={1.7} />
          </button>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <a
            className="footer-signature"
            href="/#home"
            aria-label="MA, back to home"
            onClick={(event) => {
              event.preventDefault();
              onNavigateToSection("home");
            }}
          >
            MA<span>.</span>
          </a>

          <nav className="footer-navigation" aria-label="Footer navigation">
            {footerLinks.map(({ label, section, href }) => (
              <a
                key={href}
                href={href}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigateToSection(section);
                }}
              >
                {label}
              </a>
            ))}
            <button type="button" onClick={onOpenContact}>
              Contact
            </button>
          </nav>

          <p className="footer-note">Designed &amp; built with intention.</p>

          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} MA
          </p>
        </div>
      </div>
    </footer>
  );
}

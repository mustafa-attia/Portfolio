import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useLocation } from "react-router";
import "./Navbar.css";

const navLinks = [
  { label: "Home", section: "home", href: "/#home" },
  { label: "About", section: "about", href: "/#about" },
  { label: "Skills", section: "skills", href: "/#skills" },
  { label: "Projects", section: "projects", href: "/#projects" },
  { label: "Contact", section: "contact", href: "/#contact", hasDot: true },
];

type NavbarProps = {
  onNavigateToSection: (section: string) => void;
  onOpenContact: () => void;
};

export default function Navbar({ onNavigateToSection, onOpenContact }: NavbarProps) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    let animationFrame: number | undefined;

    const syncSection = () => {
      const sections = navLinks
        .map(({ section }) => document.getElementById(section))
        .filter((section): section is HTMLElement => section !== null);

      let current = location.pathname === "/projects" ? "projects" : "home";
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 180) {
          current = section.id;
        }
      });
      setActiveSection(current);
      setIsScrolled(window.scrollY > 50);
    };

    const hashSection = location.hash.slice(1);
    if (location.pathname === "/" && hashSection) {
      animationFrame = requestAnimationFrame(() => {
        document.getElementById(hashSection)?.scrollIntoView({ block: "start" });
        syncSection();
      });
    } else {
      syncSection();
    }

    const handleScroll = () => {
      syncSection();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    };
  }, [location.hash, location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const navigateTo = (section: string) => {
    setIsMenuOpen(false);
    onNavigateToSection(section);
  };

  return (
    <header className={`site-navbar ${isScrolled ? "is-scrolled" : ""}`}>
      <nav className="nav-inner" aria-label="Main navigation">
      
          <a
            href="/#home"
            className="nav-brand-text text-2xl md:hidden"
            aria-label="MA, back to home"
            onClick={(event) => {
              event.preventDefault();
              navigateTo("home");
            }}
          >
              <span className="nav-brand-name">MA.</span>
          </a>

        {isScrolled && (
          <a
            href="/#home"
            className="nav-brand"
            onClick={(event) => {
              event.preventDefault();
              navigateTo("home");
            }}
          >
            <span className="nav-monogram">MA</span>
            <span className="nav-brand-text">
              <span className="nav-brand-name">MA.</span>
            </span>
          </a>
        )}

        <div className="nav-links">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={activeSection === link.section ? "location" : undefined}
              className={`nav-link ${
                activeSection === link.section ? "active" : ""
              }`}
              onClick={(event) => {
                event.preventDefault();
                if (link.section === "contact") {
                  setIsMenuOpen(false);
                  onOpenContact();
                  return;
                }
                navigateTo(link.section);
              }}
            >
              {link.label}
              {link.hasDot && <span className="nav-link-dot" />}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="nav-cta"
          onClick={onOpenContact}
        >
          Let's Talk
          <ArrowUpRight size={14} />
        </button>

        <button
          type="button"
          className="nav-toggle"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? "mobile-menu-visible" : ""}`}>
        {navLinks.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={activeSection === link.section ? "location" : undefined}
            className={`mobile-menu-link${activeSection === link.section ? " active" : ""}`}
            onClick={(event) => {
              event.preventDefault();
              if (link.section === "contact") {
                setIsMenuOpen(false);
                onOpenContact();
                return;
              }
              navigateTo(link.section);
            }}
          >
            <span>{link.label}</span>
            <span className="mobile-menu-number">0{index + 1}</span>
          </a>
        ))}
      </div>
    </header>
  );
}

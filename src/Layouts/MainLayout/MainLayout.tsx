import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ContactModal from "../../components/ContactModal/ContactModal";
import usePageMetadata from "../../hooks/usePageMetadata";
import AnimatedCursor from "../../ui/AnimatedCursor";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactTriggerRef = useRef<HTMLElement | null>(null);
  const isProjectsPage = location.pathname === "/projects";

  usePageMetadata(
    isProjectsPage
      ? "Selected Projects — Mustafa, Frontend Developer"
      : "Mustafa — Frontend Developer",
    isProjectsPage
      ? "Explore selected digital experiences, interfaces, and products built by Mustafa with attention to detail."
      : "Mustafa is a frontend developer crafting thoughtful, interactive digital experiences with React, TypeScript, and a refined eye for design.",
  );

  const openContact = useCallback(() => {
    contactTriggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsContactOpen(true);
  }, []);

  const closeContact = useCallback(() => setIsContactOpen(false), []);

  function navigateToSection(section: string) {
    const destination = `/#${section}`;

    if (location.pathname === "/") {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
        return;
      }
    }

    navigate(destination);
  }

  useEffect(() => {
    if (!isContactOpen) {
      contactTriggerRef.current?.focus();
    }
  }, [isContactOpen]);

  return (
    <>
      <AnimatedCursor />
      <Navbar
        onNavigateToSection={navigateToSection}
        onOpenContact={openContact}
      />
      <Outlet />
      <Footer
        onNavigateToSection={navigateToSection}
        onOpenContact={openContact}
      />
      <ContactModal
        isOpen={isContactOpen}
        onClose={closeContact}
      />
    </>
  );
}

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Smooth followers: dot is fast, ring lags behind
    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const isInteractive = (el: EventTarget | null) =>
      !!(el instanceof Element && el.closest('a, button, input, select, textarea, [role="button"]'));

    const hoverIn = () => {
      gsap.to(ring, {
        scale: 1.8,
        backgroundColor: "rgba(96, 107, 69, 0.12)",
        borderColor: "rgba(96, 107, 69, 0.85)",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(dot, { scale: 0.5, duration: 0.3 });
    };

    const hoverOut = () => {
      gsap.to(ring, {
        scale: 1,
        backgroundColor: "transparent",
        borderColor: "rgba(96, 107, 69, 0.45)",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    const onMove = (e: MouseEvent) => {
      document.body.classList.add("custom-cursor-active");
      gsap.to([dot, ring], { opacity: 1, duration: 0.2, overwrite: "auto" });
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: MouseEvent) => isInteractive(e.target) && hoverIn();
    const onOut = (e: MouseEvent) => isInteractive(e.target) && hoverOut();
    const onDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.15 });
      gsap.to(dot, { scale: 1.4, duration: 0.15 });
    };
    const onUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.2, ease: "back.out(2)" });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };
    const onLeave = () => {
      document.body.classList.remove("custom-cursor-active");
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };
    const onClick = (e: MouseEvent) =>
      isInteractive(document.elementFromPoint(e.clientX, e.clientY)) ? hoverIn() : hoverOut();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("click", onClick);
      document.body.classList.remove("custom-cursor-active");
      gsap.killTweensOf([dot, ring]);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#606B45]/50"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#606B45]"
      />
    </div>
  );
}

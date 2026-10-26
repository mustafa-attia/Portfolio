import Hero from "../../components/sections/hero_section/Hero";
import About from "../../components/sections/about_section/About";
import Skills from "../../components/sections/skills_section/Skills";
import Projects from "../../components/sections/projects_section/Projects";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
    </>
  );
}
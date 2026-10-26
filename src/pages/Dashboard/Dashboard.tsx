import { useState } from "react";
import { useNavigate } from "react-router";

import {
  useAddProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "../../hooks/useProjects.ts";

import ProjectCard from "../../components/dashboard/ProjectCard";
import ProjectForm from "../../components/dashboard/ProjectForm";
import usePageMetadata from "../../hooks/usePageMetadata";
import { signOut } from "../../services/auth";
import { getProjectApiErrorMessage } from "../../services/service.Projects";
import "../../styles/AdminTheme.css";

import type { Project } from "../../types/dashboard.types";
import type { ProjectFormValues } from "../../components/dashboard/ProjectForm";

type Tab = "Overview" | "Projects" | "Add Project";

const navigationItems: { name: Tab; icon: string }[] = [
  { name: "Overview", icon: "◫" },
  { name: "Projects", icon: "▦" },
  { name: "Add Project", icon: "+" },
];

const emptyForm: ProjectFormValues = {
  name: "",
  description: "",
  image: "",
  link: "",
  skills: "",
};

const cardClass =
  "admin-surface rounded-sm border";

const inputClass =
  "admin-input w-full rounded-sm border px-4 py-3 text-sm outline-none transition";

export default function Dashboard() {
  usePageMetadata(
    "Dashboard — Mustafa Portfolio",
    "Private portfolio management workspace.",
    false,
  );
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [search, setSearch] = useState("");
  const siteName = "Mustafa's Dashboard";
  const [form, setForm] = useState<ProjectFormValues>(emptyForm);
  const [editingProject, setEditingProject] =
    useState<Project | null>(null);
  const [feedback, setFeedback] = useState("");
  const isFeedbackError =
    feedback !== "" &&
    ![
      "Project updated successfully.",
      "Project added successfully.",
      "Project deleted successfully.",
    ].includes(feedback);

  const projectsQuery = useProjects();
  const addMutation = useAddProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const projects = projectsQuery.data ?? [];

  const isSaving =
    addMutation.isPending || updateMutation.isPending;

  const uniqueSkills = new Set(
    projects.flatMap((project) => project.skills ?? project.Skills ?? [])
  ).size;

  const filteredProjects = projects.filter((project) =>
    (project.name || project.Name || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  function resetForm() {
    setForm(emptyForm);
    setEditingProject(null);
  }

  function openAddProject() {
    resetForm();
    setFeedback("");
    setActiveTab("Add Project");
  }

  function openEditProject(project: Project) {
    setEditingProject(project);

    setForm({
      name: project.name || project.Name || "",
      description: project.description || project.Content || "",
      image: project.image || "",
      link: project.link || project.url || "",
      skills: (project.skills || project.Skills || []).join(", "),
    });

    setFeedback("");
    setActiveTab("Add Project");
  }

  async function handleSave(
    projectData: Parameters<
      typeof addMutation.mutateAsync
    >[0]
  ) {
    setFeedback("");

    try {
      if (editingProject) {
        await updateMutation.mutateAsync({
          id: editingProject.id,
          project: projectData,
        });

        setFeedback("Project updated successfully.");
      } else {
        await addMutation.mutateAsync(projectData);

        setFeedback("Project added successfully.");
      }

      resetForm();
      setActiveTab("Projects");
    } catch (error: unknown) {
      setFeedback(getProjectApiErrorMessage(error));
    }
  }

  async function handleDelete(id: Project["id"]) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setFeedback("");

    try {
      await deleteMutation.mutateAsync(id);
      setFeedback("Project deleted successfully.");
    } catch (error: unknown) {
      setFeedback(getProjectApiErrorMessage(error));
    }
  }

  async function logout() {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error: unknown) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Unable to log out right now. Please try again.",
      );
    }
  }

  return (
    <div className="admin-theme min-h-screen md:flex">
      <aside className="admin-sidebar flex w-full shrink-0 flex-col border-b p-4 sm:p-5 md:sticky md:top-0 md:h-screen md:w-[250px] md:border-r md:border-b-0">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#aab984] text-xl font-black text-black">
            F
          </div>

          <div className="min-w-0">
            <h1 className="truncate font-bold">{siteName}</h1>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Control Center
            </p>
          </div>
        </div>

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
          Workspace
        </p>

        <nav className="flex gap-2 overflow-x-auto pb-1 md:flex-col">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setFeedback("");

                if (item.name === "Add Project") {
                  openAddProject();
                  return;
                }

                setActiveTab(item.name);
              }}
              className={`flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                activeTab === item.name
                  ? "bg-[#aab984] font-semibold text-[#151515]"
                  : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="mt-8 hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 md:block">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="text-xs text-gray-300">Workspace active</p>
          </div>

          <p className="text-xs leading-5 text-gray-500">
            Manage your projects and keep your portfolio up to date.
          </p>
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-5 md:mt-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#aab984]/40 bg-[#aab984]/10 font-bold text-[#aab984]">
            M
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Administrator</p>
            <p className="mt-1 text-xs text-gray-500">Owner account</p>
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Logout"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
          >
            ↗
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-7 lg:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#7d8d4d]">
              Workspace / {activeTab}
            </p>

            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {activeTab === "Overview" ? "Welcome back." : activeTab}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage your work. Showcase what you build.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddProject}
            className="rounded-xl bg-[#aab984] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#bccd9a]"
          >
            + New Project
          </button>
        </header>

        {(feedback || projectsQuery.isError) && (
          <div
            role="status"
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              (projectsQuery.isError && !projectsQuery.data) ||
              isFeedbackError
                ? "border-red-400/20 bg-red-400/5 text-red-300"
                : "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
            }`}
          >
            {projectsQuery.isError && !projectsQuery.data
              ? getProjectApiErrorMessage(projectsQuery.error)
              : feedback}
          </div>
        )}

        {activeTab === "Overview" && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  label: "Total Projects",
                  value: projects.length,
                  icon: "▦",
                },
                {
                  label: "Unique Skills",
                  value: uniqueSkills,
                  icon: "✳",
                },
                {
                  label: "API Status",
                  value: projectsQuery.isPending
                    ? "..."
                    : projectsQuery.isError
                      ? "Error"
                      : "Ready",
                  icon: "↗",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`${cardClass} p-5 transition hover:border-white/[0.14] sm:p-6`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-400">{stat.label}</p>

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#aab984]/15 bg-[#aab984]/[0.12] text-lg text-[#aab984]">
                      {stat.icon}
                    </span>
                  </div>

                  <p className="mt-5 break-words text-3xl font-semibold sm:text-4xl">
                    {typeof stat.value === "number"
                      ? String(stat.value).padStart(2, "0")
                      : stat.value}
                  </p>

                  <p className="mt-3 text-xs text-gray-500">
                    {stat.label === "API Status"
                      ? projectsQuery.isPending
                        ? "Loading project data"
                        : projectsQuery.isError
                          ? "Check your API connection"
                          : "Project data synchronized"
                      : "Based on your API projects"}
                  </p>
                </div>
              ))}
            </section>

            <section className="mt-8">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold">
                    Featured Projects
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    A preview of your latest work
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("Projects")}
                  className="text-sm text-[#aab984] hover:text-white"
                >
                  View all ↗
                </button>
              </div>

              {projectsQuery.isPending ? (
                <LoadingState />
              ) : projects.length === 0 ? (
                <EmptyState onAdd={openAddProject} />
              ) : (
                <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                  {projects.slice(0, 3).map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onEdit={openEditProject}
                      onDelete={handleDelete}
                      isDeleting={
                        deleteMutation.isPending &&
                        deleteMutation.variables === project.id
                      }
                      compact
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "Projects" && (
          <section>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold">All Projects</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {projects.length} projects in your portfolio
                </p>
              </div>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects..."
                aria-label="Search projects"
                className={`${inputClass} sm:max-w-xs`}
              />
            </div>

            {projectsQuery.isPending ? (
              <LoadingState />
            ) : filteredProjects.length === 0 ? (
              <EmptyState
                message={
                  projects.length === 0
                    ? "No projects yet"
                    : "No projects found"
                }
                description={
                  projects.length === 0
                    ? "Add your first project to get started."
                    : "Try another search."
                }
                onAdd={
                  projects.length === 0 ? openAddProject : undefined
                }
              />
            ) : (
              <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={openEditProject}
                    onDelete={handleDelete}
                    isDeleting={
                      deleteMutation.isPending &&
                      deleteMutation.variables === project.id
                    }
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "Add Project" && (
          <ProjectForm
            initialValues={form}
            isSaving={isSaving}
            isEditing={editingProject !== null}
            onSubmit={handleSave}
            onCancel={() => {
              resetForm();
              setFeedback("");
              setActiveTab("Projects");
            }}
          />
        )}


        <footer className="mt-12 flex flex-wrap justify-between gap-3 border-t border-white/[0.06] pt-5 text-[11px] text-gray-600">
          <p>
            © {new Date().getFullYear()} {siteName}
          </p>
          <p>Designed for your work.</p>
        </footer>
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className={`${cardClass} p-10 text-center text-gray-400`}>
      Loading projects...
    </div>
  );
}

type EmptyStateProps = {
  message?: string;
  description?: string;
  onAdd?: () => void;
};

function EmptyState({
  message = "No projects found",
  description = "Add your first project to get started.",
  onAdd,
}: EmptyStateProps) {
  return (
    <div className={`${cardClass} p-8 text-center`}>
      <p className="font-medium">{message}</p>

      <p className="mt-2 text-sm text-gray-500">{description}</p>

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 text-sm text-[#aab984] hover:text-white"
        >
          + Create Project
        </button>
      )}
    </div>
  );
}
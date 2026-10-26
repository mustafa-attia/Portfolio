import axios from "axios";
import type {
  Project,
  ProjectPayload,
} from "../types/dashboard.types";

const Api_Url = import.meta.env.VITE_Api_Url;

const projectsApi = axios.create({
  baseURL: Api_Url,
});

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value == null) return [];
  return [value].filter(Boolean) as T[];
}

function cleanSkill(value: string | undefined | null): string {
  return String(value ?? "")
    .trim()
    .replace(/^"+|"+$/g, "")
    .replace(/^'+|'+$/g, "")
    .replace(/\s+/g, " ");
}

function normalizeSkills(value: unknown): string[] {
  return asArray(value as string[] | string | undefined)
    .flatMap((entry) => {
      if (typeof entry === "string") {
        return [cleanSkill(entry)].filter(Boolean);
      }

      return [];
    })
    .filter((skill, index, array) => skill && array.indexOf(skill) === index);
}

function extractProjectArray(data: unknown): Project[] {
  if (Array.isArray(data)) return data as Project[];

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidates = [
      record.projects,
      record.data,
      record.items,
      record.results,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return candidate as Project[];
    }
  }

  return [];
}

export async function getProjects(): Promise<Project[]> {
  const response = await projectsApi.get<unknown>("");
  const rawProjects = extractProjectArray(response.data);

  return rawProjects.map((item) => {
    const skillList = normalizeSkills(
      item.skills ??
        item.Skills ??
        item.technologies ??
        item.Technologies ??
        []
    );

    const sourceCodeUrl =
      item.sourceCode ??
      item.sourceCodeUrl ??
      item.repo ??
      item.github ??
      item.repository ??
      "";

    const livePreviewUrl =
      item.link ??
      item.url ??
      item.liveDemo ??
      item.livePreview ??
      "";

    return {
      ...item,
      id: item.id ?? `project-${Math.random().toString(36).slice(2, 9)}`,
      name: item.name || item.Name || "Untitled Project",
      description: item.description || item.Content || "",
      image: item.image || "",
      link: livePreviewUrl,
      url: livePreviewUrl,
      sourceCode: sourceCodeUrl,
      sourceCodeUrl,
      skills: skillList,
      Skills: skillList,
    };
  });
}

export async function addProject(
  projectData: ProjectPayload
) {
  const response = await projectsApi.post("", projectData);
  return response.data;
}

export async function updateProject(
  id: Project["id"],
  projectData: ProjectPayload
) {
  const response = await projectsApi.put(`/${id}`, projectData);
  return response.data;
}

export async function deleteProject(
  id: Project["id"]
) {
  await projectsApi.delete(`/${id}`);
}
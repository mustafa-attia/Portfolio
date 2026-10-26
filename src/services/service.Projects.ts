import axios from "axios";
import type {
  Project,
  ProjectPayload,
} from "../types/dashboard.types";

const Api_Url = import.meta.env.VITE_Api_Url?.trim();

const projectsApi = axios.create({
  baseURL: Api_Url,
});

function ensureProjectsApiConfigured(): void {
  if (!Api_Url) {
    throw new Error(
      "Projects API is not configured. Set VITE_Api_Url in Vercel to the full MockAPI resource URL, then redeploy.",
    );
  }

  try {
    const apiUrl = new URL(Api_Url);
    if (apiUrl.protocol !== "http:" && apiUrl.protocol !== "https:") {
      throw new Error();
    }
  } catch {
    throw new Error(
      "VITE_Api_Url must be a full HTTP or HTTPS URL. Update it in Vercel and redeploy.",
    );
  }
}

export function getProjectApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data;
    let detail: string | undefined;

    if (typeof responseData === "string" && !responseData.trimStart().startsWith("<")) {
      detail = responseData.trim();
    } else if (typeof responseData === "object" && responseData !== null) {
      const data = responseData as Record<string, unknown>;
      const message =
        data.message ??
        data.Message ??
        data.error ??
        data.Error ??
        data.title ??
        data.Title ??
        data.detail ??
        data.Detail;
      if (typeof message === "string") detail = message.trim();
    }

    if (detail) detail = detail.slice(0, 240);

    if (error.response) {
      return `Projects API returned HTTP ${error.response.status}${
        detail ? `: ${detail}` : "."
      }`;
    }

    if (error.code === "ERR_NETWORK") {
      return "Could not reach the projects API. Check VITE_Api_Url and the API server's CORS settings.";
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return "The projects API request timed out. Please try again.";
    }
  }

  if (error instanceof Error) return error.message;
  return "An unexpected projects API error occurred.";
}

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
  ensureProjectsApiConfigured();
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
  ensureProjectsApiConfigured();
  const response = await projectsApi.post("", projectData);
  return response.data;
}

export async function updateProject(
  id: Project["id"],
  projectData: ProjectPayload
) {
  ensureProjectsApiConfigured();
  const response = await projectsApi.put(`/${id}`, projectData);
  return response.data;
}

export async function deleteProject(
  id: Project["id"]
) {
  ensureProjectsApiConfigured();
  await projectsApi.delete(`/${id}`);
}
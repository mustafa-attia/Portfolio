import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addProject,
  updateProject,
  deleteProject,
} from "../services/service.Projects";

import { projectKeys } from "../queries/projects.queries";

import type {
  Project,
  ProjectPayload,
} from "../types/dashboard.types";

export function useProjects() {
  return useQuery(projectKeys.list());
}

export function useAddProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (project: ProjectPayload) => addProject(project),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      project,
    }: {
      id: Project["id"];
      project: ProjectPayload;
    }) => updateProject(id, project),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Project["id"]) => deleteProject(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
    },
  });
}
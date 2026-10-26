import { queryOptions } from "@tanstack/react-query";
import { getProjects } from "../services/service.Projects";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: () =>
    queryOptions({
      queryKey: projectKeys.lists(),
      queryFn: getProjects,
      refetchOnWindowFocus: true,
      refetchInterval: 10000
    }),
};
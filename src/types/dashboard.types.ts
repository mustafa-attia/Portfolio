export type Project = {
  id: number | string;
  name?: string;
  Name?: string;
  description?: string;
  Content?: string;
  image?: string;
  link?: string;
  url?: string;
  liveDemo?: string;
  livePreview?: string;
  sourceCode?: string;
  sourceCodeUrl?: string;
  repo?: string;
  github?: string;
  repository?: string;
  skills?: string[];
  Skills?: string[];
  technologies?: string[];
  Technologies?: string[];
};

export type ProjectPayload = {
  name: string;
  description: string;
  image: string;
  link: string;
  skills: string[];
};
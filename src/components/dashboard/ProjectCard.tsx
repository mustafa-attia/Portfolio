
import { useState } from "react";
import type { Project } from "../../types/dashboard.types";

type ProjectCardProps = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: Project["id"]) => void;
  isDeleting: boolean;
  compact?: boolean;
};

const cardClass =
  "admin-surface rounded-sm border";

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  isDeleting,
  compact = false,
}: ProjectCardProps) {
  const name = project.name || project.Name || "Untitled Project";
  const description =
    project.description || project.Content || "";
  const image = project.image || "";
  const link = project.link || project.url || "";
  const skills = project.skills?.length
    ? project.skills
    : project.Skills || [];
const [imageError, setImageError] = useState(false);

  return (
    <article
      className={`${cardClass} overflow-hidden transition hover:border-[#aab984]/40`}
    >
      <div className="aspect-[16/9] overflow-hidden bg-[#171a22]">
        {image && !imageError ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-gray-500">
              <span>Image unavailable</span>
              <span className="text-xs">Check the image URL</span>
            </div>
          )}
      </div>

      <div className="p-5">
        <h3 className="break-words text-lg font-semibold">
          {name}
        </h3>

        <p
          className={`mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-400 ${
            compact ? "line-clamp-2" : ""
          }`}
        >
          {description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-[#aab984] hover:text-white"
            >
              Open Project ↗
            </a>
          ) : (
            <span className="text-sm text-gray-600">
              No project link
            </span>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 transition hover:bg-white/[0.05]"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(project.id)}
              disabled={isDeleting}
              className="rounded-lg border border-red-400/10 px-3 py-2 text-xs text-red-400 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

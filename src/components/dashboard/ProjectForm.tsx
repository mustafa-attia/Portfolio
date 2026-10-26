import type { FormEvent } from "react";
import type { ProjectPayload } from "../../types/dashboard.types";

export type ProjectFormValues = {
  name: string;
  description: string;
  image: string;
  link: string;
  skills: string;
};

type ProjectFormProps = {
  initialValues: ProjectFormValues;
  isSaving: boolean;
  isEditing: boolean;
  onSubmit: (project: ProjectPayload) => void;
  onCancel: () => void;
};

const inputClass =
  "admin-input w-full rounded-sm border px-4 py-3 text-sm outline-none transition";

const cardClass =
  "admin-surface rounded-sm border";

export default function ProjectForm({
  initialValues,
  isSaving,
  isEditing,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const project: ProjectPayload = {
      name: String(formData.get("name") ?? "").trim(),
      description: String(
        formData.get("description") ?? ""
      ).trim(),
      image: String(formData.get("image") ?? "").trim(),
      link: String(formData.get("link") ?? "").trim(),
      skills: String(formData.get("skills") ?? "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    if (
      !project.name ||
      !project.description ||
      !project.image ||
      !project.link
    ) {
      return;
    }

    onSubmit(project);
  }

  return (
    <section className="grid items-start gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className={`${cardClass} p-5 sm:p-7`}>
        <div className="mb-7">
          <h3 className="text-lg font-semibold">
            {isEditing ? "Edit Project" : "Create New Project"}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Add the details that make your project stand out.
          </p>
        </div>

        <form
          key={`${isEditing}-${initialValues.name}`}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Field label="Project Name" name="name">
            <input
              name="name"
              defaultValue={initialValues.name}
              placeholder="e.g. FalconiX Posts"
              className={inputClass}
              required
            />
          </Field>

          <Field label="Description" name="description">
            <textarea
              name="description"
              defaultValue={initialValues.description}
              placeholder="Describe your project..."
              rows={4}
              className={`${inputClass} resize-y leading-6`}
              required
            />
          </Field>

          <Field label="Project Image URL" name="image">
            <input
              name="image"
              type="url"
              defaultValue={initialValues.image}
              placeholder="https://..."
              className={inputClass}
              required
            />
          </Field>

          <Field label="Project Link" name="link">
            <input
              name="link"
              type="url"
              defaultValue={initialValues.link}
              placeholder="https://..."
              className={inputClass}
              required
            />
          </Field>

          <Field label="Skills & Technologies" name="skills">
            <input
              name="skills"
              defaultValue={initialValues.skills}
              placeholder="React, TypeScript, Tailwind CSS"
              className={inputClass}
            />

            <p className="mt-2 text-xs text-gray-600">
              Separate each skill with a comma.
            </p>
          </Field>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-[#aab984] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#bccd9a] disabled:opacity-60"
            >
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Project"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/[0.05]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <ProjectPreview initialValues={initialValues} />
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  children: React.ReactNode;
};

function Field({ label, name, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm text-gray-300"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ProjectPreview({
  initialValues,
}: {
  initialValues: ProjectFormValues;
}) {
  return (
    <div className={`${cardClass} p-5 sm:p-6`}>
      <p className="text-xs uppercase tracking-[0.2em] text-[#7d8d4d]">
        Project Details
      </p>

      <h3 className="mt-2 font-semibold">
        {initialValues.name || "Project Name"}
      </h3>

      <p className="mt-2 break-words text-sm leading-6 text-gray-500">
        {initialValues.description || "Project description"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(initialValues.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean).length
          ? initialValues.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : ["Your Skills"]
        ).map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[11px] text-gray-300"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="mt-5 break-all text-sm text-[#aab984]">
        {initialValues.link || "Project link"}
      </p>
    </div>
  );
}
"use client";

import { useState } from "react";

import type { PromptInput } from "@/types/prompt";

interface PromptFormProps {
  initialValues?: PromptInput;
  submitLabel: string;
  onSubmit: (values: PromptInput) => Promise<void>;
}

export default function PromptForm({
  initialValues,
  submitLabel,
  onSubmit,
}: PromptFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [tags, setTags] = useState(initialValues?.tags.join(", ") ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Title and prompt content are required.");
      return;
    }

    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags: parsedTags,
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Failed to submit prompt.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="prompt-title" className="mb-2 block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="prompt-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Give your prompt a clear title"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none ring-slate-200 transition focus:border-slate-400 focus:ring"
          required
        />
      </div>

      <div>
        <label htmlFor="prompt-content" className="mb-2 block text-sm font-medium text-slate-700">
          Prompt Content
        </label>
        <textarea
          id="prompt-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your full AI prompt here"
          rows={8}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none ring-slate-200 transition focus:border-slate-400 focus:ring"
          required
        />
      </div>

      <div>
        <label htmlFor="prompt-tags" className="mb-2 block text-sm font-medium text-slate-700">
          Tags
        </label>
        <input
          id="prompt-tags"
          type="text"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="marketing, email, social"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none ring-slate-200 transition focus:border-slate-400 focus:ring"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

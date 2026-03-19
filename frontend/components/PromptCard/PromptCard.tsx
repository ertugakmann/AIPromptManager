"use client";

import Link from "next/link";

interface PromptCardProps {
  id: string;
  title: string;
  contentPreview: string;
  tags: string[];
  onDelete: (id: string) => void;
}

export default function PromptCard({
  id,
  title,
  contentPreview,
  tags,
  onDelete,
}: PromptCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="line-clamp-1 text-lg font-semibold text-slate-900">{title}</h2>
        <div className="flex items-center gap-2">
          <Link
            href={`/prompt/${id}`}
            className="rounded-md px-2 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Open
          </Link>
          <Link
            href={`/prompt/${id}`}
            className="rounded-md px-2 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="rounded-md px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-slate-600">{contentPreview}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span
              key={`${id}-${tag}`}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
            >
              #{tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400">No tags</span>
        )}
      </div>
    </article>
  );
}

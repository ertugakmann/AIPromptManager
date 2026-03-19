"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar/Navbar";
import { ApiError, deletePrompt, getPromptById } from "@/lib/api";
import type { Prompt } from "@/types/prompt";

export default function PromptDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const promptId = params?.id;
    if (!promptId) {
      setError("Invalid prompt id.");
      setIsLoading(false);
      return;
    }

    const fetchPrompt = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPromptById(promptId);
        setPrompt(response);
      } catch (fetchError) {
        if (fetchError instanceof ApiError) {
          setError(fetchError.message);
        } else {
          setError("Failed to load prompt.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPrompt();
  }, [params?.id]);

  const handleDelete = async () => {
    if (!prompt) {
      return;
    }

    try {
      await deletePrompt(prompt.id);
      router.push("/dashboard");
    } catch (deleteError) {
      if (deleteError instanceof ApiError) {
        setError(deleteError.message);
      } else {
        setError("Failed to delete prompt.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        {isLoading ? (
          <p className="text-sm text-slate-600">Loading prompt...</p>
        ) : error ? (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        ) : !prompt ? (
          <p className="text-sm text-slate-600">Prompt not found.</p>
        ) : (
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">{prompt.title}</h1>
              <div className="flex items-center gap-2">
                <Link
                  href={`/create?from=${prompt.id}`}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-md px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {prompt.tags.length > 0 ? (
                prompt.tags.map((tag) => (
                  <span
                    key={`${prompt.id}-${tag}`}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No tags</span>
              )}
            </div>

            <p className="mt-6 whitespace-pre-wrap text-sm leading-6 text-slate-700">{prompt.content}</p>
          </article>
        )}
      </section>
    </main>
  );
}

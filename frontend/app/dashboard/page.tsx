"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/Navbar/Navbar";
import PromptCard from "@/components/PromptCard/PromptCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import { ApiError, deletePrompt, getPrompts } from "@/lib/api";
import type { Prompt } from "@/types/prompt";

export default function DashboardPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPrompts();
        setPrompts(response);
      } catch (fetchError) {
        if (fetchError instanceof ApiError) {
          setError(fetchError.message);
        } else {
          setError("Failed to load prompts.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPrompts();
  }, []);

  const filteredPrompts = useMemo(() => {
    const lowered = query.toLowerCase().trim();
    if (!lowered) {
      return prompts;
    }

    return prompts.filter((prompt) => {
      const matchTitle = prompt.title.toLowerCase().includes(lowered);
      const matchContent = prompt.content.toLowerCase().includes(lowered);
      const matchTags = prompt.tags.some((tag) => tag.toLowerCase().includes(lowered));
      return matchTitle || matchContent || matchTags;
    });
  }, [prompts, query]);

  const handleDelete = async (id: string) => {
    try {
      await deletePrompt(id);
      setPrompts((current) => current.filter((prompt) => prompt.id !== id));
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

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Your Prompts</h1>
            <p className="mt-1 text-sm text-slate-600">
              Save, search, and manage your AI prompts in one place.
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Create Prompt
          </Link>
        </div>

        <SearchBar value={query} onChange={setQuery} />

        {error ? <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

        {isLoading ? (
          <p className="mt-6 text-sm text-slate-600">Loading prompts...</p>
        ) : filteredPrompts.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">No prompts found. Create your first one.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.title}
                contentPreview={prompt.content}
                tags={prompt.tags}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

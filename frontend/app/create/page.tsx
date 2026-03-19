"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Navbar from "@/components/Navbar/Navbar";
import PromptForm from "@/components/PromptForm/PromptForm";
import { ApiError, createPrompt } from "@/lib/api";
import type { PromptInput } from "@/types/prompt";

export default function CreatePromptPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (values: PromptInput) => {
    setError(null);
    try {
      const created = await createPrompt(values);
      router.push(`/prompt/${created.id}`);
    } catch (createError) {
      if (createError instanceof ApiError) {
        setError(createError.message);
      } else {
        setError("Failed to create prompt.");
      }
      throw createError;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold text-slate-900">Create Prompt</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add a new prompt with tags for easier organization.
        </p>

        <div className="mt-6">
          <PromptForm submitLabel="Create Prompt" onSubmit={handleCreate} />
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        </div>
      </section>
    </main>
  );
}

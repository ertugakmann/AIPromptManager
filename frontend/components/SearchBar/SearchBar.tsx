"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full">
      <label htmlFor="search-prompts" className="sr-only">
        Search prompts
      </label>
      <input
        id="search-prompts"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search prompts by title, content, or tag"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-slate-200 transition focus:border-slate-400 focus:ring"
      />
    </div>
  );
}

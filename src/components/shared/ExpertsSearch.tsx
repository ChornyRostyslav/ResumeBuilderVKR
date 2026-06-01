"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

export function ExpertsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    
    router.push(`/shared/experts?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:gap-4">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-neutral-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          className="block w-full rounded-md border-0 bg-neutral-800 py-3 pl-10 pr-3 text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          placeholder="Пошук за посадою, навичками..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="sm:w-64">
        <input
          type="text"
          className="block w-full rounded-md border-0 bg-neutral-800 py-3 px-3 text-white placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          placeholder="Категорія (напр. Frontend)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="block w-full sm:w-auto rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Знайти
      </button>
    </form>
  );
}

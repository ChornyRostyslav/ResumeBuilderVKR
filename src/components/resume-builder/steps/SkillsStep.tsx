"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ResumeValues } from "@/lib/validations/resume";
import { X, Plus } from "lucide-react";

export default function SkillsStep() {
  const { watch, setValue } = useFormContext<ResumeValues>();
  const [currentSkill, setCurrentSkill] = useState("");
  
  const skills = watch("skills") || [];

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = currentSkill.trim();
    if (trimmed && trimmed.length <= 20 && !skills.includes(trimmed)) {
      setValue("skills", [...skills, trimmed], { shouldDirty: true });
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skillToRemove),
      { shouldDirty: true }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-semibold text-white">Навички</h2>
        <p className="text-sm text-neutral-400 mt-1">Додайте відповідні ключові слова та технології.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">Додати навичку</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={20}
            placeholder="e.g. React, PostgreSQL, Agile"
            className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            disabled={!currentSkill.trim()}
            className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">Додати</span>
          </button>
        </div>
      </div>

      <div>
        {skills.length === 0 ? (
          <p className="text-sm text-neutral-500 italic mt-4">Ще немає доданих навичок.</p>
        ) : (
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-x-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-blue-500/20"
                >
                  <span className="sr-only">Видалити</span>
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

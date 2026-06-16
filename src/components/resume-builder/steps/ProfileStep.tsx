"use client";

import { useFormContext } from "react-hook-form";
import { ResumeValues } from "@/lib/validations/resume";

const EMPLOYMENT_TYPES = [
  { value: "Повна зайнятість", label: "Повна зайнятість" },
  { value: "Часткова зайнятість", label: "Часткова зайнятість" },
  { value: "Проєктна робота", label: "Проєктна робота" },
  { value: "Волонтерство", label: "Волонтерство" },
  { value: "Стажування", label: "Стажування" },
];

export default function ProfileStep() {
  const { register, formState: { errors } } = useFormContext<ResumeValues>();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-semibold text-white">Профіль</h2>
        <p className="text-sm text-neutral-400 mt-1">На яку посаду ви претендуєте?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Бажана посада <span className="text-red-500">*</span></label>
          <input
            {...register("desiredRole")}
            placeholder="напр. Frontend Engineer, Product Manager"
            className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          />
          {errors.desiredRole && <p className="mt-1 text-sm text-red-500">{errors.desiredRole.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Очікувана зарплата</label>
          <input
            {...register("salary")}
            placeholder="напр. 50 000 UAH / $2000"
            className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Зайнятість <span className="text-red-500">*</span></label>
          <select
            {...register("employmentType")}
            className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 [color-scheme:dark]"
          >
            <option value="">Не вказано</option>
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.employmentType && <p className="mt-1 text-sm text-red-500">{errors.employmentType.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-300 mb-1">Про мене</label>
          <textarea
            {...register("about")}
            rows={5}
            placeholder="Коротко опишіть свій професійний досвід, ключові досягнення та що ви шукаєте."
            className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 resize-none"
          />
          {errors.about && <p className="mt-1 text-sm text-red-500">{errors.about.message}</p>}
        </div>
      </div>
    </div>
  );
}

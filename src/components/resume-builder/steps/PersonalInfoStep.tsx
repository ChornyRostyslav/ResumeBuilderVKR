"use client";

import { useFormContext } from "react-hook-form";
import { ResumeValues } from "@/lib/validations/resume";

export default function PersonalInfoStep() {
  const { register, formState: { errors } } = useFormContext<ResumeValues>();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-semibold text-white">Особиста інформація</h2>
        <p className="text-sm text-neutral-400 mt-1">Почніть з додавання основної контактної інформації.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Назва резюме (Внутрішня) <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title")}
            className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 placeholder:text-neutral-500 transition-shadow"
            placeholder="напр. Senior Frontend Engineer"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Ім'я <span className="text-red-500">*</span>
          </label>
          <input
            {...register("firstName")}
            className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Прізвище</label>
          <input
            {...register("lastName")}
            className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">
            Електронна пошта <span className="text-red-500">*</span>
          </label>
          <input
            {...register("contactEmail")}
            type="email"
            placeholder="Для зв'язку з рекрутерами"
            className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          />
          {errors.contactEmail && <p className="mt-1 text-sm text-red-500">{errors.contactEmail.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Номер телефону</label>
          <input
            {...register("phone")}
            className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-300 mb-1">Місцезнаходження</label>
          <input
            {...register("location")}
            placeholder="напр. Київ, Україна (Готовий до переїзду)"
            className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { ResumeValues } from "@/lib/validations/resume";
import { Plus, Trash2 } from "lucide-react";

export default function ExperienceStep() {
  const { register, control } = useFormContext<ResumeValues>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Досвід роботи</h2>
          <p className="text-sm text-neutral-400 mt-1">Додайте свій відповідний досвід роботи.</p>
        </div>
        <button
          type="button"
          onClick={() =>
            append({
              company: "",
              position: "",
              startDate: "",
              endDate: "",
              current: false,
              description: "",
            })
          }
          className="flex items-center justify-center rounded-md bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-500 hover:bg-blue-600/20 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Додати місце роботи
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 rounded-lg border-2 border-dashed border-neutral-800">
          <p className="text-neutral-500 text-sm">Ще немає доданого досвіду.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 shadow-sm"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute right-4 top-4 text-neutral-500 hover:text-red-500 transition-colors"
                title="Видалити досвід"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              
              <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">
                Робота #{index + 1}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Компанія <span className="text-red-500">*</span></label>
                  <input
                    {...register(`experience.${index}.company`)}
                    className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
                  {/*@ts-ignore*/}
                  {useFormContext<ResumeValues>().formState.errors.experience?.[index]?.company && (
                    <p className="mt-1 text-sm text-red-500">
                      {/*@ts-ignore*/}
                      {useFormContext<ResumeValues>().formState.errors.experience[index].company?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Посада <span className="text-red-500">*</span></label>
                  <input
                    {...register(`experience.${index}.position`)}
                    className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
                  {/*@ts-ignore*/}
                  {useFormContext<ResumeValues>().formState.errors.experience?.[index]?.position && (
                    <p className="mt-1 text-sm text-red-500">
                      {/*@ts-ignore*/}
                      {useFormContext<ResumeValues>().formState.errors.experience[index].position?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Дата початку <span className="text-red-500">*</span></label>
                  <input
                    {...register(`experience.${index}.startDate`)}
                    type="month"
                    className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 [color-scheme:dark]"
                  />
                  {/*@ts-ignore*/}
                  {useFormContext<ResumeValues>().formState.errors.experience?.[index]?.startDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {/*@ts-ignore*/}
                      {useFormContext<ResumeValues>().formState.errors.experience[index].startDate?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Дата закінчення <span className="text-red-500">*</span></label>
                  <input
                    {...register(`experience.${index}.endDate`)}
                    type="month"
                    className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 [color-scheme:dark]"
                  />
                  {/*@ts-ignore*/}
                  {useFormContext<ResumeValues>().formState.errors.experience?.[index]?.endDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {/*@ts-ignore*/}
                      {useFormContext<ResumeValues>().formState.errors.experience[index].endDate?.message}
                    </p>
                  )}
                  <div className="mt-2 flex items-center">
                    <input
                      id={`current-${index}`}
                      type="checkbox"
                      {...register(`experience.${index}.current`)}
                      className="h-4 w-4 rounded border-neutral-700 bg-neutral-800/50 text-blue-600 focus:ring-blue-600 focus:ring-offset-neutral-900"
                    />
                    <label htmlFor={`current-${index}`} className="ml-2 block text-sm text-neutral-400">
                      Я зараз тут працюю
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Опис / Досягнення</label>
                  <textarea
                    {...register(`experience.${index}.description`)}
                    rows={4}
                    placeholder="Опишіть свої обов'язки та досягнення..."
                    className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 resize-none"
                  />
                  {/*@ts-ignore*/}
                  {useFormContext<ResumeValues>().formState.errors.experience?.[index]?.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {/*@ts-ignore*/}
                      {useFormContext<ResumeValues>().formState.errors.experience[index].description?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

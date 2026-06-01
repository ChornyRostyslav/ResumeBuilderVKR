"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { ResumeValues } from "@/lib/validations/resume";
import { Plus, Trash2 } from "lucide-react";

export default function EducationStep() {
  const { register, control } = useFormContext<ResumeValues>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Освіта</h2>
          <p className="text-sm text-neutral-400 mt-1">Вкажіть свою освіту.</p>
        </div>
        <button
          type="button"
          onClick={() =>
            append({
              institution: "",
              degree: "",
              fieldOfStudy: "",
              gradYear: "",
            })
          }
          className="flex items-center justify-center rounded-md bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-500 hover:bg-blue-600/20 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Додати освіту
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 rounded-lg border-2 border-dashed border-neutral-800">
          <p className="text-neutral-500 text-sm">Ще немає доданої освіти.</p>
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
                title="Видалити освіту"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              
              <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">
                Освіта #{index + 1}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Навчальний заклад <span className="text-red-500">*</span></label>
                  <input
                    {...register(`education.${index}.institution`)}
                    className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
                  {/*@ts-ignore*/}
                  {useFormContext<ResumeValues>().formState.errors.education?.[index]?.institution && (
                    <p className="mt-1 text-sm text-red-500">
                      {/*@ts-ignore*/}
                      {useFormContext<ResumeValues>().formState.errors.education[index].institution?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Ступінь <span className="text-red-500">*</span></label>
                  <input
                    {...register(`education.${index}.degree`)}
                    placeholder="напр. Бакалавр комп'ютерних наук"
                    className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
                  {/*@ts-ignore*/}
                  {useFormContext<ResumeValues>().formState.errors.education?.[index]?.degree && (
                    <p className="mt-1 text-sm text-red-500">
                      {/*@ts-ignore*/}
                      {useFormContext<ResumeValues>().formState.errors.education[index].degree?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Спеціальність <span className="text-red-500">*</span></label>
                  <input
                    {...register(`education.${index}.fieldOfStudy`)}
                    placeholder="напр. Комп'ютерні науки"
                    className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
                  {/*@ts-ignore*/}
                  {useFormContext<ResumeValues>().formState.errors.education?.[index]?.fieldOfStudy && (
                    <p className="mt-1 text-sm text-red-500">
                      {/*@ts-ignore*/}
                      {useFormContext<ResumeValues>().formState.errors.education[index].fieldOfStudy?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Рік випуску <span className="text-red-500">*</span></label>
                  <input
                    {...register(`education.${index}.gradYear`)}
                    placeholder="РРРР"
                    className="w-full rounded-md border-0 bg-neutral-800/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700/50 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  />
                  {/* react-hook-form errors for array fields are nested */}
                  {/*@ts-ignore*/}
                  {useFormContext<ResumeValues>().formState.errors.education?.[index]?.gradYear && (
                    <p className="mt-1 text-sm text-red-500">
                      {/*@ts-ignore*/}
                      {useFormContext<ResumeValues>().formState.errors.education[index].gradYear?.message}
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

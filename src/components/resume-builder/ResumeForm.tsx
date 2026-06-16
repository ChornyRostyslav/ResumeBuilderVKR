"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, ResumeValues } from "@/lib/validations/resume";
import { useRouter } from "next/navigation";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ProfileStep from "./steps/ProfileStep";
import ExperienceStep from "./steps/ExperienceStep";
import EducationStep from "./steps/EducationStep";
import SkillsStep from "./steps/SkillsStep";
import LanguagesStep from "./steps/LanguagesStep";
import DesignStep from "./steps/DesignStep";
import { Check, ChevronRight, ChevronLeft, Save, Loader2 } from "lucide-react";
import { Resume } from "@prisma/client";
import toast from "react-hot-toast";

const STEPS = [
  { id: "personal", title: "Особиста інформація" },
  { id: "profile", title: "Профіль" },
  { id: "experience", title: "Досвід роботи" },
  { id: "education", title: "Освіта" },
  { id: "skills", title: "Навички" },
  { id: "languages", title: "Мови" },
  { id: "design", title: "Дизайн" },
];

export default function ResumeForm({ initialData }: { initialData: Resume }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      title: initialData.title || "Моє резюме",
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      contactEmail: initialData.contactEmail || "",
      phone: initialData.phone || "",
      location: initialData.location || "",
      desiredRole: initialData.desiredRole || "",
      employmentType: initialData.employmentType || "",
      salary: initialData.salary || "",
      about: initialData.about || "",
      // Parse JSON from database if it exists
      experience: initialData.experience
        ? (initialData.experience as any)
        : [],
      education: initialData.education ? (initialData.education as any) : [],
      skills: initialData.skills || [],
      languages: initialData.languages ? (initialData.languages as any) : [],
      template: (initialData as any).template || "standard",
    },
    mode: "onChange",
  });

  const { handleSubmit, trigger, getValues } = methods;

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: return ["title", "firstName", "lastName", "contactEmail", "phone", "location"];
      case 1: return ["desiredRole", "employmentType", "salary", "about"];
      case 2: return ["experience"];
      case 3: return ["education"];
      case 4: return ["skills"];
      case 5: return ["languages"];
      case 6: return ["template"];
      default: return [];
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep) as any;
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (data: ResumeValues) => {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/resumes/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Не вдалося зберегти резюме");
      }

      toast.success("Резюме успішно збережено");
      if (currentStep === STEPS.length - 1) {
        router.push(`/resume/${initialData.id}/preview`);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Помилка сервера");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep />;
      case 1:
        return <ProfileStep />;
      case 2:
        return <ExperienceStep />;
      case 3:
        return <EducationStep />;
      case 4:
        return <SkillsStep />;
      case 5:
        return <LanguagesStep />;
      case 6:
        return <DesignStep />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Stepper Header */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className={`relative pr-8 sm:pr-20 h-14 ${
                  index !== STEPS.length - 1 ? "" : ""
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      index < currentStep
                        ? "border-blue-500 bg-blue-500"
                        : index === currentStep
                        ? "border-blue-500 bg-neutral-900 text-blue-500"
                        : "border-neutral-700 bg-neutral-900 text-neutral-500"
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index !== STEPS.length - 1 && (
                    <div
                      className={`hidden sm:block absolute top-4 h-0.5 w-[calc(100%-2rem)] left-8 ${
                        index < currentStep ? "bg-blue-500" : "bg-neutral-800"
                      }`}
                    />
                  )}
                </div>
                <span className="mt-2 hidden sm:block text-xs font-medium text-neutral-400">
                  {step.title}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Form Area */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8 backdrop-blur-sm">
            {renderStep()}
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-neutral-800 pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex w-full sm:w-auto items-center justify-center rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Назад
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                type="submit"
                disabled={isSaving}
                className="flex w-full sm:w-auto items-center justify-center rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-neutral-700 hover:text-emerald-300 disabled:opacity-50 transition-colors"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Зберегти чернетку
              </button>
              
              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex w-full sm:w-auto items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                >
                  Далі
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSaving}
                  className="flex w-full sm:w-auto items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-bold text-white hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Завершити
                </button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

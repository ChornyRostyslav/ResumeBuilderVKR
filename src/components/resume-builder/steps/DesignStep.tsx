import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ResumeValues } from "@/lib/validations/resume";
import { Palette, CheckCircle2 } from "lucide-react";

const BUILTIN_TEMPLATES = [
  {
    id: "standard",
    name: "Standard",
    description: "Класичний вигляд, шрифт без засічок, стандартні відступи.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Акцентний колір, роздільні лінії, виділені заголовки.",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Шрифт із засічками, заголовки по центру, збільшений інтервал.",
  },
];

type AdminTemplate = {
  id: string;
  name: string;
  category: string;
  previewUrl: string | null;
};

export default function DesignStep() {
  const { watch, setValue } = useFormContext<ResumeValues>();
  const currentTemplate = watch("template");

  const [adminTemplates, setAdminTemplates] = useState<AdminTemplate[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/templates")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: AdminTemplate[]) => {
        if (!cancelled) setAdminTemplates(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setAdminTemplates([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectTemplate = (id: string) => {
    setValue("template", id, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-1">Візуальний шаблон</h3>
        <p className="text-sm text-neutral-400">
          Оберіть дизайн, який найкраще підходить для вашого резюме.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BUILTIN_TEMPLATES.map((template) => {
          const isSelected = currentTemplate === template.id;

          return (
            <div
              key={template.id}
              onClick={() => selectTemplate(template.id)}
              className={`relative flex flex-col p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-800/50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500/20 text-blue-400" : "bg-neutral-800 text-neutral-400"}`}>
                  <Palette className="w-5 h-5" />
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
              </div>

              <h4 className={`text-base font-semibold mb-1 ${isSelected ? "text-blue-400" : "text-neutral-200"}`}>
                {template.name}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {template.description}
              </p>
            </div>
          );
        })}
      </div>

      {adminTemplates.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-300">
            Додаткові шаблони
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {adminTemplates.map((template) => {
              const isSelected = currentTemplate === template.id;

              return (
                <div
                  key={template.id}
                  onClick={() => selectTemplate(template.id)}
                  className={`relative flex flex-col rounded-xl cursor-pointer border-2 overflow-hidden transition-all duration-200 ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-800/50"
                  }`}
                >
                  {template.previewUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={template.previewUrl}
                      alt={template.name}
                      className="h-32 w-full object-cover border-b border-neutral-800"
                    />
                  )}
                  <div className="flex flex-col p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500/20 text-blue-400" : "bg-neutral-800 text-neutral-400"}`}>
                        <Palette className="w-5 h-5" />
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                    </div>

                    <h4 className={`text-base font-semibold mb-1 ${isSelected ? "text-blue-400" : "text-neutral-200"}`}>
                      {template.name}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed capitalize">
                      {template.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

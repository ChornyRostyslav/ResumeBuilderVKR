import { useFormContext } from "react-hook-form";
import { ResumeValues } from "@/lib/validations/resume";
import { Palette, CheckCircle2 } from "lucide-react";

const TEMPLATES = [
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

export default function DesignStep() {
  const { register, watch, setValue } = useFormContext<ResumeValues>();
  const currentTemplate = watch("template");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-1">Візуальний шаблон</h3>
        <p className="text-sm text-neutral-400">
          Оберіть дизайн, який найкраще підходить для вашого резюме.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TEMPLATES.map((template) => {
          const isSelected = currentTemplate === template.id;
          
          return (
            <div
              key={template.id}
              onClick={() => setValue("template", template.id as "standard" | "modern" | "elegant", { shouldValidate: true })}
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
              
              <input
                type="radio"
                value={template.id}
                className="hidden"
                {...register("template")}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

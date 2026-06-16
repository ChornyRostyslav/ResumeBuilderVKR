"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function DeleteResumeButton({ resumeId }: { resumeId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete resume");
      }

      toast.success("Резюме видалено");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Помилка сервера");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex flex-1 justify-center items-center rounded-md bg-red-600/10 px-3 py-2 text-sm font-semibold text-red-500 shadow-sm hover:bg-red-600 hover:text-white transition-colors"
        title="Видалити резюме"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md shadow-xl border border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-4 text-red-500">
              <AlertTriangle className="h-8 w-8" />
              <h3 className="text-xl font-semibold text-white">Видалити резюме?</h3>
            </div>
            
            <p className="text-neutral-300 mb-6">
              Ви впевнені, що хочете видалити це резюме? Це дія незворотна.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-neutral-800 rounded-md hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                Скасувати
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 transition-colors flex items-center disabled:opacity-50"
              >
                {isDeleting ? "Видалення..." : "Видалити"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Copy, Link as LinkIcon, Loader2 } from "lucide-react";

interface PublicToggleProps {
  resumeId: string;
  initialIsPublic: boolean;
  initialShareId: string | null;
}

export function PublicToggle({
  resumeId,
  initialIsPublic,
  initialShareId,
}: PublicToggleProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [shareId, setShareId] = useState<string | null>(initialShareId);
  const [isLoading, setIsLoading] = useState(false);

  const togglePublic = async () => {
    setIsLoading(true);
    const newStatus = !isPublic;
    
    try {
      const res = await fetch(`/api/resumes/${resumeId}/toggle-public`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle public status");
      }

      const updatedResume = await res.json();
      setIsPublic(updatedResume.isPublic);
      setShareId(updatedResume.shareId);
      
      toast.success(
        newStatus ? "Резюме зроблено публічним!" : "Резюме приховано"
      );
    } catch (error) {
      console.error(error);
      toast.error("Помилка мережі або сервер недоступний.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!shareId) return;
    const url = `${window.location.origin}/shared/resume/${shareId}`;
    navigator.clipboard.writeText(url);
    toast.success("Посилання скопійовано!");
  };

  return (
    <div className="mt-4 border-t border-neutral-800 pt-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePublic}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
              isPublic ? "bg-blue-600" : "bg-neutral-700"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            role="switch"
            aria-checked={isPublic}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isPublic ? "translate-x-5" : "translate-x-0"
              }`}
            >
              {isLoading && (
                <Loader2 className="animate-spin h-4 w-4 absolute top-0.5 left-0.5 text-neutral-400" />
              )}
            </span>
          </button>
          <span className="text-sm font-medium text-neutral-300">
            Зробити резюме публічним
          </span>
        </div>
      </div>

      {isPublic && shareId && (
        <div className="mt-3 flex items-center justify-between rounded-md bg-neutral-800 p-2">
          <div className="flex items-center space-x-2 truncate text-sm text-neutral-400">
            <LinkIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">/shared/resume/{shareId}</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="ml-4 flex-shrink-0 rounded bg-neutral-700 px-2 py-1 text-xs font-semibold text-white hover:bg-neutral-600 transition-colors"
          >
            <span className="flex items-center gap-1">
              <Copy className="h-3 w-3" /> Копіювати
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

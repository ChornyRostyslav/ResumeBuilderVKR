"use client";

import { useState } from "react";
import { Printer, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PrintButton({ resumeId }: { resumeId?: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    // Public/shared view has no owner export route — fall back to browser print.
    if (!resumeId) {
      window.print();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/export`, {
        method: "POST",
      });

      if (!res.ok) {
        let detail = "";
        try {
          const body = await res.json();
          detail = body.detail || body.message || "";
        } catch {
          detail = await res.text().catch(() => "");
        }
        console.error("PDF export failed:", res.status, detail);
        throw new Error(detail || `HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Не вдалося згенерувати PDF: ${msg.split("\n")[0]}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Printer className="mr-2 h-4 w-4" />
      )}
      {loading ? "Генерація..." : "Зберегти як PDF"}
    </button>
  );
}

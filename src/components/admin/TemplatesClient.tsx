"use client";

import { useState } from "react";
import { PlusCircle, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

type Template = {
  id: string;
  name: string;
  category: string;
  previewUrl: string | null;
  isPublished: boolean;
  createdAt: string | Date;
};

type FormState = {
  name: string;
  category: string;
  previewUrl: string;
  isPublished: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  category: "standard",
  previewUrl: "",
  isPublished: false,
};

export function TemplatesClient({
  initialTemplates,
}: {
  initialTemplates: Template[];
}) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(t: Template) {
    setEditingId(t.id);
    setForm({
      name: t.name,
      category: t.category,
      previewUrl: t.previewUrl ?? "",
      isPublished: t.isPublished,
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim()) {
      toast.error("Назва та категорія є обов'язковими");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        previewUrl: form.previewUrl.trim() || null,
        isPublished: form.isPublished,
      };

      if (editingId) {
        const res = await fetch(`/api/admin/templates/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const updated: Template = await res.json();
        setTemplates((prev) => prev.map((t) => (t.id === editingId ? updated : t)));
        toast.success("Шаблон оновлено");
      } else {
        const res = await fetch("/api/admin/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const created: Template = await res.json();
        setTemplates((prev) => [created, ...prev]);
        toast.success("Шаблон додано");
      }
      cancelForm();
    } catch {
      toast.error("Помилка збереження");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити шаблон?")) return;
    try {
      const res = await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success("Шаблон видалено");
    } catch {
      toast.error("Помилка видалення");
    }
  }

  async function togglePublish(t: Template) {
    try {
      const res = await fetch(`/api/admin/templates/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !t.isPublished }),
      });
      if (!res.ok) throw new Error();
      const updated: Template = await res.json();
      setTemplates((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
      toast.success(updated.isPublished ? "Опубліковано" : "Знято з публікації");
    } catch {
      toast.error("Помилка");
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Додати шаблон
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl bg-neutral-900 border border-neutral-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingId ? "Редагувати шаблон" : "Новий шаблон"}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Назва <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Назва шаблону"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Категорія <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard">Стандартний</option>
                <option value="modern">Сучасний</option>
                <option value="minimal">Мінімалістичний</option>
                <option value="professional">Професійний</option>
                <option value="creative">Творчий</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                URL прев'ю (необов'язково)
              </label>
              <input
                type="text"
                value={form.previewUrl}
                onChange={(e) => setForm((f) => ({ ...f, previewUrl: e.target.value }))}
                className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input
                id="isPublished"
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="isPublished" className="text-sm text-neutral-300">
                Опублікувати одразу
              </label>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? "Збереження..." : editingId ? "Зберегти зміни" : "Додати"}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700 transition-colors"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      )}

      {templates.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p>Шаблони відсутні. Додайте перший шаблон.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900 border-b border-neutral-800">
              <tr>
                <th className="text-left px-4 py-3 text-neutral-400 font-medium">Назва</th>
                <th className="text-left px-4 py-3 text-neutral-400 font-medium">Категорія</th>
                <th className="text-left px-4 py-3 text-neutral-400 font-medium">Статус</th>
                <th className="text-left px-4 py-3 text-neutral-400 font-medium">Додано</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {templates.map((t) => (
                <tr key={t.id} className="bg-neutral-900/50 hover:bg-neutral-900 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-neutral-300 capitalize">{t.category}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(t)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                        t.isPublished
                          ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                          : "bg-neutral-700 text-neutral-400 hover:bg-neutral-600"
                      }`}
                    >
                      {t.isPublished ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Опубліковано
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Чернетка
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {new Date(t.createdAt).toLocaleDateString("uk-UA")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(t)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
                        title="Редагувати"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="rounded p-1.5 text-neutral-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        title="Видалити"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

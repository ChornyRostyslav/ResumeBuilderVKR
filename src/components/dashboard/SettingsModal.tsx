"use client";

import { useState } from "react";
import { Settings, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const isConfirmPasswordDirty = confirmPassword.length > 0;
  const isPasswordValid = password.length >= 8 && password.length <= 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !isPasswordValid) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Помилка оновлення пароля");
      }

      toast.success("Пароль успішно оновлено!");
      setIsOpen(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Сталася помилка");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center rounded-md bg-neutral-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800"
        aria-label="Налаштування"
      >
        <Settings className="h-5 w-5 text-neutral-400 hover:text-white transition-colors" />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center rounded-md bg-neutral-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800"
        aria-label="Налаштування"
      >
        <Settings className="h-5 w-5 text-neutral-400 hover:text-white transition-colors" />
      </button>

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        {/* Modal Content */}
        <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden relative">
          <div className="flex items-center justify-between p-6 border-b border-neutral-800">
            <h3 className="text-xl font-semibold text-white">Налаштування</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-neutral-300"
                >
                  Новий пароль
                </label>
                <input
                  id="new-password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  maxLength={20}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 bg-neutral-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
                {!isPasswordValid && password.length > 0 && (
                  <p className="mt-1 text-xs text-red-500">
                    Пароль має містити мінімум 8 символів
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="block text-sm font-medium text-neutral-300"
                >
                  Підтвердження пароля
                </label>
                <input
                  id="confirm-new-password"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  maxLength={20}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 bg-neutral-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
                {isConfirmPasswordDirty && !passwordsMatch && (
                  <p className="mt-1 text-xs text-red-500">
                    Паролі не збігаються
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={isLoading || !passwordsMatch || !isPasswordValid}
                className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Зберегти
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

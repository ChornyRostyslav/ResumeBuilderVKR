"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Неправильний email або пароль");
        setIsLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError("Сталася непередбачена помилка");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-neutral-900 p-8 shadow-xl ring-1 ring-neutral-800">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
            <LogIn className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            З поверненням
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Увійдіть, щоб отримати доступ до конструктора вашого ІТ-резюме
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-300"
              >
                Електронна пошта
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={50}
                className="mt-1 block w-full rounded-md border-0 bg-neutral-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
              {email.length >= 50 && (
                <p className="mt-1 text-xs text-red-500">
                  Перевищенно кількість допустимих символів
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-300"
              >
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={50}
                className="mt-1 block w-full rounded-md border-0 bg-neutral-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
              {password.length >= 50 && (
                <p className="mt-1 text-xs text-red-500">
                  Перевищенно кількість допустимих символів
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Вхід..." : "Увійти"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-neutral-400">
          Немає акаунту?{" "}
          <Link
            href="/register"
            className="font-semibold leading-6 text-blue-500 hover:text-blue-400"
          >
            Створити акаунт
          </Link>
        </p>
      </div>
    </div>
  );
}

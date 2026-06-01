"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const isConfirmPasswordDirty = confirmPassword.length > 0;
  const isPasswordValid = password.length >= 8 && password.length <= 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Помилка реєстрації");
        setIsLoading(false);
        return;
      }

      router.push("/login?registered=true");
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
            <UserPlus className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Створити акаунт
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Почніть створювати своє ІТ-резюме вже сьогодні
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                maxLength={20}
                className="mt-1 block w-full rounded-md border-0 bg-neutral-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
              {!isPasswordValid && password.length > 0 && (
                <p className="mt-1 text-xs text-red-500">
                  Пароль має містити мінімум 8 символів
                </p>
              )}
              {password.length >= 20 && (
                <p className="mt-1 text-xs text-red-500">
                  Перевищенно кількість допустимих символів
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-300"
              >
                Підтвердження пароля
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                maxLength={20}
                className="mt-1 block w-full rounded-md border-0 bg-neutral-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              />
              {confirmPassword.length >= 20 && (
                <p className="mt-1 text-xs text-red-500">
                  Перевищенно кількість допустимих символів
                </p>
              )}
              {isConfirmPasswordDirty && !passwordsMatch && (
                <p className="mt-1 text-xs text-red-500">
                  Паролі не збігаються
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !isPasswordValid || (isConfirmPasswordDirty && !passwordsMatch)}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Створення акаунту..." : "Зареєструватися"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-neutral-400">
          Вже маєте акаунт?{" "}
          <Link
            href="/login"
            className="font-semibold leading-6 text-blue-500 hover:text-blue-400"
          >
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}

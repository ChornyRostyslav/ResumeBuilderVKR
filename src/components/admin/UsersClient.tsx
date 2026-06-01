"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldOff, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isBlocked: boolean;
  createdAt: string | Date;
  _count: { resumes: number };
};

export function UsersClient({
  initialUsers,
  total,
  page,
  limit,
  search: initialSearch,
}: {
  initialUsers: User[];
  total: number;
  page: number;
  limit: number;
  search: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState(initialSearch);

  const totalPages = Math.ceil(total / limit);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      router.push(`/admin/users?search=${encodeURIComponent(search)}&page=1`);
    });
  }

  function goToPage(p: number) {
    startTransition(() => {
      router.push(
        `/admin/users?search=${encodeURIComponent(search)}&page=${p}`
      );
    });
  }

  async function handleToggleBlock(user: User) {
    const action = user.isBlocked ? "розблокувати" : "заблокувати";
    if (!confirm(`Ви впевнені, що хочете ${action} цього користувача?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${user.id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Помилка");
      }
      const updated: { isBlocked: boolean } = await res.json();
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBlocked: updated.isBlocked } : u
        )
      );
      toast.success(updated.isBlocked ? "Користувача заблоковано" : "Користувача розблоковано");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Помилка");
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук за email або ім'ям..."
            className="w-full rounded-md bg-neutral-800 border border-neutral-700 pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          Знайти
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 border-b border-neutral-800">
            <tr>
              <th className="text-left px-4 py-3 text-neutral-400 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-neutral-400 font-medium">Ім'я</th>
              <th className="text-left px-4 py-3 text-neutral-400 font-medium">Роль</th>
              <th className="text-left px-4 py-3 text-neutral-400 font-medium">Резюме</th>
              <th className="text-left px-4 py-3 text-neutral-400 font-medium">Дата реєстрації</th>
              <th className="text-left px-4 py-3 text-neutral-400 font-medium">Статус</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-neutral-400">
                  Користувачів не знайдено
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="bg-neutral-900/50 hover:bg-neutral-900 transition-colors"
                >
                  <td className="px-4 py-3 text-white font-medium">{u.email}</td>
                  <td className="px-4 py-3 text-neutral-300">{u.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.role === "ADMIN"
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-neutral-700 text-neutral-400"
                      }`}
                    >
                      {u.role === "ADMIN" ? "Адмін" : "Користувач"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-300">{u._count.resumes}</td>
                  <td className="px-4 py-3 text-neutral-400">
                    {new Date(u.createdAt).toLocaleDateString("uk-UA")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.isBlocked
                          ? "bg-red-500/15 text-red-400"
                          : "bg-green-500/15 text-green-400"
                      }`}
                    >
                      {u.isBlocked ? "Заблокований" : "Активний"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== "ADMIN" && (
                      <button
                        onClick={() => handleToggleBlock(u)}
                        title={u.isBlocked ? "Розблокувати" : "Заблокувати"}
                        className={`rounded p-1.5 transition-colors ${
                          u.isBlocked
                            ? "text-neutral-400 hover:bg-green-500/20 hover:text-green-400"
                            : "text-neutral-400 hover:bg-red-500/20 hover:text-red-400"
                        }`}
                      >
                        {u.isBlocked ? (
                          <ShieldCheck className="h-4 w-4" />
                        ) : (
                          <ShieldOff className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-neutral-400">
          <span>
            Показано {(page - 1) * limit + 1}–{Math.min(page * limit, total)} з {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              className="rounded p-1.5 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-white">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
              className="rounded p-1.5 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

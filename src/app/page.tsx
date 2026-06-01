import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full sm:w-[500px] sm:h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 text-center max-w-3xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20 mb-8">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
          Найкращий Конструктор <span className="text-blue-500">ІТ Резюме</span>
        </h1>
        <p className="mt-4 text-xl text-neutral-400 mb-10 leading-relaxed font-light">
          Створіть професійне резюме за лічені хвилини. Експортуйте у PDF і виділяйтеся серед найкращих технологічних роботодавців завдяки чистому, сучасному формату.
        </p>
        <div className="mt-8 flex items-center justify-center gap-x-6">
          <Link
            href="/dashboard"
            className="group flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500 hover:shadow-blue-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Розпочати
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-neutral-300 hover:text-white transition-colors"
          >
            Увійти
          </Link>
        </div>
      </div>
    </div>
  );
}

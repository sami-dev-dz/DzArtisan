import { Footer } from "@/components/layout/Footer";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
      <div className="blob left-[-10%] top-[-10%] dark:opacity-30" />
      <div className="blob blob-2 right-[-5%] bottom-[-5%] w-[400px] h-[400px] opacity-60 dark:opacity-20" />
      <div className="blob left-[20%] bottom-[-10%] w-[300px] h-[300px] bg-teal-100 dark:bg-teal-900/40 opacity-20 dark:opacity-10" />

      <main className="flex-1 flex items-center justify-center w-full px-4 py-12 relative z-10">
        <div className="w-full max-w-[480px]">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

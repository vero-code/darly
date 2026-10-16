import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200/60 via-sky-100/50 to-blue-50/60 text-slate-800 flex flex-col relative overflow-x-hidden">
      {/* Header */}
      <div className="relative z-10">
        <Header />
      </div>
    </div>
  );
}

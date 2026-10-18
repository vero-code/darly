import React from 'react';
import { Cloud } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto border-t border-sky-100 bg-white/70 backdrop-blur-md py-5 px-4 text-[14px] text-slate-600">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
        {/* Left */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span>© {currentYear}</span>
          <span className="font-bold text-slate-800">Darly</span>
          <span className="text-slate-400">·</span>
          <span>Quiet and unobtrusive care powered by Ring entryway devices</span>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-slate-500">
          <div className="flex items-center gap-1.5 text-sky-700">
            <Cloud className="w-4 h-4 fill-sky-200 text-sky-500" />
            <span>Built by</span>
            <a
              href="https://github.com/vero-code"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sky-600 hover:text-sky-800 underline underline-offset-4 decoration-sky-300 hover:decoration-sky-600 transition-colors cursor-pointer"
            >
              Veronika Kashtanova
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

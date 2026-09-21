import React from 'react';

/* ─── Left panel decorative icons ───────────────────────── */
const CheckCircleIcon = () => (
  <svg className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9.25" fill="#3B82C4" fillOpacity="0.12" stroke="#3B82C4" strokeWidth="0.5"/>
    <path d="M6.5 10.25l2.4 2.5 4.6-5" stroke="#3B82C4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ─── Logo Mark ──────────────────────────────────────────── */
const LogoMark = () => (
  <div className="flex items-center gap-2.5 mb-14">
    <div
      className="w-8 h-8 rounded-[9px] flex items-center justify-center shadow-sm"
      style={{ background: '#3B82C4' }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1 0-5H20"/>
        <line x1="8" y1="7" x2="15" y2="7"/>
        <line x1="8" y1="11" x2="13" y2="11"/>
      </svg>
    </div>
    <span className="font-semibold text-[15px] tracking-tight text-[#0d1117]">KnowledgeGPT</span>
  </div>
);

/* ─── Features list ──────────────────────────────────────── */
const FEATURES = [
  'Instant answers grounded in your citations',
  'Auto-summaries of dense PDFs & web pages',
  'A calm, distraction-free writing environment',
];

/* ─── AuthLayout ─────────────────────────────────────────── */
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white">

      {/* ── Left Panel ──────────────────────────────────── */}
      <div
        className="hidden min-[900px]:flex flex-col relative w-[46%] max-w-[560px] overflow-hidden border-r"
        style={{
          background: 'linear-gradient(145deg, #f0f8ff 0%, #cce5ff 100%)',
          borderColor: 'rgba(204,229,255,0.8)',
        }}
      >
        {/* Orb 1 — top left */}
        <div
          className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.65) 0%, transparent 70%)' }}
        />
        {/* Orb 2 — bottom right */}
        <div
          className="absolute -bottom-32 -right-20 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,196,0.10) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full px-12 py-12 lg:px-16 lg:py-14">
          <div>
            <LogoMark />

            <h1
              className="text-[38px] lg:text-[42px] leading-[1.22] mb-6 text-[#0d1117] tracking-[-0.02em]"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              Your research,{' '}
              <br />
              <em className="not-italic italic" style={{ color: '#3B82C4' }}>
                deeply understood.
              </em>
            </h1>

            <p className="text-[#7a8799] text-[15px] mb-10 max-w-[380px] leading-[1.65]">
              KnowledgeGPT transforms scattered sources into a single connected workspace — ask questions, surface insights, write faster.
            </p>

            <ul className="space-y-[14px]">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[14px] text-[#3a4a55] leading-snug">
                  <CheckCircleIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <blockquote className="mt-16">
            <div
              className="pl-4 py-0.5"
              style={{ borderLeft: '2px solid #3B82C4' }}
            >
              <p className="text-[#3a4a55] italic text-[13.5px] leading-relaxed mb-2">
                "KnowledgeGPT completely changed how I organise my literature reviews. It's like having a brilliant research assistant available 24/7."
              </p>
              <footer className="text-[12.5px] font-medium text-[#7a8799]">
                — Anubhav Srivastva, AI Researcher
              </footer>
            </div>
          </blockquote>
        </div>
      </div>

      {/* ── Right Panel ─────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 bg-white"
        style={{
          animation: 'fadeSlideUp 0.42s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        {children}
      </div>

      {/* Keyframes injected via a style tag */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}

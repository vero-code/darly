import React from 'react';

// Fluffy Cumulus Cloud with detailed puffs
export const CumulusCloud: React.FC<{ 
  className?: string; 
  id?: string;
  flip?: boolean;
}> = ({ className = '', id = 'cumulus-grad', flip = false }) => (
  <svg
    viewBox="0 0 240 140"
    className={`pointer-events-none select-none drop-shadow-[0_12px_24px_rgba(56,189,248,0.22)] ${className}`}
    style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#dbeafe" />
      </linearGradient>
      <linearGradient id={`${id}-puff`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.4" />
      </linearGradient>
    </defs>

    {/* Main Cloud Body */}
    <path
      d="M50,115 
         C25,115 10,95 10,72 
         C10,50 26,38 46,38 
         C52,20 74,10 98,10 
         C126,10 148,24 158,45 
         C172,35 194,38 206,52 
         C226,55 235,74 235,92 
         C235,115 215,115 190,115 
         Z"
      fill={`url(#${id})`}
      stroke="#7dd3fc"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Fluffy Highlight Puffs for 3D */}
    <ellipse cx="98" cy="48" rx="42" ry="24" fill={`url(#${id}-puff)`} />
    <ellipse cx="156" cy="62" rx="30" ry="18" fill={`url(#${id}-puff)`} />
    <ellipse cx="55" cy="72" rx="26" ry="16" fill={`url(#${id}-puff)`} />
    <ellipse cx="195" cy="80" rx="24" ry="14" fill={`url(#${id}-puff)`} />
  </svg>
);

// Gentle Elongated Stratus Cloud
export const StratusCloud: React.FC<{ 
  className?: string; 
  id?: string;
}> = ({ className = '', id = 'stratus-grad' }) => (
  <svg
    viewBox="0 0 280 100"
    className={`pointer-events-none select-none drop-shadow-[0_8px_20px_rgba(56,189,248,0.2)] ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#dbeafe" />
      </linearGradient>
    </defs>
    <path
      d="M35,75 
         C15,75 5,62 5,48 
         C5,35 18,25 32,25 
         C42,12 65,8 88,14 
         C105,6 135,5 158,15 
         C175,8 208,10 225,24 
         C245,20 270,32 272,48 
         C275,65 258,75 235,75 
         Z"
      fill={`url(#${id})`}
      stroke="#7dd3fc"
      strokeWidth="1.8"
    />
  </svg>
);

// Cute Compact Cloudlet
export const MiniCloudlet: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 70"
    className={`pointer-events-none select-none drop-shadow-[0_4px_12px_rgba(56,189,248,0.18)] ${className}`}
    aria-hidden="true"
  >
    <path
      d="M20,55 C8,55 2,44 2,34 C2,24 12,18 22,18 C26,10 38,4 50,4 C64,4 74,12 80,20 C88,16 98,18 104,24 C114,26 118,36 118,44 C118,55 106,55 96,55 Z"
      fill="#ffffff"
      stroke="#93c5fd"
      strokeWidth="1.5"
    />
  </svg>
);

// Comprehensive Visible Floating Clouds Scene
export const FloatingCloudsBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Large Hero Cumulus Top-Left */}
      <div className="absolute -top-10 -left-16 w-[420px] h-[240px] cloud-float-slow opacity-95">
        <CumulusCloud id="cloud-hero-left" className="w-full h-full" />
      </div>

      {/* 2. Giant Cumulus Top-Right */}
      <div className="absolute -top-12 -right-20 w-[480px] h-[280px] cloud-float-gentle opacity-95">
        <CumulusCloud id="cloud-hero-right" className="w-full h-full" flip />
      </div>

      {/* 3. Mid-Sky Floating Cloudlet (Center-Left) */}
      <div className="absolute top-28 left-[18%] w-[260px] h-[150px] cloud-drift-right opacity-90">
        <StratusCloud id="cloud-mid-left" className="w-full h-full" />
      </div>

      {/* 4. Drifting Cloudlet (Center-Right) */}
      <div className="absolute top-36 right-[22%] w-[240px] h-[130px] cloud-drift-left opacity-90">
        <StratusCloud id="cloud-mid-right" className="w-full h-full" />
      </div>

      {/* 5. Left Side Fluffy Cloud (Mid-Page) */}
      <div className="absolute top-[42%] -left-12 w-[360px] h-[210px] cloud-float-gentle opacity-90">
        <CumulusCloud id="cloud-side-left" className="w-full h-full" />
      </div>

      {/* 6. Right Side Fluffy Cloud (Mid-Page) */}
      <div className="absolute top-[48%] -right-16 w-[400px] h-[230px] cloud-float-slow opacity-90">
        <CumulusCloud id="cloud-side-right" className="w-full h-full" flip />
      </div>

      {/* 7. Cute Small Cloudlet Floating at Mid-Bottom */}
      <div className="absolute top-[65%] left-[8%] w-[160px] h-[95px] cloud-drift-right opacity-85">
        <MiniCloudlet className="w-full h-full" />
      </div>

      {/* 8. Another Cute Small Cloudlet at Mid-Right */}
      <div className="absolute top-[70%] right-[10%] w-[170px] h-[100px] cloud-drift-left opacity-85">
        <MiniCloudlet className="w-full h-full" />
      </div>

      {/* 9. Bottom-Left Giant Horizon Cloud */}
      <div className="absolute -bottom-16 -left-14 w-[500px] h-[290px] cloud-float-slow opacity-95">
        <CumulusCloud id="cloud-bot-left" className="w-full h-full" />
      </div>

      {/* 10. Bottom-Center Stratus Cloud */}
      <div className="absolute -bottom-10 left-[35%] w-[420px] h-[180px] cloud-drift-right opacity-90">
        <StratusCloud id="cloud-bot-center" className="w-full h-full" />
      </div>

      {/* 11. Bottom-Right Horizon Cumulus */}
      <div className="absolute -bottom-16 -right-16 w-[520px] h-[300px] cloud-float-gentle opacity-95">
        <CumulusCloud id="cloud-bot-right" className="w-full h-full" flip />
      </div>

      {/* 12. Floating Top-Center Cute Cloudlet */}
      <div className="absolute top-4 left-[46%] w-[150px] h-[85px] cloud-float-slow opacity-90">
        <MiniCloudlet className="w-full h-full" />
      </div>
    </div>
  );
};

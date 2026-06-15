export default function TopographicTexture() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
      style={{ opacity: 0.06 }}
    >
      <g stroke="white" strokeWidth="0.8" strokeLinecap="round">
        <path d="M-50 620 Q200 580 400 640 T800 600 T1250 650" />
        <path d="M-50 660 Q250 620 450 680 T850 640 T1250 690" />
        <path d="M-50 700 Q180 660 380 720 T780 680 T1250 730" />
        <path d="M-50 740 Q220 700 420 760 T820 720 T1250 770" />
      </g>

      <g stroke="white" strokeWidth="0.6" strokeLinecap="round">
        <path d="M-50 420 Q300 380 500 440 T900 400 T1250 450" />
        <path d="M-50 460 Q280 420 480 480 T880 440 T1250 490" />
        <path d="M-50 500 Q320 460 520 520 T920 480 T1250 530" />
        <path d="M-50 540 Q260 500 460 560 T860 520 T1250 570" />
      </g>

      <g stroke="white" strokeWidth="0.5" strokeLinecap="round">
        <path d="M-50 180 Q350 140 550 200 T950 160 T1250 210" />
        <path d="M-50 220 Q330 180 530 240 T930 200 T1250 250" />
        <path d="M-50 260 Q370 220 570 280 T970 240 T1250 290" />
        <path d="M-50 300 Q310 260 510 320 T910 280 T1250 330" />
      </g>

      <g stroke="white" strokeWidth="0.4" strokeLinecap="round" opacity="0.7">
        <ellipse cx="900" cy="300" rx="120" ry="80" />
        <ellipse cx="900" cy="300" rx="160" ry="110" />
        <ellipse cx="900" cy="300" rx="200" ry="140" />
        <ellipse cx="900" cy="300" rx="250" ry="175" />
      </g>

      <g stroke="white" strokeWidth="0.4" strokeLinecap="round" opacity="0.5">
        <ellipse cx="200" cy="500" rx="100" ry="65" />
        <ellipse cx="200" cy="500" rx="140" ry="90" />
        <ellipse cx="200" cy="500" rx="185" ry="120" />
      </g>

      <g stroke="white" strokeWidth="0.3" strokeLinecap="round" opacity="0.4">
        <path d="M100 100 Q400 80 600 130 T1100 90" />
        <path d="M50 350 Q350 330 550 380 T1050 340" />
        <path d="M80 580 Q380 560 580 610 T1080 570" />
      </g>
    </svg>
  );
}

interface PandaLogoProps {
  size?: number
}

export function PandaLogo({ size = 80 }: PandaLogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="white" />
      <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="2" />

      {/* Left ear */}
      <circle cx="25" cy="25" r="15" fill="black" />
      <circle cx="25" cy="25" r="10" fill="white" />

      {/* Right ear */}
      <circle cx="75" cy="25" r="15" fill="black" />
      <circle cx="75" cy="25" r="10" fill="white" />

      {/* Left eye */}
      <ellipse cx="35" cy="45" rx="10" ry="12" fill="black" />
      <circle cx="33" cy="42" r="3" fill="white" />

      {/* Right eye */}
      <ellipse cx="65" cy="45" rx="10" ry="12" fill="black" />
      <circle cx="63" cy="42" r="3" fill="white" />

      {/* Nose */}
      <circle cx="50" cy="60" r="5" fill="black" />

      {/* Mouth */}
      <path d="M45 65 Q50 70 55 65" stroke="black" strokeWidth="2" fill="none" />

      {/* Blush spots */}
      <circle cx="30" cy="60" r="5" fill="#FFAAAA" opacity="0.6" />
      <circle cx="70" cy="60" r="5" fill="#FFAAAA" opacity="0.6" />
    </svg>
  )
}

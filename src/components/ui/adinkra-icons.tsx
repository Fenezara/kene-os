import React from 'react'

export function SankofaIcon({ className = "w-6 h-6 text-[#C8951E]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      {/* Sankofa stylized bird looking backward holding the golden seed of wisdom */}
      <path d="M50 15 C 30 15, 15 30, 15 50 C 15 70, 30 85, 50 85 C 70 85, 85 70, 85 50 C 85 40, 78 30, 70 25 C 65 30, 60 40, 60 50 C 60 65, 45 70, 35 60 C 28 53, 30 40, 40 32 C 45 28, 55 28, 55 20 C 55 18, 52 15, 50 15 Z M 42 22 A 4 4 0 1 1 42 30 A 4 4 0 1 1 42 22 Z" />
    </svg>
  )
}

export function GyeNyameIcon({ className = "w-6 h-6 text-[#C8951E]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      {/* Gye Nyame symbol of divine excellence & protection */}
      <path d="M 35 10 L 45 10 L 45 90 L 35 90 Z M 65 10 L 55 10 L 55 90 L 65 90 Z M 20 30 C 35 20, 35 45, 50 45 C 65 45, 65 20, 80 30 C 85 45, 75 55, 65 55 C 50 55, 50 75, 80 70 C 80 85, 65 85, 50 75 C 35 75, 35 85, 20 70 C 25 55, 35 55, 35 45 Z" />
    </svg>
  )
}

export function BogolanPatternDivider({ className = "w-full h-4 text-[#C8951E]/20" }: { className?: string }) {
  return (
    <div className={`overflow-hidden flex items-center justify-center ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 400 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <pattern id="bogolan" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M 0 10 L 10 0 L 20 10 L 30 0 L 40 10 L 30 20 L 20 10 L 10 20 Z" />
          <circle cx="20" cy="10" r="2" fill="currentColor" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#bogolan)" />
      </svg>
    </div>
  )
}

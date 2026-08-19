export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0F0A05] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Pulsing gold ring */}
        <div className="w-16 h-16 rounded-full border-4 border-[#C8951E]/20 border-t-[#C8951E] animate-spin" />
        {/* Inner glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F3E5AB] to-[#C8951E] animate-pulse" />
        </div>
      </div>
      <p className="text-white/40 text-xs font-mono mt-6 animate-pulse">
        Chargement en cours…
      </p>
      <p className="text-white/15 text-[9px] font-mono mt-2">Kènè OS</p>
    </div>
  );
}

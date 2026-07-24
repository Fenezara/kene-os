'use client';
import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';

interface AvatarUploadProps {
  value?: string; // base64 or URL
  initials?: string;
  onChange: (base64: string) => void;
  size?: number;
}

export function AvatarUpload({ value, initials = 'KP', onChange, size = 80 }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  
  return (
    <div 
      className="relative cursor-pointer group"
      style={{ width: size, height: size }}
      onClick={() => inputRef.current?.click()}
    >
      {/* Avatar circle */}
      <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-[#C8951E]/30 group-hover:border-[#C8951E] transition-all">
        {value ? (
          <img src={value} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#C8951E]/30 to-[#8A3B14]/20 flex items-center justify-center">
            <span className="font-display font-black text-[#C8951E]" style={{ fontSize: size * 0.3 }}>{initials}</span>
          </div>
        )}
      </div>
      {/* Camera overlay */}
      <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Camera className="text-white" style={{ width: size * 0.3, height: size * 0.3 }} />
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

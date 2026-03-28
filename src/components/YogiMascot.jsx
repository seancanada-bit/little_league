export default function YogiMascot({ size = 120, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Body */}
      <ellipse cx="60" cy="85" rx="32" ry="28" fill="#F8F4E8"/>
      {/* Pinstripes on body */}
      <line x1="50" y1="60" x2="48" y2="113" stroke="#1B3A6B" strokeWidth="1.5" strokeOpacity="0.4"/>
      <line x1="60" y1="58" x2="60" y2="113" stroke="#1B3A6B" strokeWidth="1.5" strokeOpacity="0.4"/>
      <line x1="70" y1="60" x2="72" y2="113" stroke="#1B3A6B" strokeWidth="1.5" strokeOpacity="0.4"/>
      {/* Head */}
      <circle cx="60" cy="45" r="24" fill="#F5D5A8"/>
      {/* Catcher's mask */}
      <path d="M38 38 Q60 28 82 38 L80 58 Q60 65 40 58 Z" fill="#1B3A6B" opacity="0.85"/>
      {/* Mask bars */}
      <line x1="42" y1="40" x2="40" y2="56" stroke="#F5C842" strokeWidth="1.5"/>
      <line x1="54" y1="36" x2="53" y2="58" stroke="#F5C842" strokeWidth="1.5"/>
      <line x1="66" y1="36" x2="67" y2="58" stroke="#F5C842" strokeWidth="1.5"/>
      <line x1="78" y1="40" x2="80" y2="56" stroke="#F5C842" strokeWidth="1.5"/>
      {/* Eyes */}
      <circle cx="52" cy="46" r="3.5" fill="white"/>
      <circle cx="68" cy="46" r="3.5" fill="white"/>
      <circle cx="53" cy="47" r="2" fill="#2C1810"/>
      <circle cx="69" cy="47" r="2" fill="#2C1810"/>
      {/* Smile */}
      <path d="M50 56 Q60 63 70 56" stroke="#2C1810" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Cap */}
      <ellipse cx="60" cy="24" rx="22" ry="5" fill="#1B3A6B"/>
      <path d="M38 24 Q60 14 82 24" fill="#1B3A6B"/>
      {/* NY on cap */}
      <text x="55" y="23" fill="#F5C842" fontSize="9" fontWeight="bold" fontFamily="serif">NY</text>
      {/* Arms */}
      <ellipse cx="28" cy="80" rx="9" ry="14" fill="#F8F4E8" transform="rotate(-20 28 80)"/>
      <ellipse cx="92" cy="80" rx="9" ry="14" fill="#F8F4E8" transform="rotate(20 92 80)"/>
      {/* Mitt */}
      <ellipse cx="22" cy="90" rx="11" ry="9" fill="#8B5E3C"/>
      <circle cx="22" cy="90" r="5" fill="#6B4423" opacity="0.5"/>
      {/* Baseball in mitt */}
      <circle cx="22" cy="90" r="4" fill="white" stroke="#ccc" strokeWidth="0.5"/>
      <path d="M19 88 Q22 91 25 88" stroke="#FF6B6B" strokeWidth="0.8" fill="none"/>
      <path d="M19 92 Q22 89 25 92" stroke="#FF6B6B" strokeWidth="0.8" fill="none"/>
      {/* Legs */}
      <rect x="47" y="110" width="11" height="8" rx="4" fill="#1B3A6B"/>
      <rect x="62" y="110" width="11" height="8" rx="4" fill="#1B3A6B"/>
    </svg>
  )
}

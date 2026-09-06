export interface ThemePreset {
  slug: string;
  name: string;
  bgType: 'COLOR' | 'GRADIENT';
  background: string;
  cardBg: string;
  accent: string;
  textColor: string;
  borderClass: string;
  fontFamily: string;
  isPremium?: boolean;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    slug: 'cyber',
    name: 'Cyberpunk Neon',
    bgType: 'GRADIENT',
    background: 'radial-gradient(circle at 50% 0%, #1a0933 0%, #0a0a14 70%)',
    cardBg: 'rgba(18, 14, 32, 0.85)',
    accent: '#00f0ff',
    textColor: '#ffffff',
    borderClass: 'border-cyan-500/40 shadow-neon-cyan',
    fontFamily: 'Inter',
  },
  {
    slug: 'neon-purple',
    name: 'Royal Nebula',
    bgType: 'GRADIENT',
    background: 'radial-gradient(circle at 50% 0%, #2a084e 0%, #090314 70%)',
    cardBg: 'rgba(25, 8, 48, 0.85)',
    accent: '#9d4edd',
    textColor: '#ffffff',
    borderClass: 'border-purple-500/40 shadow-neon',
    fontFamily: 'Inter',
  },
  {
    slug: 'dark',
    name: 'Obsidian Midnight',
    bgType: 'COLOR',
    background: '#0a0a0f',
    cardBg: 'rgba(16, 16, 24, 0.9)',
    accent: '#a855f7',
    textColor: '#ffffff',
    borderClass: 'border-zinc-800',
    fontFamily: 'Inter',
  },
  {
    slug: 'crimson',
    name: 'Crimson Blood',
    bgType: 'GRADIENT',
    background: 'radial-gradient(circle at 50% 0%, #3b0717 0%, #0d0105 70%)',
    cardBg: 'rgba(38, 8, 17, 0.88)',
    accent: '#ff0055',
    textColor: '#ffffff',
    borderClass: 'border-rose-500/40 shadow-neon-pink',
    fontFamily: 'Inter',
    isPremium: true,
  },
  {
    slug: 'azure',
    name: 'Azure Horizon',
    bgType: 'GRADIENT',
    background: 'radial-gradient(circle at 50% 0%, #08284d 0%, #030a14 70%)',
    cardBg: 'rgba(8, 28, 54, 0.85)',
    accent: '#38bdf8',
    textColor: '#ffffff',
    borderClass: 'border-sky-500/40 shadow-neon-cyan',
    fontFamily: 'Inter',
  },
  {
    slug: 'minimal',
    name: 'Minimal Dark',
    bgType: 'COLOR',
    background: '#000000',
    cardBg: '#0b0b0e',
    accent: '#e2e8f0',
    textColor: '#ffffff',
    borderClass: 'border-zinc-800',
    fontFamily: 'Inter',
  },
  {
    slug: 'gaming-rgb',
    name: 'BattleStation RGB',
    bgType: 'GRADIENT',
    background: 'radial-gradient(circle at 50% 0%, #062b1e 0%, #050a12 70%)',
    cardBg: 'rgba(12, 24, 20, 0.88)',
    accent: '#10b981',
    textColor: '#ffffff',
    borderClass: 'border-emerald-500/50 shadow-neon-cyan',
    fontFamily: 'Inter',
    isPremium: true,
  },
  {
    slug: 'glassmorphism',
    name: 'Frosted Glass',
    bgType: 'GRADIENT',
    background: 'linear-gradient(135deg, #131524 0%, #080910 100%)',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    accent: '#c084fc',
    textColor: '#ffffff',
    borderClass: 'border-white/15 backdrop-blur-xl',
    fontFamily: 'Inter',
  },
  {
    slug: 'amoled',
    name: 'Pitch Black AMOLED',
    bgType: 'COLOR',
    background: '#000000',
    cardBg: '#000000',
    accent: '#818cf8',
    textColor: '#ffffff',
    borderClass: 'border-zinc-900',
    fontFamily: 'Inter',
    isPremium: true,
  },
];

export function getThemePreset(slug?: string | null): ThemePreset {
  if (!slug) return THEME_PRESETS[0];
  const found = THEME_PRESETS.find((t) => t.slug === slug);
  return found || THEME_PRESETS[0];
}

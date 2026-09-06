import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08080f] py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-400">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
            W
          </div>
          <span className="text-zinc-200 font-semibold tracking-wider">WANS</span>
          <span className="text-zinc-600">|</span>
          <span>Next-Gen Identity & Profile Platform</span>
        </div>

        <div className="flex items-center space-x-6 text-xs text-zinc-400">
          <Link href="/explore" className="hover:text-cyan-400 transition-colors">
            Explore Profiles
          </Link>
          <Link href="/pricing" className="hover:text-purple-400 transition-colors">
            Pricing
          </Link>
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
            Privacy
          </Link>
        </div>

        <div className="text-xs text-zinc-500">
          © {new Date().getFullYear()} WANS. Built with passion for gamers & creators.
        </div>
      </div>
    </footer>
  );
}

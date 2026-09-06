import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WANS — Your Identity. Your Profile.',
  description: 'Next-generation personal profile platform. Customize every detail, connect social accounts, and share your cyber identity with one link.',
  keywords: ['profile', 'link in bio', 'gaming profile', 'cyberpunk', 'portfolio', 'wans'],
  openGraph: {
    title: 'WANS — Your Identity. Your Profile.',
    description: 'Create your own gaming & cyber profile with custom music, themes, and badges.',
    url: 'https://wans.gg',
    siteName: 'WANS',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WANS — Your Identity. Your Profile.',
    description: 'Create your own personal profile with custom music, themes, and badges.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0f] text-white min-h-screen flex flex-col selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}

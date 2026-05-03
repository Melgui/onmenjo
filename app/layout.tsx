import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'OnMenjo',
  description: 'Troba on menjar i quina targeta accepten',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ca">
      <body className="bg-gray-50 font-sans">
        <header className="bg-white border-b border-gray-100 px-4 py-3">
          <Link href="/" className="font-semibold text-gray-900 hover:opacity-70 transition-opacity">OnMenjo</Link>
        </header>
        {children}
        <footer className="border-t border-gray-100 px-4 py-4 text-center text-xs text-gray-400 mt-8">
          Dades aportades per la comunitat
        </footer>
      </body>
    </html>
  );
}

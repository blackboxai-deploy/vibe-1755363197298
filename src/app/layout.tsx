import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Space Defender - Epic Space Combat Game',
  description: 'Defend Earth from incoming asteroids and enemy ships in this epic space battle. How long can you survive the cosmic onslaught?',
  keywords: 'game, space, shooter, arcade, defense, html5, browser game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
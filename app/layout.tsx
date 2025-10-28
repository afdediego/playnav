import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PlayNav - Invasores del Espacio',
  description: 'Juego arcade clásico de Invasores del Espacio construido con Next.js',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}



import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UNIPORT Hostel Allocation Portal',
  description: 'Secure and browse hostel spaces at University of Port Harcourt',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="h-full text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

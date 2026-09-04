import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Schedula | Smart Healthcare', description: 'Healthcare scheduling and care management' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

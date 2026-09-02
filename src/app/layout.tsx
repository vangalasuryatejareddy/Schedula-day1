import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Schedula | Healthcare Portal", description: "Doctor and patient appointment management" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

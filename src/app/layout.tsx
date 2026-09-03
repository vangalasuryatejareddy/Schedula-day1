import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title:"Schedula | Healthcare Portal", description:"Healthcare scheduling and care management" };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}

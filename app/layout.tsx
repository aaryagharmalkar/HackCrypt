'use client'

import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/shared/Sidebar";
import { AuthProvider } from "@/components/AuthProvider";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-secondary/20`}
      >
        <AuthProvider>
          {isAuthPage ? (
            children
          ) : (
            <div className="flex min-h-screen bg-background text-foreground">
              <Sidebar />
              <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 lg:px-12">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}


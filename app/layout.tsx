import Link from "next/link";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Renewalytics",
  description:
    "Mock data platform for renewable energy deployments across Karnataka districts.",
};

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/insights", label: "Insights" },
  { href: "/simulator", label: "Simulator" },
  { href: "/reports", label: "Reports" },
  { href: "/how-we-built", label: "How We Built" },
];

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen bg-gray-50 font-sans text-slate-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
              <Link href="/dashboard" className="text-xl font-semibold text-brand-dark">
                Renewalytics
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-2 py-1 transition hover:text-brand-dark"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-4">
            <div className="mx-auto w-full max-w-7xl px-6 text-sm text-slate-500">
              © {new Date().getFullYear()} Renewalytics · Demo mock-data experience
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

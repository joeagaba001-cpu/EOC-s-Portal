import { Link } from "wouter";
import { useState } from "react";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { Show } from "@clerk/react";

const navLinks = [
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Training Programs" },
  { href: "/sponsorship", label: "Sponsorship" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img className="h-9 w-auto" src={`${import.meta.env.BASE_URL}logo.svg`} alt="EEOMF" />
            <span className="font-serif font-semibold text-primary text-sm hidden lg:block leading-tight max-w-[220px]">
              Elizabeth Onyaole Okwori Memorial Foundation
            </span>
            <span className="font-serif font-bold text-primary text-base lg:hidden">EEOMF</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Show when="signed-in">
              <Link href="/dashboard" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">My Dashboard</Link>
            </Show>
            <Show when="signed-out">
              <Link href="/sign-in" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Log in</Link>
              <Link href="/sign-up" className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
                Register Free
              </Link>
            </Show>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 text-foreground" onClick={() => setMobileOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </nav>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <span className="font-serif font-semibold text-primary text-sm">EEOMF</span>
                <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-foreground" /></button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                {navLinks.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                    className="block px-5 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="px-5 py-4 border-t space-y-2">
                <Show when="signed-in">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                    className="block text-center bg-primary text-white font-semibold px-4 py-2.5 rounded-full text-sm">
                    My Dashboard
                  </Link>
                </Show>
                <Show when="signed-out">
                  <Link href="/sign-up" onClick={() => setMobileOpen(false)}
                    className="block text-center bg-primary text-white font-semibold px-4 py-2.5 rounded-full text-sm">
                    Register Free
                  </Link>
                  <Link href="/sign-in" onClick={() => setMobileOpen(false)}
                    className="block text-center border border-gray-200 text-foreground font-medium px-4 py-2.5 rounded-full text-sm">
                    Log in
                  </Link>
                </Show>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground/70 py-12 mt-auto">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img className="h-8 w-auto brightness-0 invert" src={`${import.meta.env.BASE_URL}logo.svg`} alt="EEOMF" />
                <span className="font-serif font-semibold text-white text-sm">EEOMF</span>
              </div>
              <p className="text-sm leading-relaxed">Elizabeth Onyaole Okwori Memorial Foundation — empowering lives through free vocational training.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/programs", label: "Training Programs" },
                  { href: "/sponsorship", label: "Sponsorship" },
                  { href: "/beneficiary", label: "Fund Requests" },
                  { href: "/contact", label: "Contact Us" },
                  { href: "/faq", label: "FAQ" },
                ].map(l => (
                  <div key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2"><MapPin className="w-4 h-4 shrink-0 mt-0.5 text-secondary" /><span>No. 25, David Stone Street, Otukpo, Nigeria</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-secondary" /><span>0803 451 4674 | 0913 209 4696</span></div>
                <div className="flex items-center gap-2"><span className="text-green-400 font-bold text-xs">WA</span><a href="https://wa.me/2348122990636" className="hover:text-white">0812 299 0636</a></div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-secondary" /><a href="mailto:odehonyema97@gmail.com" className="hover:text-white text-xs">odehonyema97@gmail.com</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-xs">
            © {new Date().getFullYear()} Elizabeth Onyaole Okwori Memorial Foundation. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

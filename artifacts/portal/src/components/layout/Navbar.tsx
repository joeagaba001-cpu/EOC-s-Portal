import { Link } from "wouter";
import { Show, useClerk } from "@clerk/react";
import { useGetMyProfile, useListNotifications, getListNotificationsQueryKey } from "@workspace/api-client-react";
import { Bell, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useClerk();
  const { data: profile } = useGetMyProfile();
  
  // Only fetch notifications if signed in and role is participant
  const { data: notifications } = useListNotifications({
    query: {
      enabled: !!profile && profile.role === "participant",
      queryKey: getListNotificationsQueryKey(),
    }
  });
  
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
            <img className="h-10 w-auto" src={`${import.meta.env.BASE_URL}logo.svg`} alt="EOC" />
            <span className="font-serif font-semibold text-primary text-xl hidden sm:block">Elizabeth Okwori's Confectionery</span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8 items-center">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Home</Link>
          <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">About</Link>
          <Link href="/programs" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Programs</Link>
          
          <Show when="signed-out">
            <Link href="/sign-up" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Registration</Link>
            <Link href="/sign-in" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Log in</Link>
          </Show>
          
          <Show when="signed-in">
            {profile?.role === "participant" && (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Dashboard</Link>
                <Link href="/notifications" className="relative p-2 text-foreground hover:text-primary transition-colors">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white text-center leading-4">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            
            {profile?.role === "officer" && (
              <Link href="/officer" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Officer Portal</Link>
            )}
            
            <Button variant="ghost" size="sm" onClick={() => signOut({ redirectUrl: "/" })} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </Show>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50 bg-black/20" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <img className="h-8 w-auto" src={`${import.meta.env.BASE_URL}logo.svg`} alt="EOC" />
                <span className="font-serif font-semibold text-primary text-lg">EOC</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Link href="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                  <Link href="/about" className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>About</Link>
                  <Link href="/programs" className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Programs</Link>
                </div>
                <div className="py-6">
                  <Show when="signed-out">
                    <Link href="/sign-up" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Registration</Link>
                    <Link href="/sign-in" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-primary hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                  </Show>
                  <Show when="signed-in">
                    {profile?.role === "participant" && (
                      <>
                        <Link href="/dashboard" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                        <Link href="/notifications" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-gray-50 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                          Notifications
                          {unreadCount > 0 && (
                            <span className="inline-block h-5 w-5 rounded-full bg-destructive text-xs font-bold text-white text-center leading-5">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                      </>
                    )}
                    {profile?.role === "officer" && (
                      <Link href="/officer" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>Officer Portal</Link>
                    )}
                    <button
                      type="button"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-gray-50 w-full text-left"
                      onClick={() => signOut({ redirectUrl: "/" })}
                    >
                      Sign out
                    </button>
                  </Show>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

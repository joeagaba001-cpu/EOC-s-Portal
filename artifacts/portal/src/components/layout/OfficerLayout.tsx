import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useClerk } from "@clerk/react";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BookOpen, 
  PackageSearch, 
  BellRing, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";

export function OfficerLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/officer', icon: LayoutDashboard },
    { name: 'Participants', href: '/officer/participants', icon: Users },
    { name: 'Payments', href: '/officer/payments', icon: CreditCard },
    { name: 'Skills', href: '/officer/skills', icon: BookOpen },
    { name: 'Packages', href: '/officer/packages', icon: PackageSearch },
    { name: 'Notifications', href: '/officer/notifications', icon: BellRing },
    { name: 'Settings', href: '/officer/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="EOC Logo" className="h-8 w-8 brightness-0 invert" />
          <span className="font-serif font-medium">EOC Officer</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-primary text-primary-foreground transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:flex lg:flex-col lg:h-screen lg:w-64 lg:flex-shrink-0`}>
        <div className="h-16 flex items-center gap-3 px-6 lg:border-b lg:border-primary-foreground/10 hidden lg:flex">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="EOC Logo" className="h-8 w-8 brightness-0 invert" />
          <span className="font-serif font-bold text-lg">EOC Portal</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 lg:py-4 flex flex-col gap-1 px-3 mt-16 lg:mt-0">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-secondary text-secondary-foreground' : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground'}`}>
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-primary-foreground/10">
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0 h-screen overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

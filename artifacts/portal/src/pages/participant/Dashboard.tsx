import { ParticipantLayout } from "@/components/layout/ParticipantLayout";
import { useGetMyProfile, useListNotifications, getListNotificationsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  UserCircle, 
  ChefHat, 
  BookOpenCheck, 
  Receipt, 
  Bell, 
  Megaphone, 
  HelpCircle, 
  LogOut 
} from "lucide-react";
import { useClerk } from "@clerk/react";

export default function Dashboard() {
  const { data: profile } = useGetMyProfile();
  const { signOut } = useClerk();
  
  const { data: notifications } = useListNotifications({
    query: {
      enabled: !!profile,
      queryKey: getListNotificationsQueryKey(),
    }
  });
  
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const cards = [
    {
      title: "My Profile",
      description: "Manage your personal information",
      icon: UserCircle,
      href: "/profile",
      color: "bg-blue-50 text-blue-700",
      borderColor: "border-blue-200"
    },
    {
      title: "Catering Skills",
      description: "Browse and select skills to learn",
      icon: ChefHat,
      href: "/skills",
      color: "bg-emerald-50 text-primary",
      borderColor: "border-emerald-200"
    },
    {
      title: "Enrollment Packages",
      description: "View your current enrollments",
      icon: BookOpenCheck,
      href: "/programs", // Can redirect to skills or a dedicated packages view
      color: "bg-purple-50 text-purple-700",
      borderColor: "border-purple-200"
    },
    {
      title: "Payment Upload",
      description: "Submit proof of payment",
      icon: Receipt,
      href: "/payments",
      color: "bg-amber-50 text-amber-700",
      borderColor: "border-amber-200"
    },
    {
      title: "Notifications",
      description: "View alerts and messages",
      icon: Bell,
      href: "/notifications",
      color: "bg-rose-50 text-rose-700",
      borderColor: "border-rose-200",
      badge: unreadCount > 0 ? unreadCount : null
    },
    {
      title: "Announcements",
      description: "Updates from the NGO",
      icon: Megaphone,
      href: "/announcements",
      color: "bg-indigo-50 text-indigo-700",
      borderColor: "border-indigo-200"
    },
    {
      title: "Support",
      description: "Get help with the portal",
      icon: HelpCircle,
      href: "mailto:support@eoc.org", // Just a stub for now
      color: "bg-cyan-50 text-cyan-700",
      borderColor: "border-cyan-200"
    },
    {
      title: "Log Out",
      description: "Sign out of your account",
      icon: LogOut,
      onClick: () => signOut({ redirectUrl: "/" }),
      color: "bg-slate-50 text-slate-700",
      borderColor: "border-slate-200"
    }
  ];

  return (
    <ParticipantLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          {getGreeting()}, {profile?.fullName?.split(' ')[0] || 'Participant'}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to your enrollment portal. Select an option below to continue.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const CardContent = (
            <motion.div
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`relative bg-white p-6 rounded-2xl border ${card.borderColor} shadow-sm cursor-pointer h-full flex flex-col`}
            >
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-500 mt-auto">{card.description}</p>
              
              {card.badge && (
                <div className="absolute top-6 right-6 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-full">
                  {card.badge} New
                </div>
              )}
            </motion.div>
          );

          if (card.onClick) {
            return (
              <div key={card.title} onClick={card.onClick} className="h-full">
                {CardContent}
              </div>
            );
          }

          return (
            <Link key={card.title} href={card.href || "#"} className="h-full block">
              {CardContent}
            </Link>
          );
        })}
      </div>
    </ParticipantLayout>
  );
}

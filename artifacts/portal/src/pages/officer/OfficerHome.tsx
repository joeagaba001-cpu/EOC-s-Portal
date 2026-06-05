import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardStats, useListNotifications } from "@workspace/api-client-react";
import { Users, CreditCard, CheckCircle, BookOpen, Bell, ShieldCheck, Loader2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const statCards = [
  { key: "totalParticipants", label: "Total Participants", icon: Users, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "totalOfficers", label: "Total Officers", icon: ShieldCheck, color: "bg-emerald-50 text-primary border-emerald-200" },
  { key: "pendingPayments", label: "Pending Payments", icon: CreditCard, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "approvedEnrollments", label: "Approved Enrollments", icon: CheckCircle, color: "bg-green-50 text-green-700 border-green-200" },
  { key: "activeSkills", label: "Active Skills", icon: BookOpen, color: "bg-purple-50 text-purple-700 border-purple-200" },
  { key: "recentNotifications", label: "Unread Notifications", icon: Bell, color: "bg-rose-50 text-rose-700 border-rose-200" },
];

export default function OfficerHome() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <OfficerLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </OfficerLayout>
    );
  }

  const statsData = stats as any;

  return (
    <OfficerLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Officer Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Overview of portal activity and enrollment management.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const value = statsData?.[card.key] ?? 0;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className={`border ${card.color.split(" ").find(c => c.startsWith("border-"))}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${card.color.split(" ").slice(0, 2).join(" ")} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{card.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Enrollment by status */}
      {statsData?.enrollmentsByStatus?.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Enrollments by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {statsData.enrollmentsByStatus.map((item: any) => (
                <div key={item.status} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                  <div className="text-xs text-muted-foreground capitalize mt-1">{item.status.replace(/_/g, " ")}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent activity */}
      {statsData?.recentActivity?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statsData.recentActivity.slice(0, 8).map((a: any) => (
                <div key={a.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(a.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </OfficerLayout>
  );
}

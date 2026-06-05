import { ParticipantLayout } from "@/components/layout/ParticipantLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useListNotifications,
  useMarkNotificationRead,
  getListNotificationsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle, CreditCard, BookOpen, GraduationCap, Loader2 } from "lucide-react";

const typeIconMap: Record<string, typeof Bell> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  payment: CreditCard,
  skills: BookOpen,
  enrollment: GraduationCap,
};

const typeBg: Record<string, string> = {
  info: "bg-blue-50 text-blue-700",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  payment: "bg-purple-50 text-purple-700",
  skills: "bg-emerald-50 text-primary",
  enrollment: "bg-indigo-50 text-indigo-700",
};

export default function Notifications() {
  const { data: notifications, isLoading } = useListNotifications();
  const markRead = useMarkNotificationRead();
  const queryClient = useQueryClient();

  const handleMarkRead = (id: number) => {
    markRead.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      }
    });
  };

  const unread = notifications?.filter(n => !n.isRead) || [];

  return (
    <ParticipantLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Notifications</h1>
            {unread.length > 0 && (
              <p className="text-muted-foreground mt-1">{unread.length} unread message{unread.length > 1 ? "s" : ""}</p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : !notifications?.length ? (
          <Card className="text-center py-16">
            <CardContent>
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-muted-foreground font-medium">No notifications yet</p>
              <p className="text-sm text-gray-400 mt-1">We'll notify you of any updates to your enrollment or payments.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {[...notifications].reverse().map(n => {
              const Icon = typeIconMap[n.type] || Info;
              const iconBg = typeBg[n.type] || typeBg.info;
              return (
                <Card
                  key={n.id}
                  data-testid={`card-notification-${n.id}`}
                  className={`transition-all ${!n.isRead ? "border-primary/40 bg-primary/5 shadow-sm" : "border-gray-100"}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-semibold text-sm ${!n.isRead ? "text-gray-900" : "text-gray-700"}`}>{n.title}</p>
                          {!n.isRead && <Badge variant="secondary" className="text-xs flex-shrink-0">New</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-gray-400">
                            {new Date(n.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                          {!n.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 text-primary hover:text-primary/80"
                              onClick={() => handleMarkRead(n.id)}
                              disabled={markRead.isPending}
                              data-testid={`button-mark-read-${n.id}`}
                            >
                              <CheckCheck className="w-3 h-3 mr-1" /> Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ParticipantLayout>
  );
}

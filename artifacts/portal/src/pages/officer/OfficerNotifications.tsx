import { useState } from "react";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  useSendNotification,
  useListNotifications,
  getListNotificationsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Send, Bell, BellRing, Loader2 } from "lucide-react";

export default function OfficerNotifications() {
  const { data: notifications, isLoading } = useListNotifications();
  const sendNotification = useSendNotification();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isBulk, setIsBulk] = useState(true);

  const handleSend = () => {
    if (!title || !message) {
      toast({ title: "Required", description: "Title and message are required.", variant: "destructive" });
      return;
    }
    sendNotification.mutate({
      data: {
        title,
        message,
        type: "info",
        targetUserId: isBulk ? undefined : undefined,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Notification sent", description: isBulk ? "All users have been notified." : "Notification sent." });
        setTitle("");
        setMessage("");
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      },
      onError: () => toast({ title: "Error", description: "Could not send notification.", variant: "destructive" }),
    });
  };

  return (
    <OfficerLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Notifications</h1>
        <p className="mt-1 text-muted-foreground">Send announcements and alerts to participants.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send form */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2 text-xl">
              <Send className="w-5 h-5 text-primary" /> Send Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={() => setIsBulk(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${isBulk ? "bg-primary text-white border-primary" : "border-gray-200 text-muted-foreground hover:border-gray-300"}`}
                data-testid="button-bulk-notification"
              >
                All Users
              </button>
              <button
                onClick={() => setIsBulk(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${!isBulk ? "bg-primary text-white border-primary" : "border-gray-200 text-muted-foreground hover:border-gray-300"}`}
                data-testid="button-individual-notification"
              >
                Individual
              </button>
            </div>

            <div>
              <Label>Notification Title</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Important Announcement"
                data-testid="input-notification-title"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                data-testid="input-notification-message"
              />
            </div>
            <Button
              onClick={handleSend}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={sendNotification.isPending}
              data-testid="button-send-notification"
            >
              {sendNotification.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Send Notification</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recent notifications */}
        <div>
          <h2 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-primary" /> Recent Activity
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : !notifications?.length ? (
            <Card className="text-center py-10">
              <CardContent>
                <Bell className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {[...notifications].reverse().slice(0, 15).map(n => (
                <Card key={n.id} data-testid={`card-notification-${n.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm text-gray-900">{n.title}</p>
                      <Badge variant={n.isRead ? "secondary" : "default"} className="text-xs flex-shrink-0">
                        {n.isRead ? "Read" : "Unread"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </OfficerLayout>
  );
}

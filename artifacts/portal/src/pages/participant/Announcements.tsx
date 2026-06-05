import { ParticipantLayout } from "@/components/layout/ParticipantLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListAnnouncements } from "@workspace/api-client-react";
import { Megaphone, Loader2 } from "lucide-react";

export default function Announcements() {
  const { data: announcements, isLoading } = useListAnnouncements();

  return (
    <ParticipantLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-muted-foreground mb-8">Official updates and news from Elizabeth Okwori's Confectionery.</p>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : !announcements?.length ? (
          <Card className="text-center py-16">
            <CardContent>
              <Megaphone className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-muted-foreground font-medium">No announcements yet</p>
              <p className="text-sm text-gray-400 mt-1">Check back here for important updates from the NGO.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {[...announcements].reverse().map(a => (
              <Card key={a.id} data-testid={`card-announcement-${a.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Megaphone className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-lg text-primary">{a.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(a.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{a.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ParticipantLayout>
  );
}

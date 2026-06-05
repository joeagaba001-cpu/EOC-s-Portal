import { useState } from "react";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useListParticipants, getListParticipantsQueryKey } from "@workspace/api-client-react";
import { Search, Users, Phone, Mail, Loader2 } from "lucide-react";

export default function OfficerParticipants() {
  const [search, setSearch] = useState("");
  const params = { search: search || undefined, role: "participant" };
  const { data: participants, isLoading } = useListParticipants(
    params,
    { query: { enabled: true, queryKey: getListParticipantsQueryKey(params) } }
  );

  return (
    <OfficerLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Participants</h1>
        <p className="mt-1 text-muted-foreground">View and manage all registered participants.</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
          data-testid="input-search-participants"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : !participants?.length ? (
        <Card className="text-center py-16">
          <CardContent>
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-muted-foreground font-medium">{search ? "No participants match your search" : "No participants registered yet"}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map(p => (
            <Card key={p.id} data-testid={`card-participant-${p.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {p.fullName?.charAt(0)?.toUpperCase() || "P"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{p.fullName}</h3>
                    <Badge variant="secondary" className="text-xs mt-0.5">{p.sex || "N/A"}</Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </div>
                  {p.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{p.phone}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t text-xs text-gray-400">
                  Registered {new Date(p.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </OfficerLayout>
  );
}

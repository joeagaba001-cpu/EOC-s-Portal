import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Loader2, Search, Heart, Building2, Phone, Mail, RefreshCw, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Sponsorship = {
  id: number;
  fullName: string;
  organization: string | null;
  email: string | null;
  phone: string;
  sponsorshipType: string;
  donationAmount: number | null;
  message: string | null;
  status: string;
  createdAt: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  received: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-red-100 text-red-800 border-red-200",
};

const statusOptions = ["pending", "contacted", "received", "declined"];

export default function OfficerSponsorships() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sponsorships");
      if (!res.ok) throw new Error("Failed to load");
      setSponsorships(await res.json());
    } catch {
      toast({ title: "Error", description: "Could not load sponsorships.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/sponsorships/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setSponsorships(prev => prev.map(s => s.id === id ? updated : s));
      toast({ title: "Status Updated", description: `Sponsorship marked as ${status}.` });
    } catch {
      toast({ title: "Error", description: "Could not update status.", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = sponsorships.filter(s => {
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    const matchSearch = !search ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (s.organization ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (s.email ?? "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = statusOptions.reduce((acc, s) => {
    acc[s] = sponsorships.filter(x => x.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <OfficerLayout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Sponsorship Applications</h1>
          <p className="mt-1 text-muted-foreground">Review and manage partnership & donation enquiries.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold">{sponsorships.length}</div>
            <div className="text-sm text-muted-foreground">Total Applications</div>
          </CardContent>
        </Card>
        {statusOptions.map(s => (
          <Card key={s} className={`cursor-pointer transition-all ${filterStatus === s ? "ring-2 ring-primary" : ""}`} onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}>
            <CardContent className="p-5">
              <div className="text-2xl font-bold mb-1">{counts[s] ?? 0}</div>
              <div className="text-sm text-muted-foreground capitalize">{s}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, organisation or email…"
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Heart className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p>No sponsorship applications found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(s => (
            <Card key={s.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Left accent */}
                  <div className="w-full sm:w-1 bg-secondary shrink-0" />

                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{s.fullName}</h3>
                          {s.organization && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Building2 className="w-3 h-3" /> {s.organization}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {s.phone}
                          </span>
                          {s.email && (
                            <a href={`mailto:${s.email}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {s.email}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusColors[s.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                          {s.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(s.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="bg-secondary/10 text-secondary-foreground text-xs font-medium px-3 py-1 rounded-full border border-secondary/20">
                        {s.sponsorshipType}
                      </span>
                      {s.donationAmount && (
                        <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                          ₦{s.donationAmount.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {s.message && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-4 italic leading-relaxed">&ldquo;{s.message}&rdquo;</p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground mr-1">Update status:</span>
                      {statusOptions.filter(o => o !== s.status).map(opt => (
                        <Button
                          key={opt}
                          variant="outline"
                          size="sm"
                          disabled={updatingId === s.id}
                          onClick={() => updateStatus(s.id, opt)}
                          className="text-xs capitalize h-7"
                        >
                          {updatingId === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : `Mark ${opt}`}
                        </Button>
                      ))}
                      {s.phone && (
                        <a
                          href={`https://wa.me/${s.phone.replace(/[^0-9]/g, "")}?text=Hello ${s.fullName}! Thank you for your interest in supporting the Elizabeth Onyaole Okwori Memorial Foundation.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-green-700 font-medium bg-green-50 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
                        >
                          <span className="font-bold">WA</span> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </OfficerLayout>
  );
}

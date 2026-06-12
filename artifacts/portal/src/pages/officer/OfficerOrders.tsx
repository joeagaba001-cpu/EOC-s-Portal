import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Loader2, Search, UtensilsCrossed, Phone, Mail, MapPin, Calendar, Users, RefreshCw, Filter, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CateringOrder = {
  id: number;
  customerName: string;
  phone: string;
  email: string | null;
  eventType: string;
  eventDate: string | null;
  guestCount: number | null;
  eventAddress: string;
  menuItems: string | null;
  specialRequests: string | null;
  status: string;
  officerNotes: string | null;
  createdAt: string;
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:   { label: "Pending",   color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  contacted: { label: "Contacted", color: "bg-blue-100 text-blue-800 border-blue-200" },
  quoted:    { label: "Quoted",    color: "bg-purple-100 text-purple-800 border-purple-200" },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-800 border-green-200" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 border-red-200" },
};

const allStatuses = Object.keys(statusConfig);

export default function OfficerOrders() {
  const [orders, setOrders] = useState<CateringOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CateringOrder | null>(null);
  const [newStatus, setNewStatus] = useState("contacted");
  const [officerNotes, setOfficerNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to load");
      setOrders(await res.json());
    } catch {
      toast({ title: "Error", description: "Could not load catering orders.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openOrder = (order: CateringOrder) => {
    setSelected(order);
    setNewStatus(order.status === "pending" ? "contacted" : order.status);
    setOfficerNotes(order.officerNotes ?? "");
  };

  const saveUpdate = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${selected.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, officerNotes }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      toast({ title: "Order Updated", description: `Status set to ${newStatus}.` });
      setSelected(null);
    } catch {
      toast({ title: "Error", description: "Could not save update.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch = !search ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.eventType.toLowerCase().includes(search.toLowerCase()) ||
      (o.eventAddress ?? "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = allStatuses.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <OfficerLayout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Catering Orders</h1>
          <p className="mt-1 text-muted-foreground">Manage incoming catering requests from customers.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <Card className="col-span-2 sm:col-span-3 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <UtensilsCrossed className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-xs text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>
        {allStatuses.map(s => (
          <Card
            key={s}
            className={`cursor-pointer transition-all ${filterStatus === s ? "ring-2 ring-primary" : ""}`}
            onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
          >
            <CardContent className="p-4">
              <div className="text-xl font-bold mb-1">{counts[s] ?? 0}</div>
              <div className="text-xs text-muted-foreground capitalize">{statusConfig[s]?.label ?? s}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, event type or address…"
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {allStatuses.map(s => <SelectItem key={s} value={s}>{statusConfig[s]?.label ?? s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <UtensilsCrossed className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p>No catering orders found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const cfg = statusConfig[order.status] ?? statusConfig["pending"];
            let menuParsed: string[] = [];
            try { menuParsed = order.menuItems ? JSON.parse(order.menuItems) : []; } catch { /* empty */ }

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className={`w-full sm:w-1 shrink-0 ${
                      order.status === "completed" ? "bg-emerald-500" :
                      order.status === "confirmed" ? "bg-green-500" :
                      order.status === "quoted" ? "bg-purple-500" :
                      order.status === "contacted" ? "bg-blue-500" :
                      order.status === "cancelled" ? "bg-red-400" : "bg-yellow-400"
                    }`} />
                    <div className="flex-1 p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{order.customerName}</h3>
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{order.phone}</span>
                            {order.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{order.email}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>

                      {/* Event info */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-xl p-3 border">
                          <div className="text-xs text-gray-500 mb-1">Event Type</div>
                          <div className="text-sm font-medium text-gray-900">{order.eventType}</div>
                        </div>
                        {order.eventDate && (
                          <div className="bg-gray-50 rounded-xl p-3 border">
                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" />Date</div>
                            <div className="text-sm font-medium text-gray-900">{new Date(order.eventDate).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</div>
                          </div>
                        )}
                        {order.guestCount && (
                          <div className="bg-gray-50 rounded-xl p-3 border">
                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Users className="w-3 h-3" />Guests</div>
                            <div className="text-sm font-medium text-gray-900">{order.guestCount.toLocaleString()}</div>
                          </div>
                        )}
                        <div className="bg-gray-50 rounded-xl p-3 border col-span-2 sm:col-span-1">
                          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" />Venue</div>
                          <div className="text-xs font-medium text-gray-900 leading-relaxed">{order.eventAddress}</div>
                        </div>
                      </div>

                      {/* Menu items */}
                      {menuParsed.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-2">Requested Menu Items</div>
                          <div className="flex flex-wrap gap-2">
                            {menuParsed.map(item => (
                              <span key={item} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full border border-primary/20">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {order.specialRequests && (
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3 text-xs text-gray-700 italic">
                          <span className="font-semibold text-amber-700 not-italic">Special Request: </span>{order.specialRequests}
                        </div>
                      )}

                      {order.officerNotes && (
                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mb-3 text-xs text-gray-700">
                          <span className="font-semibold text-primary">Officer Notes: </span>{order.officerNotes}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button size="sm" onClick={() => openOrder(order)} className="flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Update Status
                        </Button>
                        <a
                          href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}?text=Hello ${order.customerName}! Regarding your catering order for ${order.eventType}${order.eventDate ? " on " + new Date(order.eventDate).toLocaleDateString("en-NG") : ""}, we would like to confirm the details with you.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-green-700 font-medium bg-green-50 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
                        >
                          <span className="font-bold">WA</span> WhatsApp Customer
                        </a>
                        {order.phone && (
                          <a href={`tel:${order.phone}`} className="text-xs text-primary font-medium bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">
                            Call {order.phone}
                          </a>
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

      {/* Update dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Update Catering Order</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="font-semibold text-gray-900">{selected.customerName}</div>
                <div className="text-sm text-muted-foreground">{selected.eventType}{selected.eventDate ? ` · ${new Date(selected.eventDate).toLocaleDateString("en-NG")}` : ""}</div>
                {selected.guestCount && <div className="text-sm text-muted-foreground">{selected.guestCount} guests · {selected.eventAddress}</div>}
              </div>

              <div className="space-y-2">
                <Label>New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allStatuses.map(s => (
                      <SelectItem key={s} value={s}>{statusConfig[s]?.label ?? s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="officerNotesDialog">Officer Notes</Label>
                <Textarea
                  id="officerNotesDialog"
                  rows={3}
                  placeholder="e.g. Quoted ₦150,000, awaiting confirmation. Or: Menu agreed, deposit paid."
                  value={officerNotes}
                  onChange={e => setOfficerNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={saveUpdate} disabled={submitting}>
              {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : "Save Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OfficerLayout>
  );
}

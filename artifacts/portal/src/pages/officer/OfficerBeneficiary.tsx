import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Loader2, Search, Banknote, CheckCheck, XCircle, Clock, RefreshCw, Filter, Eye, Building2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BeneficiaryRequest = {
  id: number;
  fullName: string;
  participantId: string | null;
  reason: string;
  amountRequested: number;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  supportingDocs: string | null;
  status: string;
  officerNotes: string | null;
  createdAt: string;
  userId: number | null;
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <Clock className="w-3.5 h-3.5" /> },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-800 border-blue-200", icon: <CheckCheck className="w-3.5 h-3.5" /> },
  disbursed: { label: "Disbursed", color: "bg-green-100 text-green-800 border-green-200", icon: <Banknote className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200", icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function OfficerBeneficiary() {
  const [requests, setRequests] = useState<BeneficiaryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [reviewTarget, setReviewTarget] = useState<BeneficiaryRequest | null>(null);
  const [reviewStatus, setReviewStatus] = useState("approved");
  const [officerNotes, setOfficerNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/beneficiary");
      if (!res.ok) throw new Error("Failed to load");
      setRequests(await res.json());
    } catch {
      toast({ title: "Error", description: "Could not load fund requests.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openReview = (req: BeneficiaryRequest) => {
    setReviewTarget(req);
    setReviewStatus("approved");
    setOfficerNotes(req.officerNotes ?? "");
  };

  const submitReview = async () => {
    if (!reviewTarget) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/beneficiary/${reviewTarget.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: reviewStatus, officerNotes }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
      toast({ title: "Decision Recorded", description: `Request has been marked as ${reviewStatus}.` });
      setReviewTarget(null);
    } catch {
      toast({ title: "Error", description: "Could not save decision.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = requests.filter(r => {
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchSearch = !search ||
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (r.participantId ?? "").toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPending = requests.filter(r => r.status === "pending").length;
  const totalApproved = requests.filter(r => r.status === "approved").length;
  const totalDisbursed = requests.filter(r => r.status === "disbursed").length;
  const totalAmount = requests.filter(r => r.status === "approved" || r.status === "disbursed")
    .reduce((sum, r) => sum + r.amountRequested, 0);

  return (
    <OfficerLayout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Beneficiary Fund Requests</h1>
          <p className="mt-1 text-muted-foreground">Review, approve, and track fund disbursement applications.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pending Review", value: totalPending, icon: <Clock className="w-5 h-5 text-yellow-600" />, bg: "bg-yellow-50 border-yellow-200" },
          { label: "Approved", value: totalApproved, icon: <CheckCheck className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50 border-blue-200" },
          { label: "Disbursed", value: totalDisbursed, icon: <Banknote className="w-5 h-5 text-green-600" />, bg: "bg-green-50 border-green-200" },
          { label: "Total Approved (₦)", value: totalAmount.toLocaleString(), icon: <Banknote className="w-5 h-5 text-primary" />, bg: "bg-primary/5 border-primary/20" },
        ].map(card => (
          <Card key={card.label} className={`border ${card.bg.split(" ")[1]}`}>
            <CardContent className={`p-5 ${card.bg.split(" ")[0]} rounded-xl`}>
              <div className="mb-2">{card.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, participant ID or reason…"
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
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Banknote className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p>No fund requests found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => {
            const cfg = statusConfig[req.status] ?? statusConfig.pending;
            return (
              <Card key={req.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className={`w-full sm:w-1 shrink-0 ${req.status === "disbursed" ? "bg-green-500" : req.status === "approved" ? "bg-blue-500" : req.status === "rejected" ? "bg-red-400" : "bg-yellow-400"}`} />
                    <div className="flex-1 p-5">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900">{req.fullName}</h3>
                            {req.participantId && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                                ID: {req.participantId}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(req.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${cfg.color}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                          <span className="text-lg font-bold text-primary">₦{req.amountRequested.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Reason for Request</div>
                        <p className="text-sm text-gray-700 leading-relaxed">{req.reason}</p>
                      </div>

                      {/* Bank details */}
                      {(req.bankName || req.accountNumber) && (
                        <div className="flex flex-wrap gap-3 mb-3">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border">
                            <Building2 className="w-3.5 h-3.5" /> {req.bankName ?? "—"}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border font-mono">
                            {req.accountNumber ?? "—"}
                          </div>
                          {req.accountName && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border">
                              <User className="w-3.5 h-3.5" /> {req.accountName}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Officer notes */}
                      {req.officerNotes && (
                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mb-3 text-xs text-gray-700">
                          <span className="font-semibold text-primary">Officer Notes: </span>{req.officerNotes}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {req.status === "pending" && (
                          <Button size="sm" onClick={() => openReview(req)} className="flex items-center gap-2">
                            <Eye className="w-4 h-4" /> Review Request
                          </Button>
                        )}
                        {req.status === "approved" && (
                          <Button size="sm" variant="outline" onClick={() => openReview(req)} className="text-green-700 border-green-200 hover:bg-green-50 flex items-center gap-2">
                            <Banknote className="w-4 h-4" /> Mark Disbursed
                          </Button>
                        )}
                        {(req.status === "disbursed" || req.status === "rejected") && (
                          <Button size="sm" variant="outline" onClick={() => openReview(req)} className="flex items-center gap-2">
                            <Eye className="w-4 h-4" /> Update Notes
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

      {/* Review Dialog */}
      <Dialog open={!!reviewTarget} onOpenChange={open => !open && setReviewTarget(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Review Fund Request</DialogTitle>
          </DialogHeader>
          {reviewTarget && (
            <div className="space-y-4 py-2">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="font-semibold text-gray-900 mb-1">{reviewTarget.fullName}</div>
                <div className="text-sm text-muted-foreground mb-2">{reviewTarget.reason}</div>
                <div className="text-xl font-bold text-primary">₦{reviewTarget.amountRequested.toLocaleString()}</div>
              </div>

              {reviewTarget.bankName && (
                <div className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-1">
                  <div><span className="font-medium">Bank:</span> {reviewTarget.bankName}</div>
                  <div><span className="font-medium">Account:</span> {reviewTarget.accountNumber}</div>
                  <div><span className="font-medium">Name:</span> {reviewTarget.accountName}</div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Decision</Label>
                <Select value={reviewStatus} onValueChange={setReviewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">✅ Approve Request</SelectItem>
                    <SelectItem value="disbursed">💸 Mark as Disbursed</SelectItem>
                    <SelectItem value="rejected">❌ Reject Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="officerNotes">Officer Notes</Label>
                <Textarea
                  id="officerNotes"
                  rows={3}
                  placeholder="Optional: reason for decision, disbursement reference, etc."
                  value={officerNotes}
                  onChange={e => setOfficerNotes(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">This note will be visible to the applicant if they are a registered participant.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewTarget(null)}>Cancel</Button>
            <Button onClick={submitReview} disabled={submitting}>
              {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : "Save Decision"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OfficerLayout>
  );
}

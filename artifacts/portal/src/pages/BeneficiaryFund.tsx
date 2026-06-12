import { PublicLayout } from "@/components/layout/PublicLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, Clock, CheckCheck, XCircle, Banknote } from "lucide-react";

const statuses = [
  { icon: <Clock className="w-5 h-5 text-yellow-500" />, label: "Pending", desc: "Application submitted and awaiting review" },
  { icon: <CheckCheck className="w-5 h-5 text-blue-500" />, label: "Approved", desc: "Request approved, funds being processed" },
  { icon: <Banknote className="w-5 h-5 text-green-500" />, label: "Disbursed", desc: "Funds have been sent to your account" },
  { icon: <XCircle className="w-5 h-5 text-red-500" />, label: "Rejected", desc: "Could not be approved at this time" },
];

export default function BeneficiaryFund() {
  const [form, setForm] = useState({
    fullName: "", participantId: "", reason: "", amountRequested: "",
    bankName: "", accountNumber: "", accountName: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.reason || !form.amountRequested) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/beneficiary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSuccess(true);
    } catch {
      setError("Failed to submit. Please try again or contact us via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16 mb-12">
          <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-4">Financial Support</p>
          <h1 className="text-5xl font-serif font-bold text-primary leading-tight mb-6">Beneficiary Fund Request</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Apply for financial support from the Foundation. Requests are reviewed by our NGO Officers and disbursed to qualified applicants.
          </p>
        </div>

        {/* Status Guide */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {statuses.map((s) => (
            <div key={s.label} className="text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <div className="font-semibold text-sm text-gray-900 mb-1">{s.label}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-8 mb-8">
          {success ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-bold text-primary mb-3">Application Submitted</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                Your fund disbursement request has been received. Our officers will review it and notify you of the outcome.
              </p>
              <a href="https://wa.me/2348122990636?text=Hello! I just submitted a fund disbursement request." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-colors">
                Follow Up on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary mb-2">Fund Disbursement Application</h2>
                <p className="text-sm text-muted-foreground">Fields marked * are required.</p>
              </div>
              {error && <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="Your full name" value={form.fullName} onChange={e => set("fullName", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participantId">Participant ID</Label>
                  <Input id="participantId" placeholder="Your participant ID (if available)" value={form.participantId} onChange={e => set("participantId", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Request *</Label>
                <Textarea id="reason" rows={4} placeholder="Explain why you need financial support..." value={form.reason} onChange={e => set("reason", e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountRequested">Amount Requested (₦) *</Label>
                <Input id="amountRequested" type="number" placeholder="Amount in Naira" value={form.amountRequested} onChange={e => set("amountRequested", e.target.value)} required />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Bank Details (for disbursement)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" placeholder="e.g. First Bank" value={form.bankName} onChange={e => set("bankName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" placeholder="10-digit account number" value={form.accountNumber} onChange={e => set("accountNumber", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input id="accountName" placeholder="Name on account" value={form.accountName} onChange={e => set("accountName", e.target.value)} />
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Fund Request"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

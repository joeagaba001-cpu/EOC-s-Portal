import { PublicLayout } from "@/components/layout/PublicLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Heart, Users, Award, Globe } from "lucide-react";

const sponsorTypes = ["Individual Donation", "Corporate Sponsorship", "Trust / Foundation Grant", "Charity Association", "In-Kind Donation", "Recurring Giving", "Other"];

const reasons = [
  { icon: <Heart className="w-6 h-6" />, title: "Change Lives", desc: "Your support directly funds free training for the less privileged youth of Nigeria." },
  { icon: <Users className="w-6 h-6" />, title: "Build Community", desc: "Help create a generation of skilled, self-reliant entrepreneurs in Otukpo and beyond." },
  { icon: <Award className="w-6 h-6" />, title: "Leave a Legacy", desc: "Be recognised as a partner in a foundation built to honour a life of compassion and service." },
  { icon: <Globe className="w-6 h-6" />, title: "Global Impact", desc: "We accept support from individuals and organisations in Nigeria and internationally." },
];

export default function Sponsorship() {
  const [form, setForm] = useState({ fullName: "", organization: "", email: "", phone: "", sponsorshipType: "", donationAmount: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.sponsorshipType) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/sponsorships", {
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center py-16 mb-12">
          <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-4">Support Our Mission</p>
          <h1 className="text-5xl font-serif font-bold text-primary leading-tight mb-6">Partnership & Sponsorship</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We accept donations from individuals, trustees, corporate bodies and charitable organisations in Nigeria and elsewhere.
          </p>
        </div>

        {/* Why sponsor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {reasons.map((r) => (
            <div key={r.title} className="text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">{r.icon}</div>
              <h3 className="font-semibold text-primary mb-2">{r.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Receiving statement */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 mb-12">
          <h2 className="font-serif font-bold text-2xl text-primary mb-4">What We Accept</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 leading-relaxed">
            <div className="flex gap-2"><span className="text-secondary font-bold">→</span> Donations from individuals, friends, and trustees</div>
            <div className="flex gap-2"><span className="text-secondary font-bold">→</span> Corporate sponsorships and CSR partnerships</div>
            <div className="flex gap-2"><span className="text-secondary font-bold">→</span> Grants from charitable and philanthropic organisations</div>
            <div className="flex gap-2"><span className="text-secondary font-bold">→</span> Assistance from trusts and associations in Nigeria or elsewhere</div>
            <div className="flex gap-2"><span className="text-secondary font-bold">→</span> In-kind donations of equipment, materials and resources</div>
            <div className="flex gap-2"><span className="text-secondary font-bold">→</span> Recurring giving and long-term partnership programs</div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-8 mb-8">
          {success ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-bold text-primary mb-3">Thank You for Your Generosity!</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                Your sponsorship application has been received. Our team will contact you shortly to discuss next steps.
              </p>
              <a href="https://wa.me/2348122990636?text=Hello! I just submitted a sponsorship application." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-colors">
                Chat on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary mb-2">Sponsorship Application</h2>
                <p className="text-sm text-muted-foreground">Fields marked * are required.</p>
              </div>
              {error && <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="Your full name" value={form.fullName} onChange={e => set("fullName", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organisation</Label>
                  <Input id="organization" placeholder="Company or organisation (optional)" value={form.organization} onChange={e => set("organization", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="+234 800 000 0000" value={form.phone} onChange={e => set("phone", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Sponsorship Type *</Label>
                  <Select onValueChange={v => set("sponsorshipType", v)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {sponsorTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donationAmount">Donation Amount (₦)</Label>
                  <Input id="donationAmount" type="number" placeholder="Amount in Naira (optional)" value={form.donationAmount} onChange={e => set("donationAmount", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message / Additional Information</Label>
                <Textarea id="message" rows={4} placeholder="Tell us about your interest in supporting the foundation..." value={form.message} onChange={e => set("message", e.target.value)} />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Sponsorship Application"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

import { PublicLayout } from "@/components/layout/PublicLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, UtensilsCrossed, Phone, MapPin, Calendar, Users } from "lucide-react";
import { Link } from "wouter";

const eventTypes = [
  "Personal Consumption",
  "Birthday Party",
  "Wedding Reception",
  "Wedding Introduction/Engagement",
  "Corporate Event",
  "Naming Ceremony",
  "Burial / Funeral Reception",
  "Church / Religious Event",
  "Graduation Party",
  "Anniversary Celebration",
  "Other",
];

const menuOptions = [
  { label: "Jollof Rice", emoji: "🍚" },
  { label: "Fried Rice", emoji: "🍳" },
  { label: "White Rice & Stew", emoji: "🍽️" },
  { label: "Beans & Porridge", emoji: "🫘" },
  { label: "Grilled Chicken", emoji: "🍗" },
  { label: "Fried Chicken", emoji: "🍗" },
  { label: "Fish Stew", emoji: "🐟" },
  { label: "Assorted Meat", emoji: "🥩" },
  { label: "Salad", emoji: "🥗" },
  { label: "Puff Puff", emoji: "🟤" },
  { label: "Small Chops", emoji: "🥮" },
  { label: "Chin Chin", emoji: "🍪" },
  { label: "Meat Pie", emoji: "🥧" },
  { label: "Spring Rolls", emoji: "🥢" },
  { label: "Cake (Custom)", emoji: "🎂" },
  { label: "Pastries / Bread", emoji: "🥐" },
  { label: "Moi Moi", emoji: "🫙" },
  { label: "Buns", emoji: "🔶" },
  { label: "Drinks & Beverages", emoji: "🥤" },
  { label: "Pepper Soup", emoji: "🍲" },
];

export default function OrderCatering() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    eventAddress: "",
    specialRequests: "",
  });
  const { toast } = useToast();

  const toggleMenu = (item: string) => {
    setSelectedMenu(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.eventType || !form.eventAddress) {
      toast({ title: "Required Fields Missing", description: "Please fill in your name, phone, event type and venue.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, menuItems: selectedMenu }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      toast({ title: "Submission Failed", description: "Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-4">Order Received!</h1>
          <p className="text-muted-foreground text-lg mb-3">
            Thank you, <strong>{form.customerName}</strong>. We have received your catering order and our team will contact you shortly to confirm details and pricing.
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            You can also reach us directly on WhatsApp for faster response.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/2348122990636?text=Hello! I just submitted a catering order request for ${form.eventType} on ${form.eventDate || "an upcoming date"}. My name is ${form.customerName}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-600 transition-colors"
            >
              Follow Up on WhatsApp
            </a>
            <Link href="/" className="border border-primary text-primary font-semibold px-8 py-3 rounded-full hover:bg-primary/5 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center py-14 mb-10">
          <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-4">Professional Catering Services</p>
          <h1 className="text-5xl font-serif font-bold text-primary leading-tight mb-6">Place a Catering Order</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether it's a small family gathering or a large reception, our trained chefs deliver freshly prepared meals for any occasion in Otukpo and environs.
          </p>
        </div>

        {/* Info strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: <Phone className="w-5 h-5 text-primary" />, label: "Quick Response", desc: "We confirm your order within 24 hours" },
            { icon: <MapPin className="w-5 h-5 text-primary" />, label: "Delivery Available", desc: "Otukpo and surrounding areas" },
            { icon: <UtensilsCrossed className="w-5 h-5 text-primary" />, label: "Freshly Prepared", desc: "Trained chefs, quality ingredients" },
          ].map(card => (
            <div key={card.label} className="flex items-start gap-3 bg-accent/40 rounded-2xl p-4 border border-primary/10">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">{card.icon}</div>
              <div>
                <div className="font-semibold text-sm text-gray-900">{card.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{card.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer details */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-serif font-bold text-primary mb-6 flex items-center gap-2">
              <Users className="w-5 h-5" /> Your Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="customerName"
                  placeholder="e.g. Amaka Okonkwo"
                  value={form.customerName}
                  onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 0803 451 4674"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email Address <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="amaka@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Event details */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-serif font-bold text-primary mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Event Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Type of Event <span className="text-red-500">*</span></Label>
                <Select value={form.eventType} onValueChange={v => setForm(f => ({ ...f, eventType: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type…" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={form.eventDate}
                  onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestCount">Number of Guests</Label>
                <Input
                  id="guestCount"
                  type="number"
                  min="1"
                  placeholder="e.g. 150"
                  value={form.guestCount}
                  onChange={e => setForm(f => ({ ...f, guestCount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventAddress">Event Venue / Delivery Address <span className="text-red-500">*</span></Label>
                <Input
                  id="eventAddress"
                  placeholder="e.g. No. 12, Ogiri Oko Rd, Otukpo"
                  value={form.eventAddress}
                  onChange={e => setForm(f => ({ ...f, eventAddress: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Menu selection */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-serif font-bold text-primary mb-2 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5" /> Select Menu Items
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Choose the items you'd like included. Pricing is discussed after confirmation.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {menuOptions.map(item => {
                const selected = selectedMenu.includes(item.label);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => toggleMenu(item.label)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                      selected
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/40 hover:bg-accent/40"
                    }`}
                  >
                    <span className="text-base shrink-0">{item.emoji}</span>
                    <span className="text-xs leading-tight">{item.label}</span>
                    {selected && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
            {selectedMenu.length > 0 && (
              <div className="mt-4 text-sm text-primary font-medium">
                {selectedMenu.length} item{selectedMenu.length > 1 ? "s" : ""} selected: {selectedMenu.join(", ")}
              </div>
            )}
          </div>

          {/* Special requests */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-serif font-bold text-primary mb-4">Additional Notes</h2>
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Dietary requirements, special instructions, or any other requests</Label>
              <Textarea
                id="specialRequests"
                rows={4}
                placeholder="e.g. No pork, extra vegetarian options, specific serving time…"
                value={form.specialRequests}
                onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))}
              />
            </div>
          </div>

          {/* Notice */}
          <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-5 text-sm text-gray-700">
            <strong className="text-secondary">Please Note:</strong> Submitting this form is not a final booking. Our team will contact you within 24 hours to confirm availability, discuss pricing, and finalise your order. For urgent enquiries, call or WhatsApp us on <strong>0812 299 0636</strong>.
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <Button type="submit" size="lg" disabled={loading} className="rounded-full px-10 font-semibold text-base">
              {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting…</> : "Submit Catering Order"}
            </Button>
            <a
              href="https://wa.me/2348122990636?text=Hello! I'd like to place a catering order."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-600 transition-colors text-sm"
            >
              Order via WhatsApp Instead
            </a>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
}

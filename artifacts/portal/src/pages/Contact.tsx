import { PublicLayout } from "@/components/layout/PublicLayout";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Link } from "wouter";

const contacts = [
  { icon: <Phone className="w-5 h-5" />, label: "Phone Lines", items: ["0803 451 4674", "0913 209 4696", "0810 393 8592"] },
  { icon: <MessageCircle className="w-5 h-5" />, label: "WhatsApp", items: ["0812 299 0636"], whatsapp: "2348122990636" },
  { icon: <Mail className="w-5 h-5" />, label: "Email", items: ["odehonyema97@gmail.com", "odehpaul629@gmail.com"] },
  { icon: <MapPin className="w-5 h-5" />, label: "Address", items: ["No. 25, David Stone Street, Otukpo, Nigeria"] },
];

export default function Contact() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16 mb-12">
          <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-4">Get In Touch</p>
          <h1 className="text-5xl font-serif font-bold text-primary leading-tight mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We'd love to hear from you. Reach out for enquiries about training programs, sponsorship, or general support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {contacts.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">{c.icon}</div>
              <h3 className="font-serif font-semibold text-lg text-primary mb-3">{c.label}</h3>
              <div className="space-y-2">
                {c.items.map((item) => (
                  <div key={item}>
                    {c.whatsapp ? (
                      <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer"
                        className="text-green-600 font-semibold hover:underline flex items-center gap-2">
                        <span className="text-xs bg-green-100 px-2 py-0.5 rounded">WhatsApp</span> {item}
                      </a>
                    ) : c.label === "Email" ? (
                      <a href={`mailto:${item}`} className="text-primary hover:underline text-sm">{item}</a>
                    ) : c.label === "Phone Lines" ? (
                      <a href={`tel:${item.replace(/\s/g, "")}`} className="text-sm text-gray-700 hover:text-primary transition-colors block">{item}</a>
                    ) : (
                      <p className="text-sm text-gray-700">{item}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Hours */}
        <div className="bg-accent/40 rounded-2xl border border-secondary/20 p-8 mb-12 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-xl text-primary mb-2">Office Hours</h3>
            <p className="text-muted-foreground text-sm">Monday – Friday: 8:00 AM – 5:00 PM (WAT)</p>
            <p className="text-muted-foreground text-sm">Saturday: 9:00 AM – 2:00 PM | Sunday: Closed</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <a href="https://wa.me/2348122990636?text=Hello! I'm interested in your free training programs." target="_blank" rel="noopener noreferrer"
            className="bg-green-600 text-white rounded-xl p-5 text-center hover:bg-green-700 transition-colors">
            <MessageCircle className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold text-sm">Chat on WhatsApp</div>
            <div className="text-xs text-green-100 mt-1">Fastest response</div>
          </a>
          <Link href="/sponsorship" className="bg-secondary text-secondary-foreground rounded-xl p-5 text-center hover:bg-secondary/90 transition-colors">
            <span className="text-2xl block mb-2">🤝</span>
            <div className="font-semibold text-sm">Become a Sponsor</div>
            <div className="text-xs opacity-70 mt-1">Support our mission</div>
          </Link>
          <Link href="/sign-up" className="bg-primary text-white rounded-xl p-5 text-center hover:bg-primary/90 transition-colors">
            <GraduationCapIcon />
            <div className="font-semibold text-sm">Apply for Training</div>
            <div className="text-xs text-primary-foreground/70 mt-1">100% free</div>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

function GraduationCapIcon() {
  return <div className="text-2xl text-center mb-2">🎓</div>;
}

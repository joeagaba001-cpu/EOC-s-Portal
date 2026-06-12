import { Link } from "wouter";
import { ChevronRight, Heart, Users, GraduationCap, Award, Phone, Mail, MapPin } from "lucide-react";

const stats = [
  { value: "500+", label: "Lives Transformed" },
  { value: "14+", label: "Training Courses" },
  { value: "100%", label: "Free Training" },
  { value: "5+", label: "Years of Service" },
];

const programs = [
  { icon: "🍞", title: "Baking & Bread Making", desc: "Master artisan bread, rolls and traditional baking techniques." },
  { icon: "🎂", title: "Cake Decoration", desc: "Learn professional cake design, fondant work and sugar artistry." },
  { icon: "🥘", title: "Event Catering", desc: "Full-service event food preparation, buffet and portion management." },
  { icon: "🥐", title: "Pastry Making", desc: "Classic and modern pastry creation including croissants and tarts." },
  { icon: "📦", title: "Food Packaging", desc: "Hygienic packaging, labelling and food safety for small businesses." },
  { icon: "🧁", title: "Dessert Production", desc: "Cold and warm desserts including ice cream, puddings and parfaits." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navbar */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between px-6 py-4 lg:px-12" aria-label="Global">
          <Link href="/" className="flex items-center gap-3">
            <img className="h-10 w-auto" src={`${import.meta.env.BASE_URL}logo.svg`} alt="EEOMF" />
            <span className="font-serif font-semibold text-primary text-base hidden md:block leading-tight max-w-xs">
              Elizabeth Onyaole Okwori Memorial Foundation
            </span>
          </Link>
          <div className="flex items-center gap-x-5">
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block">About</Link>
            <Link href="/programs" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block">Programs</Link>
            <Link href="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block">Contact</Link>
            <Link href="/sign-in" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Log in</Link>
            <Link href="/sign-up" className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">Register Free</Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative isolate pt-24 bg-gradient-to-br from-accent/60 via-accent/30 to-background pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-10" style={{ backgroundImage: "radial-gradient(#0F5132 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-12 lg:px-8 lg:py-40">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
              <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-secondary/30">
                <Heart className="w-3 h-3" /> Free Vocational Training for All
              </div>
              <h1 className="text-5xl font-serif font-bold tracking-tight text-primary sm:text-6xl lg:text-7xl leading-tight">
                Empowering Lives Through Culinary Skills
              </h1>
              <p className="mt-6 text-lg font-medium text-muted-foreground sm:text-xl leading-relaxed">
                The Elizabeth Onyaole Okwori Memorial Foundation offers free professional catering and bakery training to the less privileged and youth of Nigeria — transforming passion into livelihood.
              </p>
              <div className="mt-10 flex items-center gap-x-6 flex-wrap gap-y-3">
                <Link href="/sign-up" className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
                  Apply for Free Training <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/programs" className="text-sm/6 font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
                  View Programs <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-3xl font-serif font-bold text-primary">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-16 sm:mt-24 lg:mt-0 lg:shrink-0 lg:flex-grow">
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden shadow-2xl relative border border-primary/10">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <div className="text-7xl mb-4">🎂</div>
                  <div className="font-serif font-bold text-primary text-xl">Free Catering Training</div>
                  <div className="text-muted-foreground text-sm mt-2">Otukpo, Nigeria</div>
                  <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
                    {["🍞","🥐","🧁","🍰","🥘","📦"].map((e, i) => (
                      <div key={i} className="bg-white/60 rounded-xl p-3 text-2xl text-center shadow-sm">{e}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-3">What We Offer</p>
              <h2 className="text-4xl font-serif font-bold text-primary">Our Training Programs</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">All programs are completely free of charge for qualified participants.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((p) => (
                <div key={p.title} className="bg-accent/30 rounded-2xl p-6 border border-accent hover:shadow-md hover:border-primary/20 transition-all group">
                  <div className="text-4xl mb-4">{p.icon}</div>
                  <h3 className="font-serif font-semibold text-lg text-primary mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/programs" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">
                See All Programs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* How to Apply */}
        <section className="py-24 bg-accent/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-3">Enrolment is Free & Easy</p>
              <h2 className="text-4xl font-serif font-bold text-primary">How to Apply for Training</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Join hundreds of Nigerians gaining professional catering skills — at no cost. Follow these three simple steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
              {[
                {
                  step: "01",
                  icon: "📝",
                  title: "Create Your Account",
                  desc: "Click \"Apply for Free Training\" and fill in your name, email address, and create a password. It takes less than 2 minutes.",
                },
                {
                  step: "02",
                  icon: "👤",
                  title: "Complete Your Profile",
                  desc: "Enter your full name and phone number so our team can reach you with training schedules and venue details.",
                },
                {
                  step: "03",
                  icon: "🎓",
                  title: "Choose Your Skills",
                  desc: "Pick one or more catering programs you want to learn — baking, cake decoration, event catering, and more. Your place is confirmed instantly.",
                },
              ].map((item) => (
                <div key={item.step} className="relative bg-white rounded-3xl p-8 shadow-sm border border-primary/10 text-center group hover:shadow-md hover:border-primary/30 transition-all">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 bg-secondary text-secondary-foreground font-serif font-bold text-sm rounded-full flex items-center justify-center shadow-md">
                    {item.step}
                  </div>
                  <div className="text-5xl mb-5 mt-2">{item.icon}</div>
                  <h3 className="font-serif font-bold text-xl text-primary mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/sign-up" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-bold px-10 py-4 rounded-full text-lg hover:bg-secondary/90 transition-all shadow-md hover:shadow-lg">
                ✦ Apply for Free Training Now <ChevronRight className="w-5 h-5" />
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">No fees. No forms. Enrolment confirmed in minutes.</p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-24 bg-primary text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-4">Our Mission</p>
                <h2 className="text-4xl font-serif font-bold mb-6 leading-tight">Built on a Legacy of Compassion</h2>
                <div className="space-y-4 text-primary-foreground/80 leading-relaxed">
                  <p>To offer free vocational training to the less privileged and needy — unleashing the creative, learning, leadership, and entrepreneurial potential of our youth.</p>
                  <p>We work towards a strong and sustainable future, enhancing quality, well-rounded, and wholesome education encompassing cognitive, emotional, and Godly values.</p>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-secondary shrink-0" />
                  <span className="text-sm text-primary-foreground/70">No. 25, David Stone Street, Otukpo, Nigeria</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { icon: <GraduationCap className="w-6 h-6" />, title: "Free Education", desc: "All training programs are provided at zero cost to participants." },
                  { icon: <Users className="w-6 h-6" />, title: "Community Focus", desc: "Targeting the less privileged youth and women of Nigeria." },
                  { icon: <Award className="w-6 h-6" />, title: "Certified Skills", desc: "Participants receive certificates upon program completion." },
                  { icon: <Heart className="w-6 h-6" />, title: "Foundation Values", desc: "Built on faith, integrity, empowerment and community service." },
                ].map((item) => (
                  <div key={item.title} className="bg-white/10 rounded-2xl p-5 border border-white/10">
                    <div className="text-secondary mb-3">{item.icon}</div>
                    <div className="font-semibold text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-primary-foreground/60 leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Partnership CTA */}
        <section className="py-20 bg-accent/40">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-4">Support Our Work</p>
            <h2 className="text-4xl font-serif font-bold text-primary mb-6">Partner With Us</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              We accept donations, grants, and partnerships from individuals, corporate bodies, associations, and charitable organisations in Nigeria and beyond.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/sponsorship" className="bg-secondary text-secondary-foreground font-semibold px-8 py-3.5 rounded-full hover:bg-secondary/90 transition-colors">
                Become a Sponsor
              </Link>
              <Link href="/contact" className="bg-white text-primary font-semibold px-8 py-3.5 rounded-full border border-primary/20 hover:shadow-md transition-all flex items-center gap-2">
                <Phone className="w-4 h-4" /> Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Contact strip */}
        <section className="py-8 bg-primary/5 border-t border-primary/10">
          <div className="mx-auto max-w-7xl px-6 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <a href="tel:08034514674" className="flex items-center gap-2 hover:text-primary transition-colors"><Phone className="w-4 h-4 text-primary" /> 0803 451 4674</a>
            <a href="https://wa.me/2348122990636" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors"><span className="text-green-600 font-bold text-xs">WA</span> 0812 299 0636</a>
            <a href="mailto:odehonyema97@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors"><Mail className="w-4 h-4 text-primary" /> odehonyema97@gmail.com</a>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> No. 25, David Stone St, Otukpo</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground/70 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img className="h-8 w-auto brightness-0 invert" src={`${import.meta.env.BASE_URL}logo.svg`} alt="EEOMF" />
                <span className="font-serif font-semibold text-white text-sm">EEOMF</span>
              </div>
              <p className="text-sm leading-relaxed">Elizabeth Onyaole Okwori Memorial Foundation — empowering lives through free vocational training.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <div><Link href="/sign-up" className="text-secondary font-semibold hover:text-secondary/80 transition-colors">✦ Apply for Free Training</Link></div>
                <div><Link href="/about" className="hover:text-white transition-colors">About Us</Link></div>
                <div><Link href="/programs" className="hover:text-white transition-colors">Training Programs</Link></div>
                <div><Link href="/sponsorship" className="hover:text-white transition-colors">Sponsorship</Link></div>
                <div><Link href="/beneficiary" className="hover:text-white transition-colors">Fund Requests</Link></div>
                <div><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <p>No. 25, David Stone Street, Otukpo, Nigeria</p>
                <p>0803 451 4674 | 0913 209 4696</p>
                <p>WhatsApp: 0812 299 0636</p>
                <p>odehonyema97@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-xs">
            © {new Date().getFullYear()} Elizabeth Onyaole Okwori Memorial Foundation. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

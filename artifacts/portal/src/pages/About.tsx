import { PublicLayout } from "@/components/layout/PublicLayout";
import { Link } from "wouter";
import { MapPin, Phone, Mail, Heart, Users, GraduationCap, Award } from "lucide-react";

const aims = [
  "To offer free vocational training to the less privileged and needy.",
  "Unleashing the creative, learning, leadership, and entrepreneurial potential of our youth.",
  "Working towards a strong and sustainable future.",
  "Enhancing quality, well-rounded, and wholesome education encompassing cognitive, emotional, and Godly values.",
];

const values = [
  { icon: <Heart className="w-5 h-5" />, title: "Compassion", description: "We serve with love, placing the needs of the less privileged at the heart of everything we do." },
  { icon: <GraduationCap className="w-5 h-5" />, title: "Free Education", description: "All our training programs are provided completely free of charge to qualified participants." },
  { icon: <Users className="w-5 h-5" />, title: "Community", description: "Our graduates form a network of entrepreneurs who support and inspire one another." },
  { icon: <Award className="w-5 h-5" />, title: "Excellence", description: "Every program meets the highest standards, ensuring participants receive world-class vocational education." },
];

export default function About() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center py-16 mb-12">
          <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-4">Who We Are</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight mb-6">
            Elizabeth Onyaole Okwori Memorial Foundation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A non-governmental organisation dedicated to transforming lives through free professional culinary and catering education in Nigeria.
          </p>
        </div>

        {/* Address + Contact */}
        <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 mb-12 flex flex-wrap gap-6 items-start justify-around">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-sm text-primary">Address</div>
              <div className="text-sm text-muted-foreground">No. 25, David Stone Street, Otukpo, Nigeria</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-sm text-primary">Phone</div>
              <div className="text-sm text-muted-foreground">0803 451 4674 | 0913 209 4696 | 0810 393 8592</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-sm text-primary">Email</div>
              <div className="text-sm text-muted-foreground">odehonyema97@gmail.com</div>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
          <div>
            <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-3">Our Mission</p>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-5">Built on a Legacy of Compassion</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Elizabeth Onyaole Okwori Memorial Foundation was established in honour of a woman whose life embodied compassion, service, and the belief that every individual deserves the opportunity to thrive.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our programs are designed to equip participants — primarily women, young adults, and the less privileged — with practical, market-ready catering skills that translate directly into income and entrepreneurship.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Since our founding, we have trained hundreds of participants across multiple catering disciplines, many of whom have gone on to establish their own businesses and create employment in their communities.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/10">
            <div className="text-center">
              <div className="text-6xl font-serif font-bold text-primary mb-1">500+</div>
              <div className="text-muted-foreground text-sm mb-6">Lives Transformed</div>
              <div className="text-5xl font-serif font-bold text-secondary mb-1">14+</div>
              <div className="text-muted-foreground text-sm mb-6">Training Programs</div>
              <div className="text-4xl font-serif font-bold text-primary mb-1">100%</div>
              <div className="text-muted-foreground text-sm">Free of Charge</div>
            </div>
          </div>
        </div>

        {/* Aims & Objectives */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-3">What We Stand For</p>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Aims & Objectives</h2>
          </div>
          <div className="space-y-4">
            {aims.map((aim, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">{i + 1}</div>
                <p className="text-gray-700 leading-relaxed">{aim}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-3">Our Values</p>
            <h2 className="text-3xl font-serif font-bold text-gray-900">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">{v.icon}</div>
                <h3 className="font-serif font-semibold text-xl text-primary mb-3">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-3xl p-10 text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-primary-foreground/80 mb-8 text-lg max-w-xl mx-auto">
            Join hundreds of graduates who have built thriving catering careers through our free programs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/programs" className="bg-secondary text-secondary-foreground font-semibold px-8 py-3 rounded-full hover:bg-secondary/90 transition-colors">
              View Programs
            </Link>
            <Link href="/sign-up" className="bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-colors">
              Register Free
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

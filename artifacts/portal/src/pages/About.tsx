import { ParticipantLayout } from "@/components/layout/ParticipantLayout";
import { Link } from "wouter";

const values = [
  {
    title: "Excellence in Training",
    description: "We hold every facilitator and program to the highest standards, ensuring participants receive world-class vocational education."
  },
  {
    title: "Empowerment",
    description: "Beyond skills, we invest in the confidence and agency of every participant — especially women building their futures in catering."
  },
  {
    title: "Community",
    description: "Our participants form a network of entrepreneurs who support, collaborate, and inspire one another long after training ends."
  },
  {
    title: "Integrity",
    description: "We operate transparently, treating every naira donated or spent as a sacred trust from the communities we serve."
  },
];

export default function About() {
  return (
    <ParticipantLayout>
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center py-16 mb-12">
          <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-4">Who We Are</p>
          <h1 className="text-5xl font-serif font-bold text-primary leading-tight mb-6">
            About Elizabeth Okwori's Confectionery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A non-governmental organisation dedicated to transforming lives through professional culinary and catering education in Nigeria.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-3">Our Mission</p>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-5">Turning Passion into Livelihood</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded with the belief that every individual deserves access to quality vocational training, Elizabeth Okwori's Confectionery was established to bridge the gap between aspiration and opportunity.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our programs are designed to equip participants — primarily women and young adults — with practical, market-ready catering skills that translate directly into income and entrepreneurship.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Since our founding, we have trained hundreds of participants across multiple catering disciplines, many of whom have gone on to establish their own businesses and create employment in their communities.
            </p>
          </div>
          <div className="bg-primary/10 rounded-2xl aspect-[4/3] flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-6xl font-serif font-bold text-primary mb-2">500+</div>
              <div className="text-lg text-muted-foreground">Lives Transformed</div>
              <div className="mt-6 text-4xl font-serif font-bold text-secondary">12+</div>
              <div className="text-lg text-muted-foreground">Training Programs</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-3">Our Values</p>
            <h2 className="text-3xl font-serif font-bold text-gray-900">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-8 h-1 bg-secondary rounded-full mb-4" />
                <h3 className="font-serif font-semibold text-xl text-primary mb-3">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-primary-foreground/80 mb-8 text-lg max-w-xl mx-auto">
            Join hundreds of graduates who have built thriving catering careers through our programs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/programs">
              <a className="bg-secondary text-secondary-foreground font-semibold px-8 py-3 rounded-full hover:bg-secondary/90 transition-colors">
                View Programs
              </a>
            </Link>
            <Link href="/sign-up">
              <a className="bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-colors">
                Register Now
              </a>
            </Link>
          </div>
        </div>
      </div>
    </ParticipantLayout>
  );
}

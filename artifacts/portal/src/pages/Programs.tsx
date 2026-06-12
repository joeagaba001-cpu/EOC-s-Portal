import { PublicLayout } from "@/components/layout/PublicLayout";
import { useListSkills } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Loader2, BookOpen, CheckCircle2 } from "lucide-react";

const programImages: Record<string, string> = {
  "Baking & Pastry": "🥐",
  "Main Courses": "🍳",
  "Beverages": "☕",
  "Packaging": "📦",
  "Event Catering": "🍽️",
  "Confectionery": "🍬",
};

const outcomes = [
  "Industry-ready practical skills",
  "Official Foundation certificate",
  "Hands-on training with real equipment",
  "Entrepreneurship and business guidance",
  "Networking with fellow graduates",
  "100% free — no hidden fees",
];

export default function Programs() {
  const { data: skills, isLoading } = useListSkills();

  const grouped = skills?.reduce((acc: Record<string, any[]>, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {}) || {};

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center py-14 mb-10">
          <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-4">100% Free Training</p>
          <h1 className="text-5xl font-serif font-bold text-primary leading-tight mb-6">Our Training Programs</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professionally structured catering courses designed for real-world application and career development — completely free for all participants.
          </p>
        </div>

        {/* Learning outcomes */}
        <div className="bg-primary/5 rounded-2xl border border-primary/10 p-8 mb-14">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-primary">What You Will Gain</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {outcomes.map((o) => (
              <div key={o} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-sm text-gray-700">{o}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills by category */}
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : !skills?.length ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Programs will be listed here once added by the NGO.</p>
          </div>
        ) : (
          <div className="mb-16 space-y-12">
            {Object.entries(grouped).map(([category, catSkills]) => (
              <div key={category}>
                {/* Category header with banner */}
                <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/10">
                  <div className="px-8 py-6 flex items-center gap-5">
                    <div className="text-5xl">{programImages[category] || "🍴"}</div>
                    <div>
                      <h2 className="font-serif font-bold text-2xl text-primary">{category}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{catSkills.length} course{catSkills.length > 1 ? "s" : ""} available</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catSkills.map((skill: any) => (
                    <div
                      key={skill.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition-all group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors text-xl">
                        {programImages[category] || "🍴"}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">{skill.name}</h3>
                      {skill.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>
                      )}
                      <div className="mt-4 pt-4 border-t border-gray-50">
                        <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">Free Enrollment</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="bg-primary rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Apply for Free Training Today</h2>
          <p className="text-primary-foreground/80 mb-8 text-lg max-w-xl mx-auto">
            Registration is open. All programs are provided at zero cost to qualified participants.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/sign-up" className="bg-secondary text-secondary-foreground font-semibold px-8 py-3.5 rounded-full hover:bg-secondary/90 transition-colors">
              Register Free Now
            </Link>
            <a href="https://wa.me/2348122990636?text=Hello! I'm interested in your free training programs." target="_blank" rel="noopener noreferrer"
              className="bg-green-500 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-green-600 transition-colors">
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

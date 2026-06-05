import { ParticipantLayout } from "@/components/layout/ParticipantLayout";
import { useListSkills, useListPackages } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Loader2, BookOpen } from "lucide-react";

export default function Programs() {
  const { data: skills, isLoading: loadingSkills } = useListSkills();
  const { data: packages, isLoading: loadingPackages } = useListPackages();

  const grouped = skills?.reduce((acc: Record<string, any[]>, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {}) || {};

  return (
    <ParticipantLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center py-14 mb-10">
          <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-4">Catering Excellence</p>
          <h1 className="text-5xl font-serif font-bold text-primary leading-tight mb-6">Our Training Programs</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professionally structured catering skill courses designed for real-world application and career development.
          </p>
        </div>

        {/* Skills by category */}
        {loadingSkills ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : !skills?.length ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Skills will be listed here once added by the NGO.</p>
          </div>
        ) : (
          <div className="mb-16 space-y-10">
            {Object.entries(grouped).map(([category, catSkills]) => (
              <div key={category}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-gray-200" />
                  <h2 className="font-serif font-bold text-2xl text-primary whitespace-nowrap">{category}</h2>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catSkills.map((skill: any) => (
                    <div
                      key={skill.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition-all group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{skill.name}</h3>
                      {skill.description && (
                        <p className="text-sm text-muted-foreground">{skill.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pricing packages */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-secondary font-semibold uppercase tracking-widest text-xs mb-3">Enrollment</p>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Choose Your Package</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Select the package that fits your learning goals and budget. All packages include hands-on training and certification.
            </p>
          </div>

          {loadingPackages ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : !packages?.length ? (
            <p className="text-center text-muted-foreground">Packages will be available soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg: any, i: number) => {
                const isHighlighted = i === Math.floor(packages.length / 2);
                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-3xl p-8 ${isHighlighted ? "bg-primary text-white shadow-2xl scale-105" : "bg-white border border-gray-200 shadow-sm hover:shadow-md"} transition-all`}
                  >
                    {isHighlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
                        Most Popular
                      </div>
                    )}
                    <div className={`text-4xl font-bold mb-2 ${isHighlighted ? "text-white" : "text-primary"}`}>
                      ₦{pkg.price.toLocaleString()}
                    </div>
                    <h3 className={`font-serif text-xl font-semibold mb-2 ${isHighlighted ? "text-white" : "text-gray-900"}`}>{pkg.name}</h3>
                    {pkg.description && (
                      <p className={`text-sm mb-4 ${isHighlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{pkg.description}</p>
                    )}
                    <div className={`inline-flex text-xs font-medium px-3 py-1.5 rounded-full mb-6 ${isHighlighted ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                      Duration: {pkg.duration}
                    </div>
                    <div>
                      <Link href="/sign-up">
                        <a className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${isHighlighted ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "bg-primary text-white hover:bg-primary/90"}`}>
                          Enroll Now
                        </a>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-accent rounded-3xl p-10 text-center border border-secondary/20">
          <h2 className="text-2xl font-serif font-bold text-primary mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-6">Register today and take the first step toward a thriving catering career.</p>
          <Link href="/sign-up">
            <a className="inline-flex bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">
              Register for Enrollment
            </a>
          </Link>
        </div>
      </div>
    </ParticipantLayout>
  );
}

import { ParticipantLayout } from "@/components/layout/ParticipantLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useListSkills, useCreateEnrollment } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, MessageCircle } from "lucide-react";

export default function Skills() {
  const { data: skills, isLoading } = useListSkills();
  const createEnrollment = useCreateEnrollment();
  const { toast } = useToast();

  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);

  const grouped = skills?.reduce((acc: Record<string, any[]>, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {}) || {};

  const toggleSkill = (id: number) => {
    setSelectedSkills(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleEnroll = () => {
    if (selectedSkills.length === 0) {
      toast({ title: "Select Skills", description: "Please select at least one skill to continue." });
      return;
    }

    createEnrollment.mutate({
      data: { skillIds: selectedSkills } as any
    }, {
      onSuccess: () => {
        setEnrollmentComplete(true);
        toast({ title: "Application Successful!", description: "You have been enrolled in your selected training programs." });
      },
      onError: (err) => {
        toast({ title: "Enrollment Failed", description: err.message, variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return <ParticipantLayout><div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></ParticipantLayout>;
  }

  if (enrollmentComplete) {
    return (
      <ParticipantLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="text-center py-16">
            <CardHeader>
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl text-primary font-serif">Application Successful!</CardTitle>
              <CardDescription className="text-lg mt-4 leading-relaxed">
                You have successfully applied for this free training program. You selected <strong>{selectedSkills.length}</strong> skill{selectedSkills.length > 1 ? "s" : ""}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-8 text-muted-foreground">
                The NGO will review your application and contact you with further details about your training schedule and orientation date.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <a
                    href="https://wa.me/2348122990636?text=Hello! I just applied for free training on the EEOMF portal. Please confirm my enrollment."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Follow Up on WhatsApp
                  </a>
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ParticipantLayout>
    );
  }

  return (
    <ParticipantLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Apply for Free Training</h1>
          <p className="text-muted-foreground">Select the catering skills you wish to learn. All programs are completely free of charge.</p>
        </div>

        {/* Info banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-800">
            <strong>100% Free:</strong> All training programs are provided at no cost. Simply select your skills and submit your application.
          </p>
        </div>

        {/* Skills grouped by category */}
        {Object.entries(grouped).map(([category, catSkills]) => (
          <Card key={category} className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-serif text-primary">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {catSkills.map((skill: any) => (
                  <div
                    key={skill.id}
                    className={`flex items-start space-x-3 p-4 border rounded-xl hover:bg-gray-50 transition-all cursor-pointer ${selectedSkills.includes(skill.id) ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-gray-200"}`}
                    onClick={() => toggleSkill(skill.id)}
                  >
                    <Checkbox
                      id={`skill-${skill.id}`}
                      checked={selectedSkills.includes(skill.id)}
                      onCheckedChange={() => toggleSkill(skill.id)}
                      className="mt-0.5"
                    />
                    <div className="grid gap-1 leading-none">
                      <label htmlFor={`skill-${skill.id}`} className="text-sm font-semibold leading-none cursor-pointer">
                        {skill.name}
                      </label>
                      {skill.description && (
                        <p className="text-xs text-muted-foreground mt-1">{skill.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Submit bar */}
        <div className="sticky bottom-4 mt-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900">
                {selectedSkills.length > 0 ? `${selectedSkills.length} skill${selectedSkills.length > 1 ? "s" : ""} selected` : "No skills selected yet"}
              </p>
              <p className="text-xs text-muted-foreground">Free enrollment — no payment required</p>
            </div>
            <Button
              onClick={handleEnroll}
              disabled={selectedSkills.length === 0 || createEnrollment.isPending}
              size="lg"
            >
              {createEnrollment.isPending
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                : "Submit Application"}
            </Button>
          </div>
        </div>
      </div>
    </ParticipantLayout>
  );
}

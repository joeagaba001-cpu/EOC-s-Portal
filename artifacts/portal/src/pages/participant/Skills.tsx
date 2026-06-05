import { ParticipantLayout } from "@/components/layout/ParticipantLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useListSkills, useListPackages, useCreateEnrollment, useGetSettings } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Skills() {
  const { data: skills, isLoading: loadingSkills } = useListSkills();
  const { data: packages, isLoading: loadingPackages } = useListPackages();
  const { data: settings } = useGetSettings();
  const createEnrollment = useCreateEnrollment();
  const { toast } = useToast();

  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);

  const toggleSkill = (id: number) => {
    setSelectedSkills(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedSkills.length === 0) {
      toast({ title: "Select Skills", description: "Please select at least one skill to continue." });
      return;
    }
    setShowPackageModal(true);
  };

  const handleEnroll = () => {
    if (!selectedPackage) return;
    
    createEnrollment.mutate({
      data: {
        skillIds: selectedSkills,
        packageId: selectedPackage
      }
    }, {
      onSuccess: () => {
        setEnrollmentComplete(true);
        setShowPackageModal(false);
      },
      onError: (err) => {
        toast({ title: "Enrollment Failed", description: err.message, variant: "destructive" });
      }
    });
  };

  if (loadingSkills || loadingPackages) {
    return <ParticipantLayout><div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></ParticipantLayout>;
  }

  const selectedPackageDetails = packages?.find(p => p.id === selectedPackage);

  return (
    <ParticipantLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Catering Skills</h1>
        
        {enrollmentComplete ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle className="text-2xl text-primary font-serif">Enrollment Successful!</CardTitle>
              <CardDescription className="text-lg mt-4">
                You have selected {selectedSkills.length} skill(s) with the {selectedPackageDetails?.name} package.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-8 text-muted-foreground">To complete your registration, please make payment and contact the NGO via WhatsApp.</p>
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <a 
                  href={`https://wa.me/${settings?.whatsappNumber?.replace(/[^0-9]/g, '')}?text=Hello! I just enrolled in the ${selectedPackageDetails?.name} package for ${selectedSkills.length} skills on the portal.`}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Message on WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Select Your Interests</CardTitle>
                <CardDescription>Choose the catering skills you wish to learn.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills?.map((skill) => (
                    <div key={skill.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox 
                        id={`skill-${skill.id}`} 
                        checked={selectedSkills.includes(skill.id)}
                        onCheckedChange={() => toggleSkill(skill.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label htmlFor={`skill-${skill.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                          {skill.name}
                        </label>
                        <p className="text-sm text-muted-foreground">{skill.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleContinue} disabled={selectedSkills.length === 0}>
                    Continue to Packages ({selectedSkills.length} selected)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Dialog open={showPackageModal} onOpenChange={setShowPackageModal}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl">Select an Enrollment Package</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {packages?.map((pkg) => (
                    <div 
                      key={pkg.id} 
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedPackage === pkg.id ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'hover:border-gray-300'}`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold">{pkg.name}</h4>
                        <span className="font-semibold text-primary">₦{pkg.price.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                      <div className="text-xs mt-2 bg-gray-100 inline-block px-2 py-1 rounded">Duration: {pkg.duration}</div>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPackageModal(false)}>Cancel</Button>
                  <Button onClick={handleEnroll} disabled={!selectedPackage || createEnrollment.isPending}>
                    {createEnrollment.isPending ? "Confirming..." : "Confirm Enrollment"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </ParticipantLayout>
  );
}

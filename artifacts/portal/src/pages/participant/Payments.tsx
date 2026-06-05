import { useState, useRef } from "react";
import { ParticipantLayout } from "@/components/layout/ParticipantLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useListPayments,
  useSubmitPayment,
  useListEnrollments,
  getListPaymentsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle, XCircle, Clock, FileText, Loader2 } from "lucide-react";

const statusConfig: Record<string, { label: string; color: "default" | "secondary" | "destructive"; icon: typeof Clock }> = {
  pending: { label: "Pending Review", color: "secondary", icon: Clock },
  confirmed: { label: "Confirmed", color: "default", icon: CheckCircle },
  rejected: { label: "Rejected", color: "destructive", icon: XCircle },
};

export default function Payments() {
  const { data: payments, isLoading: loadingPayments } = useListPayments();
  const { data: enrollments } = useListEnrollments();
  const submitPayment = useSubmitPayment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pendingEnrollments = enrollments?.filter(e =>
    e.status === "pending" || e.status === "whatsapp_contacted"
  ) || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile || !selectedEnrollmentId) {
      toast({ title: "Incomplete", description: "Please select an enrollment and upload a payment proof.", variant: "destructive" });
      return;
    }

    // Convert file to data URL for storage (in production, upload to cloud storage)
    const reader = new FileReader();
    reader.onload = (ev) => {
      const proofUrl = ev.target?.result as string;
      submitPayment.mutate({
        data: {
          enrollmentId: selectedEnrollmentId,
          proofUrl,
          fileName: selectedFile.name,
        }
      }, {
        onSuccess: () => {
          toast({ title: "Payment proof submitted", description: "Your payment is now under review." });
          queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey() });
          setSelectedFile(null);
          setSelectedEnrollmentId(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        onError: () => {
          toast({ title: "Submission failed", description: "Could not submit payment proof. Try again.", variant: "destructive" });
        }
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <ParticipantLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Payment Upload</h1>
        <p className="text-muted-foreground mb-8">Submit your proof of payment after completing the WhatsApp payment process.</p>

        {/* Upload form */}
        {pendingEnrollments.length > 0 && (
          <Card className="mb-8 border-2 border-dashed border-primary/30">
            <CardHeader>
              <CardTitle className="font-serif text-xl text-primary">Upload Payment Proof</CardTitle>
              <CardDescription>Select the enrollment and upload your bank transfer receipt or screenshot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Enrollment</label>
                <select
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedEnrollmentId ?? ""}
                  onChange={e => setSelectedEnrollmentId(parseInt(e.target.value))}
                  data-testid="select-enrollment"
                >
                  <option value="">-- Choose an enrollment --</option>
                  {pendingEnrollments.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.package?.name || `Package #${e.packageId}`} — {e.skills?.length ?? 0} skills
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Proof (JPG, PNG, PDF — max 10MB)</label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3 text-primary">
                      <FileText className="w-6 h-6" />
                      <span className="font-medium">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500">Click to choose a file, or drag and drop</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  data-testid="input-payment-proof"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!selectedFile || !selectedEnrollmentId || submitPayment.isPending}
                className="w-full bg-primary hover:bg-primary/90"
                data-testid="button-submit-payment"
              >
                {submitPayment.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                ) : "Submit Payment Proof"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Payment history */}
        <div>
          <h2 className="text-xl font-serif font-semibold text-gray-800 mb-4">Payment History</h2>
          {loadingPayments ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : !payments?.length ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-muted-foreground">No payment records yet. Select your catering skills first, then upload your payment proof here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {payments.map(p => {
                const status = statusConfig[p.status] || statusConfig.pending;
                const Icon = status.icon;
                return (
                  <Card key={p.id} data-testid={`card-payment-${p.id}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{p.fileName}</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded {new Date(p.uploadedAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <Badge variant={status.color} className="flex items-center gap-1 flex-shrink-0">
                          <Icon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ParticipantLayout>
  );
}

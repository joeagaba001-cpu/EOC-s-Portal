import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useListPayments,
  useConfirmPayment,
  useRejectPayment,
  getListPaymentsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, FileText, Clock, Loader2, CreditCard } from "lucide-react";

const statusBadge: Record<string, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  confirmed: "default",
  rejected: "destructive",
};

export default function OfficerPayments() {
  const { data: payments, isLoading } = useListPayments();
  const confirmPayment = useConfirmPayment();
  const rejectPayment = useRejectPayment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleConfirm = (id: number) => {
    confirmPayment.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Payment Confirmed", description: "Participant enrollment has been approved." });
        queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey() });
      },
      onError: () => toast({ title: "Error", description: "Could not confirm payment.", variant: "destructive" }),
    });
  };

  const handleReject = (id: number) => {
    rejectPayment.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Payment Rejected", description: "Participant has been notified to re-upload proof." });
        queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey() });
      },
      onError: () => toast({ title: "Error", description: "Could not reject payment.", variant: "destructive" }),
    });
  };

  const pending = payments?.filter(p => p.status === "pending") || [];
  const reviewed = payments?.filter(p => p.status !== "pending") || [];

  return (
    <OfficerLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Payment Verification</h1>
        <p className="mt-1 text-muted-foreground">Review and verify participant payment proofs.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : !payments?.length ? (
        <Card className="text-center py-16">
          <CardContent>
            <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-muted-foreground font-medium">No payment submissions yet</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-8">
              <h2 className="font-semibold text-lg text-amber-700 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Pending Review ({pending.length})
              </h2>
              <div className="space-y-4">
                {pending.map(p => (
                  <Card key={p.id} data-testid={`card-pending-payment-${p.id}`} className="border-amber-200 bg-amber-50/30">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-amber-700" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{p.user?.fullName || "Participant"}</p>
                            <p className="text-sm text-muted-foreground">{p.user?.email}</p>
                            <p className="text-sm text-muted-foreground mt-1">File: {p.fileName}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Uploaded {new Date(p.uploadedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            onClick={() => handleConfirm(p.id)}
                            disabled={confirmPayment.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            data-testid={`button-confirm-payment-${p.id}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(p.id)}
                            disabled={rejectPayment.isPending}
                            data-testid={`button-reject-payment-${p.id}`}
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {reviewed.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg text-gray-700 mb-4">Reviewed Payments ({reviewed.length})</h2>
              <div className="space-y-3">
                {reviewed.map(p => (
                  <Card key={p.id} data-testid={`card-reviewed-payment-${p.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{p.user?.fullName}</p>
                            <p className="text-xs text-muted-foreground">{p.fileName}</p>
                          </div>
                        </div>
                        <Badge variant={statusBadge[p.status] || "secondary"} className="capitalize flex-shrink-0">
                          {p.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </OfficerLayout>
  );
}

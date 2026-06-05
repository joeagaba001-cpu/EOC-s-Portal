import { useState, useEffect } from "react";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetSettings,
  useUpdateSettings,
  getGetSettingsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Settings, Phone, Mail, MapPin, Save, Loader2 } from "lucide-react";

export default function OfficerSettings() {
  const { data: settings, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState({ whatsappNumber: "", contactEmail: "", address: "" });

  useEffect(() => {
    if (settings) {
      setForm({
        whatsappNumber: settings.whatsappNumber || "",
        contactEmail: settings.contactEmail || "",
        address: settings.address || "",
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate({ data: form }, {
      onSuccess: () => {
        toast({ title: "Settings saved", description: "Portal settings have been updated successfully." });
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
      },
      onError: () => toast({ title: "Error", description: "Could not save settings.", variant: "destructive" }),
    });
  };

  return (
    <OfficerLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Portal Settings</h1>
        <p className="mt-1 text-muted-foreground">Configure WhatsApp payment number and contact information.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2 text-xl">
                  <Phone className="w-5 h-5 text-primary" /> WhatsApp Payment Number
                </CardTitle>
                <CardDescription>
                  Participants will contact this number via WhatsApp to complete payment. Include the country code (e.g. 2348012345678).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>WhatsApp Number</Label>
                  <Input
                    value={form.whatsappNumber}
                    onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))}
                    placeholder="e.g. 2348012345678"
                    className="mt-1"
                    data-testid="input-whatsapp-number"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2 text-xl">
                  <Settings className="w-5 h-5 text-primary" /> Contact Information
                </CardTitle>
                <CardDescription>Displayed on the public portal for participant inquiries.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label><Mail className="inline w-4 h-4 mr-1 text-muted-foreground" /> Contact Email</Label>
                  <Input
                    value={form.contactEmail}
                    onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                    placeholder="e.g. info@elizabethokwori.org"
                    className="mt-1"
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <Label><MapPin className="inline w-4 h-4 mr-1 text-muted-foreground" /> Organisation Address</Label>
                  <Input
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="e.g. No. 5 Adeola Odeku Street, Victoria Island, Lagos"
                    className="mt-1"
                    data-testid="input-address"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 min-w-[140px]"
                disabled={updateSettings.isPending}
                data-testid="button-save-settings"
              >
                {updateSettings.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save Settings</>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </OfficerLayout>
  );
}

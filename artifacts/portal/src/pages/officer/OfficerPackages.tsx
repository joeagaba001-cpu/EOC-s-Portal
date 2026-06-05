import { useState } from "react";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  useListPackages,
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
  getListPackagesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, PackageSearch, Loader2 } from "lucide-react";

type FormData = { name: string; description: string; price: string; duration: string };

export default function OfficerPackages() {
  const { data: packages, isLoading } = useListPackages();
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const deletePackage = useDeletePackage();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>({ name: "", description: "", price: "", duration: "" });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", duration: "" });
    setOpen(true);
  };

  const openEdit = (pkg: any) => {
    setEditing(pkg.id);
    setForm({ name: pkg.name, description: pkg.description || "", price: String(pkg.price), duration: pkg.duration });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.duration) {
      toast({ title: "Required fields missing", description: "Name, price, and duration are required.", variant: "destructive" });
      return;
    }
    const data = { name: form.name, description: form.description, price: parseInt(form.price), duration: form.duration };
    const onSuccess = () => {
      toast({ title: editing ? "Package updated" : "Package created" });
      queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey() });
      setOpen(false);
    };
    const onError = () => toast({ title: "Error", description: "Could not save package.", variant: "destructive" });

    if (editing) {
      updatePackage.mutate({ id: editing, data }, { onSuccess, onError });
    } else {
      createPackage.mutate({ data }, { onSuccess, onError });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this package?")) return;
    deletePackage.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Package deleted" });
        queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey() });
      },
      onError: () => toast({ title: "Error", description: "Could not delete package.", variant: "destructive" }),
    });
  };

  return (
    <OfficerLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Enrollment Packages</h1>
          <p className="mt-1 text-muted-foreground">Manage pricing and training duration packages.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90" data-testid="button-add-package">
          <Plus className="w-4 h-4 mr-2" /> Add Package
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : !packages?.length ? (
        <Card className="text-center py-16">
          <CardContent>
            <PackageSearch className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-muted-foreground font-medium">No packages yet</p>
            <Button onClick={openCreate} className="mt-4 bg-primary hover:bg-primary/90">Add First Package</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg: any) => (
            <Card key={pkg.id} data-testid={`card-package-${pkg.id}`} className="relative hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 flex gap-1.5">
                  <button onClick={() => openEdit(pkg)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors" data-testid={`button-edit-package-${pkg.id}`}>
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-destructive transition-colors" data-testid={`button-delete-package-${pkg.id}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-2xl font-bold text-primary mb-1">₦{pkg.price.toLocaleString()}</div>
                <h3 className="font-serif font-semibold text-gray-900 text-lg mb-1">{pkg.name}</h3>
                {pkg.description && <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>}
                <div className="inline-flex items-center bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                  {pkg.duration}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">{editing ? "Edit Package" : "Add New Package"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Package Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Standard Package" data-testid="input-package-name" />
            </div>
            <div>
              <Label>Price (Naira)</Label>
              <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 25000" data-testid="input-package-price" />
            </div>
            <div>
              <Label>Duration</Label>
              <Input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 3 months" data-testid="input-package-duration" />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" data-testid="input-package-description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90" disabled={createPackage.isPending || updatePackage.isPending} data-testid="button-save-package">
              {(createPackage.isPending || updatePackage.isPending) ? "Saving..." : "Save Package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OfficerLayout>
  );
}

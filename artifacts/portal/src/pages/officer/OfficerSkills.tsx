import { useState } from "react";
import { OfficerLayout } from "@/components/layout/OfficerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  useListSkills,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
  getListSkillsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, BookOpen, Loader2 } from "lucide-react";

type FormData = { name: string; category: string; description: string };

export default function OfficerSkills() {
  const { data: skills, isLoading } = useListSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>({ name: "", category: "", description: "" });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", category: "", description: "" });
    setOpen(true);
  };

  const openEdit = (skill: any) => {
    setEditing(skill.id);
    setForm({ name: skill.name, category: skill.category, description: skill.description || "" });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.category) {
      toast({ title: "Required", description: "Name and category are required.", variant: "destructive" });
      return;
    }
    const onSuccess = () => {
      toast({ title: editing ? "Skill updated" : "Skill created" });
      queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
      setOpen(false);
    };
    const onError = () => toast({ title: "Error", description: "Could not save skill.", variant: "destructive" });

    if (editing) {
      updateSkill.mutate({ id: editing, data: form }, { onSuccess, onError });
    } else {
      createSkill.mutate({ data: form }, { onSuccess, onError });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this skill?")) return;
    deleteSkill.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Skill deleted" });
        queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() });
      },
      onError: () => toast({ title: "Error", description: "Could not delete skill.", variant: "destructive" }),
    });
  };

  const grouped = skills?.reduce((acc: Record<string, any[]>, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {}) || {};

  return (
    <OfficerLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Catering Skills</h1>
          <p className="mt-1 text-muted-foreground">Manage the skills available for enrollment.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90" data-testid="button-add-skill">
          <Plus className="w-4 h-4 mr-2" /> Add Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : !skills?.length ? (
        <Card className="text-center py-16">
          <CardContent>
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-muted-foreground font-medium">No skills added yet</p>
            <Button onClick={openCreate} className="mt-4 bg-primary hover:bg-primary/90">Add First Skill</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category}>
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">{category}</h2>
              <div className="space-y-2">
                {catSkills.map((skill: any) => (
                  <Card key={skill.id} data-testid={`card-skill-${skill.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-gray-900">{skill.name}</p>
                          {skill.description && <p className="text-sm text-muted-foreground mt-0.5">{skill.description}</p>}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="sm" variant="outline" onClick={() => openEdit(skill)} data-testid={`button-edit-skill-${skill.id}`}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(skill.id)} className="text-destructive hover:text-destructive" data-testid={`button-delete-skill-${skill.id}`}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">{editing ? "Edit Skill" : "Add New Skill"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Skill Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Cake Decoration" data-testid="input-skill-name" />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Baking & Confectionery" data-testid="input-skill-category" />
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" data-testid="input-skill-description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90" disabled={createSkill.isPending || updateSkill.isPending} data-testid="button-save-skill">
              {(createSkill.isPending || updateSkill.isPending) ? "Saving..." : "Save Skill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OfficerLayout>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCompleteRegistration } from "@workspace/api-client-react";
import { getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, ShieldCheck } from "lucide-react";

const formSchema = z.object({
  role: z.enum(["participant", "officer"]),
  phone: z.string().min(10, { message: "Phone number is required and must be valid." }),
  sex: z.enum(["Male", "Female"]),
  officerCode: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === "officer" && !data.officerCode) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Officer Code is required to register as an Officer.",
      path: ["officerCode"],
    });
  }
});

export default function CompleteRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const completeRegistration = useCompleteRegistration();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "participant",
      phone: "",
      sex: "Female",
      officerCode: "",
    },
  });

  const role = form.watch("role");

  function onSubmit(values: z.infer<typeof formSchema>) {
    completeRegistration.mutate({
      data: {
        role: values.role,
        phone: values.phone,
        sex: values.sex,
        officerCode: values.role === "officer" ? values.officerCode : undefined,
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Registration Complete",
          description: "Welcome to the Elizabeth Onyaole Okwori Memorial Foundation.",
        });
        queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
        setLocation(values.role === "participant" ? "/dashboard" : "/officer");
      },
      onError: (error: any) => {
        toast({
          title: "Registration Failed",
          description: error.message || "Failed to complete registration. Please check your details.",
          variant: "destructive",
        });
        if (error.message?.toLowerCase().includes("officer code")) {
          form.setError("officerCode", { message: "Invalid officer code." });
        }
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="font-serif text-2xl">Complete Your Profile</CardTitle>
              <CardDescription>
                Please provide a few more details to set up your account.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div 
                    className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${role === 'participant' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => form.setValue("role", "participant")}
                  >
                    <GraduationCap className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium text-sm">Participant</div>
                  </div>
                  <div 
                    className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${role === 'officer' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => form.setValue("role", "officer")}
                  >
                    <ShieldCheck className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium text-sm">NGO Officer</div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. +234 800 000 0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {role === "officer" && (
                  <FormField
                    control={form.control}
                    name="officerCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Officer Registration Code</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter administrative code" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provided by the NGO administrator.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6"
                  disabled={completeRegistration.isPending}
                >
                  {completeRegistration.isPending ? "Setting up..." : "Complete Registration"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

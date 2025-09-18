import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Building2, Mail, Phone, MapPin, Edit, Trash2 } from "lucide-react";
import { insertSupplierSchema, type Supplier, type InsertSupplier } from "@shared/schema";

export default function Suppliers() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();

  const { data: suppliers, isLoading } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const form = useForm<InsertSupplier>({
    resolver: zodResolver(insertSupplierSchema),
    defaultValues: {
      name: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSupplier) => {
      const response = await apiRequest("POST", "/api/suppliers", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      setShowAddModal(false);
      form.reset();
      toast({ title: "Success", description: "Supplier created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create supplier", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertSupplier) => {
    createMutation.mutate(data);
  };

  return (
    <>
      <Header 
        title="Suppliers" 
        description="Manage your supplier information and contacts" 
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">All Suppliers</h3>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-supplier">
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter supplier name" {...field} data-testid="input-supplier-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter email address" 
                            {...field} 
                            value={field.value || ""}
                            data-testid="input-supplier-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter phone number" 
                            {...field} 
                            value={field.value || ""}
                            data-testid="input-supplier-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter address" 
                            {...field} 
                            value={field.value || ""}
                            data-testid="input-supplier-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddModal(false)}
                      data-testid="button-cancel-supplier"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending}
                      data-testid="button-save-supplier"
                    >
                      {createMutation.isPending ? "Adding..." : "Add Supplier"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="h-3 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : suppliers && suppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow" data-testid={`card-supplier-${supplier.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900" data-testid={`text-supplier-name-${supplier.id}`}>
                          {supplier.name}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" data-testid={`button-edit-supplier-${supplier.id}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" data-testid={`button-delete-supplier-${supplier.id}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {supplier.contactEmail && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        <span data-testid={`text-supplier-email-${supplier.id}`}>{supplier.contactEmail}</span>
                      </div>
                    )}
                    {supplier.contactPhone && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span data-testid={`text-supplier-phone-${supplier.id}`}>{supplier.contactPhone}</span>
                      </div>
                    )}
                    {supplier.address && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span data-testid={`text-supplier-address-${supplier.id}`}>{supplier.address}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h4 className="text-lg font-semibold text-slate-900 mb-2">No Suppliers Found</h4>
              <p className="text-slate-600 mb-4">Get started by adding your first supplier</p>
              <Button onClick={() => setShowAddModal(true)} data-testid="button-add-first-supplier">
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

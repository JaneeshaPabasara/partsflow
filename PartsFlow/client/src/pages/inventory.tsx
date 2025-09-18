import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/layout/header";
import PartsTable from "@/components/parts/parts-table";
import AddPartModal from "@/components/parts/add-part-modal";
import EditPartModal from "@/components/parts/edit-part-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PartWithDetails } from "@shared/schema";

export default function Inventory() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState<PartWithDetails | null>(null);
  const { data: parts, isLoading } = useQuery<PartWithDetails[]>({
    queryKey: ["/api/parts"],
  });

  const handleEdit = (part: PartWithDetails) => {
    setSelectedPart(part);
    setShowEditModal(true);
  };

  const handleDelete = async (part: PartWithDetails) => {
    if (window.confirm(`Are you sure you want to delete "${part.name}"?`)) {
      try {
        const response = await fetch(`/api/parts/${part.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete part');
        }
        
        // Refresh the parts list
        window.location.reload();
      } catch (error) {
        console.error('Error deleting part:', error);
        alert('Failed to delete part. Please try again.');
      }
    }
  };

  return (
    <>
      <Header 
        title="Inventory Management" 
        description="Manage your spare parts inventory and stock levels" 
      />

      <div className="p-6">
        <div className="flex items-center justify-end mb-6">
          <Button 
            onClick={() => setShowAddModal(true)}
            data-testid="button-add-part-inventory"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Part
          </Button>
        </div>

        <PartsTable 
          parts={parts || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddPartModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />

      <EditPartModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        part={selectedPart}
      />
    </>
  );
}

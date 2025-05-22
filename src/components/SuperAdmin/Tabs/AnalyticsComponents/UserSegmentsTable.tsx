
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { 
  userSegmentationService, 
  UserSegment
} from '@/services/userSegmentationService';
import { useQueryClient } from '@tanstack/react-query';

interface UserSegmentsTableProps {
  segments: UserSegment[];
  isLoading: boolean;
}

type FormState = {
  name: string;
  description: string;
  criteriaJson: string;
};

const UserSegmentsTable: React.FC<UserSegmentsTableProps> = ({ segments, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<UserSegment | null>(null);
  const [formState, setFormState] = useState<FormState>({
    name: '',
    description: '',
    criteriaJson: JSON.stringify({ conditions: [] }, null, 2)
  });
  const [validationError, setValidationError] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset form when dialog closes
  const resetForm = () => {
    setFormState({
      name: '',
      description: '',
      criteriaJson: JSON.stringify({ conditions: [] }, null, 2)
    });
    setEditingSegment(null);
    setValidationError('');
  };

  // Open edit dialog with segment data
  const handleEditClick = (segment: UserSegment) => {
    setEditingSegment(segment);
    setFormState({
      name: segment.name,
      description: segment.description || '',
      criteriaJson: JSON.stringify(segment.criteria, null, 2)
    });
    setIsOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  // Save segment (create or update)
  const handleSaveSegment = async () => {
    // Validate form
    if (!formState.name.trim()) {
      setValidationError('Le nom du segment est requis');
      return;
    }

    let criteria;
    try {
      criteria = JSON.parse(formState.criteriaJson);
      if (typeof criteria !== 'object') throw new Error();
    } catch (error) {
      setValidationError('Le critère JSON est invalide');
      return;
    }

    try {
      if (editingSegment) {
        // Update existing segment
        await userSegmentationService.updateSegment(editingSegment.id, {
          name: formState.name,
          description: formState.description,
          criteria
        });
        toast({
          title: 'Segment mis à jour',
          description: `Le segment "${formState.name}" a été mis à jour avec succès.`
        });
      } else {
        // Create new segment
        await userSegmentationService.createSegment({
          name: formState.name,
          description: formState.description,
          criteria
        });
        toast({
          title: 'Segment créé',
          description: `Le segment "${formState.name}" a été créé avec succès.`
        });
      }
      
      // Refresh data and close dialog
      queryClient.invalidateQueries({ queryKey: ['userSegments'] });
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde du segment.',
        variant: 'destructive'
      });
    }
  };

  // Delete segment
  const handleDeleteSegment = async (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le segment "${name}"?`)) {
      try {
        await userSegmentationService.deleteSegment(id);
        queryClient.invalidateQueries({ queryKey: ['userSegments'] });
        toast({
          title: 'Segment supprimé',
          description: `Le segment "${name}" a été supprimé avec succès.`
        });
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la suppression du segment.',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Segments d'utilisateurs</CardTitle>
            <CardDescription>
              Gérez les segments d'utilisateurs pour mieux cibler vos actions
            </CardDescription>
          </div>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau segment
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-full h-16" />
              ))}
            </div>
          ) : segments.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">Aucun segment défini</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Créez votre premier segment pour organiser vos utilisateurs
              </p>
              <Button className="mt-4" onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer un segment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {segments.map((segment) => (
                <div key={segment.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex-1">
                    <h4 className="font-medium">{segment.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {segment.description || 'Aucune description'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditClick(segment)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteSegment(segment.id, segment.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Segment Form Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsOpen(open);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSegment ? `Modifier le segment: ${editingSegment.name}` : 'Créer un nouveau segment'}
            </DialogTitle>
            <DialogDescription>
              Définissez les critères pour ce segment d'utilisateurs
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom du segment</Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                placeholder="Ex: Utilisateurs actifs"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Input
                id="description"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                placeholder="Décrivez ce segment..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="criteriaJson">Critères (JSON)</Label>
              <Textarea
                id="criteriaJson"
                name="criteriaJson"
                value={formState.criteriaJson}
                onChange={handleInputChange}
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Définissez les critères sous forme d'objet JSON
              </p>
              {validationError && (
                <p className="text-sm text-red-500">{validationError}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveSegment}>
              {editingSegment ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserSegmentsTable;

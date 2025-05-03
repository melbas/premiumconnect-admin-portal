
import React, { useState } from 'react';
import { User, Upload, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const defaultAvatars = [
  '/assets/profiles/amadou.jpg',
  '/assets/profiles/fatou.jpg',
  '/assets/profiles/omar.jpg',
  '/assets/profiles/mariama.jpg',
  '/assets/profiles/placeholder-1.jpg',
  '/assets/profiles/placeholder-2.jpg',
];

interface ProfileImageUploaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar?: string;
  userName: string;
  onSave: (avatarUrl: string) => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  open,
  onOpenChange,
  currentAvatar,
  userName,
  onSave
}) => {
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(currentAvatar);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erreur de téléchargement",
        description: "L'image ne doit pas dépasser 2 Mo.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Type de fichier non valide",
        description: "Veuillez sélectionner une image.",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setSelectedAvatar(undefined);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSave = () => {
    if (uploadedImage) {
      onSave(uploadedImage);
    } else if (selectedAvatar) {
      onSave(selectedAvatar);
    }
    toast({
      title: "Photo de profil mise à jour",
      description: "Votre photo de profil a été mise à jour avec succès."
    });
    onOpenChange(false);
  };
  
  const handleSelectAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
    setUploadedImage(null);
  };
  
  const handleRemoveUpload = () => {
    setUploadedImage(null);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Changer votre photo de profil</DialogTitle>
          <DialogDescription>
            Sélectionnez une image prédéfinie ou téléchargez votre propre image
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current avatar display */}
          <div className="flex flex-col items-center justify-center py-4">
            <Avatar className="h-24 w-24 mb-3">
              {uploadedImage ? (
                <AvatarImage src={uploadedImage} alt={userName} />
              ) : selectedAvatar ? (
                <AvatarImage src={selectedAvatar} alt={userName} />
              ) : currentAvatar ? (
                <AvatarImage src={currentAvatar} alt={userName} />
              ) : (
                <AvatarFallback className="text-2xl">
                  {userName?.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <p className="text-sm text-muted-foreground">
              {userName}
            </p>
          </div>
          
          {/* Avatar selector grid */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Sélectionner un avatar
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {defaultAvatars.map((avatar, index) => (
                <button
                  key={index}
                  type="button"
                  className={`relative rounded-md overflow-hidden h-16 w-16 flex items-center justify-center border-2 ${
                    selectedAvatar === avatar 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-border'
                  }`}
                  onClick={() => handleSelectAvatar(avatar)}
                >
                  <img 
                    src={avatar} 
                    alt={`Avatar option ${index + 1}`} 
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Upload option */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Ou télécharger votre propre image
            </label>
            <div className="flex flex-col space-y-2">
              {uploadedImage ? (
                <div className="relative">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded avatar" 
                    className="h-24 w-24 object-cover rounded-md mx-auto"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveUpload}
                    className="absolute -top-2 -right-2 bg-background rounded-full p-1 border border-border"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center flex-col">
                  <label 
                    htmlFor="avatar-upload" 
                    className="w-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md p-6 transition-colors hover:border-muted-foreground cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Cliquez pour sélectionner une image
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, GIF (max 2MB)
                    </span>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedAvatar && !uploadedImage}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileImageUploader;

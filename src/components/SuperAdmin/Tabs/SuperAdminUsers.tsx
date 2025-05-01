
import React, { useState } from 'react';
import { users as mockUsers, UserData } from '../mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Edit, Plus, Search, Trash } from 'lucide-react';

// Modal component for adding/editing users
const UserModal = ({ 
  isOpen, 
  onClose, 
  user, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  user?: UserData; 
  onSave: (user: Partial<UserData>) => void;
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'technical'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">
          {user ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Nom
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium">
              Rôle
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="superadmin">Super Admin</option>
              <option value="marketing">Marketing</option>
              <option value="technical">Technique</option>
            </select>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {user ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Users component
const SuperAdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle modal save
  const handleSaveUser = (userData: Partial<UserData>) => {
    if (currentUser) {
      // Edit existing user
      const updatedUsers = users.map(u => 
        u.id === currentUser.id ? { ...u, ...userData } : u
      );
      setUsers(updatedUsers);
      toast({ 
        title: "Utilisateur modifié", 
        description: `${userData.name} a été mis à jour avec succès.` 
      });
    } else {
      // Create new user
      const newUser: UserData = {
        id: (users.length + 1).toString(),
        name: userData.name || '',
        email: userData.email || '',
        role: (userData.role as 'superadmin' | 'marketing' | 'technical') || 'technical',
        lastActive: new Date().toISOString(),
        status: 'active',
        avatar: `https://i.pravatar.cc/150?img=${users.length + 10}`
      };
      
      setUsers([...users, newUser]);
      toast({ 
        title: "Utilisateur ajouté", 
        description: `${newUser.name} a été ajouté avec succès.` 
      });
    }
  };

  // Handle user edit
  const handleEditUser = (user: UserData) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  // Handle user delete
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast({ 
      title: "Utilisateur supprimé", 
      description: "L'utilisateur a été supprimé avec succès." 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dashboard-title">Gestion des Utilisateurs</h1>
        {user?.role === 'superadmin' && (
          <Button onClick={() => {
            setCurrentUser(undefined);
            setIsModalOpen(true);
          }}>
            <Plus size={16} className="mr-2" />
            Ajouter Utilisateur
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>Utilisateurs</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher les utilisateurs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Dernière connexion</th>
                  <th>Statut</th>
                  {user?.role === 'superadmin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(userData => (
                  <tr key={userData.id}>
                    <td className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 overflow-hidden rounded-full">
                          {userData.avatar && (
                            <img 
                              src={userData.avatar}
                              alt={userData.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        {userData.name}
                      </div>
                    </td>
                    <td>{userData.email}</td>
                    <td className="capitalize">
                      {userData.role === 'superadmin' ? 'Super Admin' : 
                        userData.role === 'marketing' ? 'Marketing' : 'Technique'}
                    </td>
                    <td>{new Date(userData.lastActive).toLocaleString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                    <td>
                      <span 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${userData.status === 'active' 
                            ? 'bg-success/20 text-success' 
                            : 'bg-danger/20 text-danger'}`}
                      >
                        {userData.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    {user?.role === 'superadmin' && (
                      <td>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditUser(userData)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteUser(userData.id)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={currentUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default SuperAdminUsers;

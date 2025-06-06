
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Camera, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      console.log('Loading profile for user:', user?.id);
      
      const response = await apiClient.getProfile();
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        console.log('Profile loaded:', response.data);
        setProfile(response.data);
        setFormData(prev => ({ ...prev, name: response.data.name }));
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = async () => {
    if (!user || !formData.name.trim()) return;

    setSaving(true);
    
    try {
      const response = await apiClient.updateProfile({ name: formData.name });
      if (response.error) {
        throw new Error(response.error);
      }

      setProfile(prev => prev ? { ...prev, name: formData.name } : null);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-saas-black">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-saas-red" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-saas-black">
      <Navbar />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Configurações do Perfil</h1>

          <div className="space-y-6">
            {/* Profile Information */}
            <Card className="bg-saas-black-light border-saas-gray/20">
              <CardHeader>
                <CardTitle className="text-white">Informações do Perfil</CardTitle>
                <CardDescription className="text-gray-400">
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-saas-red text-white text-lg">
                        {profile?.name ? getInitials(profile.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      disabled
                      className="border-saas-gray/20 text-gray-500 cursor-not-allowed"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Upload de foto não disponível
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      Funcionalidade em desenvolvimento
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-saas-black border-saas-gray/20 text-white"
                  />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-saas-black border-saas-gray/20 text-gray-400"
                  />
                </div>

                <Button 
                  onClick={updateProfileData}
                  disabled={saving}
                  className="bg-saas-red hover:bg-saas-red-dark text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Informações'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="bg-saas-black-light border-saas-gray/20">
              <CardHeader>
                <CardTitle className="text-white">Alterar Senha</CardTitle>
                <CardDescription className="text-gray-400">
                  Funcionalidade em desenvolvimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-gray-300">Senha Atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="bg-saas-black border-saas-gray/20 text-white"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-gray-300">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="bg-saas-black border-saas-gray/20 text-white"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-gray-300">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="bg-saas-black border-saas-gray/20 text-white"
                    disabled
                  />
                </div>

                <Button 
                  disabled
                  className="bg-gray-500 cursor-not-allowed text-white"
                >
                  Alterar Senha (Em desenvolvimento)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

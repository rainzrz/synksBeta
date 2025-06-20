import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Camera, Loader2, Link } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
}

export default function Profile() {
  const { user, updateProfile, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  
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
      await refreshUser();
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpdate = async () => {
    if (!avatarUrl.trim()) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }

    setUpdatingAvatar(true);

    try {
      const response = await apiClient.updateProfile({ avatar_url: avatarUrl });
      if (response.error) {
        throw new Error(response.error);
      }
      
      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
      await refreshUser();
      setAvatarDialogOpen(false);
      setAvatarUrl('');
      toast.success('Foto atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Erro ao atualizar foto');
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Todos os campos de senha são obrigatórios');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Nova senha e confirmação não coincidem');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await apiClient.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setFormData(prev => ({ 
        ...prev, 
        currentPassword: '', 
        newPassword: '', 
        confirmPassword: '' 
      }));
      toast.success('Senha alterada com sucesso!');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Erro ao alterar senha. Verifique sua senha atual.');
    } finally {
      setChangingPassword(false);
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
                    <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-saas-red hover:bg-saas-red-dark text-white">
                          <Link className="mr-2 h-4 w-4" />
                          Alterar Foto
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-saas-black-light border-saas-gray/20">
                        <DialogHeader>
                          <DialogTitle className="text-white">Alterar Foto do Perfil</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Insira a URL da imagem que deseja usar como foto de perfil
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="avatar-url" className="text-gray-300">URL da Imagem</Label>
                            <Input
                              id="avatar-url"
                              value={avatarUrl}
                              onChange={(e) => setAvatarUrl(e.target.value)}
                              placeholder="https://exemplo.com/minha-foto.jpg"
                              className="bg-saas-black border-saas-gray/20 text-white"
                            />
                          </div>
                          {avatarUrl && (
                            <div className="flex justify-center">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback className="bg-saas-red text-white">
                                  Preview
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={handleAvatarUpdate}
                            disabled={updatingAvatar || !avatarUrl.trim()}
                            className="bg-saas-red hover:bg-saas-red-dark text-white"
                          >
                            {updatingAvatar ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Atualizando...
                              </>
                            ) : (
                              'Salvar Foto'
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <p className="text-xs text-gray-500 mt-1">
                      Clique para adicionar URL da sua foto de perfil
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
                  Altere sua senha de acesso
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
                  />
                </div>

                <Button 
                  onClick={handlePasswordChange}
                  disabled={changingPassword}
                  className="bg-saas-red hover:bg-saas-red-dark text-white"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Alterando...
                    </>
                  ) : (
                    'Alterar Senha'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}


import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: true,
    autoCheck: true,
    checkInterval: 5,
  });

  const [profile, setProfile] = useState({
    name: '',
    email: user?.email || '',
  });

  const updateSettings = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Aqui você salvaria as configurações no backend
    toast.success('Configuração atualizada');
  };

  return (
    <div className="min-h-screen bg-saas-black">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
            <p className="text-gray-400">Gerencie suas preferências e configurações da conta</p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card className="bg-saas-black-light border-saas-gray/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-saas-red" />
                  Perfil
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Gerencie suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-gray-300">Nome</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-saas-black border-saas-gray/20 text-white"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-saas-black border-saas-gray/20 text-gray-400"
                  />
                </div>
                <Button className="bg-saas-red hover:bg-saas-red-dark text-white">
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-saas-black-light border-saas-gray/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="h-5 w-5 text-saas-red" />
                  Notificações
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure como você quer receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Notificações Push</Label>
                    <p className="text-sm text-gray-400">Receba notificações no navegador</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => updateSettings('notifications', checked)}
                  />
                </div>
                <Separator className="bg-saas-gray/20" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Alertas por Email</Label>
                    <p className="text-sm text-gray-400">Receba alertas quando links ficarem offline</p>
                  </div>
                  <Switch
                    checked={settings.emailAlerts}
                    onCheckedChange={(checked) => updateSettings('emailAlerts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Monitoring Settings */}
            <Card className="bg-saas-black-light border-saas-gray/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-saas-red" />
                  Monitoramento
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure as opções de monitoramento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Verificação Automática</Label>
                    <p className="text-sm text-gray-400">Verificar status dos links automaticamente</p>
                  </div>
                  <Switch
                    checked={settings.autoCheck}
                    onCheckedChange={(checked) => updateSettings('autoCheck', checked)}
                  />
                </div>
                <Separator className="bg-saas-gray/20" />
                <div className="grid gap-2">
                  <Label htmlFor="interval" className="text-gray-300">Intervalo de Verificação (minutos)</Label>
                  <Input
                    id="interval"
                    type="number"
                    value={settings.checkInterval}
                    onChange={(e) => updateSettings('checkInterval', parseInt(e.target.value))}
                    className="bg-saas-black border-saas-gray/20 text-white max-w-32"
                    min="1"
                    max="60"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="bg-saas-black-light border-saas-gray/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-saas-red" />
                  Segurança
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Gerencie a segurança da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="border-saas-gray/20 text-gray-300">
                  Alterar Senha
                </Button>
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                  Excluir Conta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

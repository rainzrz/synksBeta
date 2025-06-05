import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, ExternalLink, Building2, Globe, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useLinkMonitoring } from '@/hooks/useLinkMonitoring';
import DashboardCharts from '@/components/DashboardCharts';
import QuickStats from '@/components/QuickStats';
import MonitoringControls from '@/components/MonitoringControls';

interface Company {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Link {
  id: string;
  name: string;
  url: string;
  description: string | null;
  status: 'online' | 'offline' | 'error' | 'pending';
  response_time: number | null;
  last_checked: string | null;
  company_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  
  // Form states
  const [companyForm, setCompanyForm] = useState({ name: '', description: '' });
  const [linkForm, setLinkForm] = useState({ name: '', url: '', description: '', company_id: '' });
  
  const { isMonitoring, startMonitoring, stopMonitoring, checkAllLinks } = useLinkMonitoring(user?.id);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (companiesError) throw companiesError;

      // Load links
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (linksError) throw linksError;

      setCompanies(companiesData || []);
      // Type cast the status field to match our Link interface
      setLinks((linksData || []).map(link => ({
        ...link,
        status: link.status as 'online' | 'offline' | 'error' | 'pending'
      })));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const validateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleCreateCompany = async () => {
    if (!companyForm.name.trim()) {
      toast.error('Nome da empresa é obrigatório');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: companyForm.name,
          description: companyForm.description || null,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setCompanies(prev => [data, ...prev]);
      setCompanyForm({ name: '', description: '' });
      setShowCompanyDialog(false);
      toast.success('Empresa criada com sucesso!');
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Erro ao criar empresa');
    }
  };

  const handleUpdateCompany = async () => {
    if (!editingCompany || !companyForm.name.trim()) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .update({
          name: companyForm.name,
          description: companyForm.description || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingCompany.id)
        .select()
        .single();

      if (error) throw error;

      setCompanies(prev => prev.map(company => 
        company.id === editingCompany.id ? data : company
      ));
      setEditingCompany(null);
      setCompanyForm({ name: '', description: '' });
      setShowCompanyDialog(false);
      toast.success('Empresa atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Erro ao atualizar empresa');
    }
  };

  const handleDeleteCompany = async (company: Company) => {
    if (!confirm(`Tem certeza que deseja excluir a empresa "${company.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', company.id);

      if (error) throw error;

      setCompanies(prev => prev.filter(c => c.id !== company.id));
      setLinks(prev => prev.filter(l => l.company_id !== company.id));
      toast.success('Empresa excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Erro ao excluir empresa');
    }
  };

  const handleCreateLink = async () => {
    if (!linkForm.name.trim() || !linkForm.url.trim() || !linkForm.company_id) {
      toast.error('Todos os campos obrigatórios devem ser preenchidos');
      return;
    }

    if (!validateUrl(linkForm.url)) {
      toast.error('URL deve começar com http:// ou https://');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('links')
        .insert({
          name: linkForm.name,
          url: linkForm.url,
          description: linkForm.description || null,
          company_id: linkForm.company_id,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setLinks(prev => [{
        ...data,
        status: data.status as 'online' | 'offline' | 'error' | 'pending'
      }, ...prev]);
      setLinkForm({ name: '', url: '', description: '', company_id: '' });
      setShowLinkDialog(false);
      toast.success('Link criado com sucesso!');
    } catch (error) {
      console.error('Error creating link:', error);
      toast.error('Erro ao criar link');
    }
  };

  const handleUpdateLink = async () => {
    if (!editingLink || !linkForm.name.trim() || !linkForm.url.trim() || !linkForm.company_id) return;

    if (!validateUrl(linkForm.url)) {
      toast.error('URL deve começar com http:// ou https://');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('links')
        .update({
          name: linkForm.name,
          url: linkForm.url,
          description: linkForm.description || null,
          company_id: linkForm.company_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingLink.id)
        .select()
        .single();

      if (error) throw error;

      setLinks(prev => prev.map(link => 
        link.id === editingLink.id ? {
          ...data,
          status: data.status as 'online' | 'offline' | 'error' | 'pending'
        } : link
      ));
      setEditingLink(null);
      setLinkForm({ name: '', url: '', description: '', company_id: '' });
      setShowLinkDialog(false);
      toast.success('Link atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Erro ao atualizar link');
    }
  };

  const handleDeleteLink = async (link: Link) => {
    if (!confirm(`Tem certeza que deseja excluir o link "${link.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', link.id);

      if (error) throw error;

      setLinks(prev => prev.filter(l => l.id !== link.id));
      toast.success('Link excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Erro ao excluir link');
    }
  };

  const openCompanyDialog = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      setCompanyForm({ name: company.name, description: company.description || '' });
    } else {
      setEditingCompany(null);
      setCompanyForm({ name: '', description: '' });
    }
    setShowCompanyDialog(true);
  };

  const openLinkDialog = (link?: Link) => {
    if (link) {
      setEditingLink(link);
      setLinkForm({ 
        name: link.name, 
        url: link.url, 
        description: link.description || '', 
        company_id: link.company_id 
      });
    } else {
      setEditingLink(null);
      setLinkForm({ name: '', url: '', description: '', company_id: '' });
    }
    setShowLinkDialog(true);
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Empresa não encontrada';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>;
      case 'offline':
        return <Badge className="bg-red-500 hover:bg-red-600">Offline</Badge>;
      case 'error':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Erro</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Pendente</Badge>;
    }
  };

  // Calculate stats for QuickStats component
  const stats = {
    totalLinks: links.length,
    totalCompanies: companies.length,
    onlineLinks: links.filter(l => l.status === 'online').length,
    offlineLinks: links.filter(l => l.status === 'offline').length,
    errorLinks: links.filter(l => l.status === 'error').length,
    pendingLinks: links.filter(l => l.status === 'pending').length,
    averageResponseTime: links.length > 0 
      ? Math.round(links.reduce((acc, link) => acc + (link.response_time || 0), 0) / links.length)
      : 0
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="flex gap-4">
            <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => openCompanyDialog()} className="bg-saas-red hover:bg-saas-red-dark text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Empresa
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-saas-black-light border-saas-gray/20">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingCompany ? 'Editar Empresa' : 'Nova Empresa'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {editingCompany ? 'Atualize as informações da empresa.' : 'Adicione uma nova empresa ao seu dashboard.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name" className="text-gray-300">Nome *</Label>
                    <Input
                      id="company-name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-saas-black border-saas-gray/20 text-white"
                      placeholder="Nome da empresa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-description" className="text-gray-300">Descrição</Label>
                    <Textarea
                      id="company-description"
                      value={companyForm.description}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-saas-black border-saas-gray/20 text-white"
                      placeholder="Descrição da empresa"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={editingCompany ? handleUpdateCompany : handleCreateCompany}
                      className="bg-saas-red hover:bg-saas-red-dark text-white"
                    >
                      {editingCompany ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCompanyDialog(false)}
                      className="border-saas-gray/20 text-gray-300 hover:text-white hover:bg-saas-gray/20"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => openLinkDialog()} variant="outline" className="border-saas-gray/20 text-gray-300 hover:text-white hover:bg-saas-gray/20">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Link
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-saas-black-light border-saas-gray/20">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingLink ? 'Editar Link' : 'Novo Link'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {editingLink ? 'Atualize as informações do link.' : 'Adicione um novo link para monitoramento.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="link-name" className="text-gray-300">Nome *</Label>
                    <Input
                      id="link-name"
                      value={linkForm.name}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-saas-black border-saas-gray/20 text-white"
                      placeholder="Nome do link"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link-url" className="text-gray-300">URL *</Label>
                    <Input
                      id="link-url"
                      value={linkForm.url}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, url: e.target.value }))}
                      className="bg-saas-black border-saas-gray/20 text-white"
                      placeholder="https://exemplo.com ou http://exemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link-company" className="text-gray-300">Empresa *</Label>
                    <select
                      id="link-company"
                      value={linkForm.company_id}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, company_id: e.target.value }))}
                      className="w-full bg-saas-black border border-saas-gray/20 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Selecione uma empresa</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="link-description" className="text-gray-300">Descrição</Label>
                    <Textarea
                      id="link-description"
                      value={linkForm.description}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-saas-black border-saas-gray/20 text-white"
                      placeholder="Descrição do link"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={editingLink ? handleUpdateLink : handleCreateLink}
                      className="bg-saas-red hover:bg-saas-red-dark text-white"
                    >
                      {editingLink ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowLinkDialog(false)}
                      className="border-saas-gray/20 text-gray-300 hover:text-white hover:bg-saas-gray/20"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-8">
          <QuickStats stats={stats} />
          <DashboardCharts companies={companies} links={links} />
          <MonitoringControls userId={user?.id} />
        </div>

        {/* Companies Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8 mt-8">
          <Card className="bg-saas-black-light border-saas-gray/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Empresas
              </CardTitle>
              <CardDescription className="text-gray-400">
                Gerencie suas empresas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {companies.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Nenhuma empresa cadastrada</p>
              ) : (
                <div className="space-y-3">
                  {companies.map(company => (
                    <div key={company.id} className="flex items-center justify-between p-3 bg-saas-black rounded-lg border border-saas-gray/20">
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{company.name}</h3>
                        {company.description && (
                          <p className="text-gray-400 text-sm">{company.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openCompanyDialog(company)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCompany(company)}
                          className="text-gray-400 hover:text-red-400"
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

          {/* Links Section */}
          <Card className="bg-saas-black-light border-saas-gray/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Links
              </CardTitle>
              <CardDescription className="text-gray-400">
                Monitore seus links
              </CardDescription>
            </CardHeader>
            <CardContent>
              {links.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Nenhum link cadastrado</p>
              ) : (
                <div className="space-y-3">
                  {links.map(link => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-saas-black rounded-lg border border-saas-gray/20">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-medium">{link.name}</h3>
                          {getStatusBadge(link.status)}
                        </div>
                        <p className="text-gray-400 text-sm">{getCompanyName(link.company_id)}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-saas-red text-sm hover:underline flex items-center gap-1"
                        >
                          {link.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openLinkDialog(link)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteLink(link)}
                          className="text-gray-400 hover:text-red-400"
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
        </div>
      </main>
    </div>
  );
}


import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import DashboardCharts from '@/components/DashboardCharts';
import QuickStats from '@/components/QuickStats';
import MonitoringControls from '@/components/MonitoringControls';
import LinkStatusIndicator from '@/components/LinkStatusIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Plus, Building2, ExternalLink, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Company, Link, DashboardStats } from '@/types';

export default function Dashboard() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [filteredData, setFilteredData] = useState<{ companies: Company[]; links: Link[] }>({ companies: [], links: [] });
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    totalLinks: 0,
    onlineLinks: 0,
    offlineLinks: 0,
    errorLinks: 0,
    pendingLinks: 0,
    averageResponseTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const [newCompany, setNewCompany] = useState({
    name: '',
    description: '',
  });

  const [newLink, setNewLink] = useState({
    name: '',
    url: '',
    description: '',
    company_id: '',
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    setFilteredData({ companies, links });
  }, [companies, links]);

  useEffect(() => {
    calculateStats();
  }, [links]);

  const loadData = async () => {
    try {
      const [companiesResponse, linksResponse] = await Promise.all([
        supabase.from('companies').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
        supabase.from('links').select('*').eq('user_id', user?.id).order('created_at', { ascending: false })
      ]);

      if (companiesResponse.error) throw companiesResponse.error;
      if (linksResponse.error) throw linksResponse.error;

      setCompanies(companiesResponse.data || []);
      
      // Type cast the links data to ensure proper status typing
      const typedLinks = linksResponse.data?.map(link => ({
        ...link,
        status: link.status as Link['status']
      })) as Link[] || [];
      
      setLinks(typedLinks);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalCompanies = companies.length;
    const totalLinks = links.length;
    const onlineLinks = links.filter(l => l.status === 'online').length;
    const offlineLinks = links.filter(l => l.status === 'offline').length;
    const errorLinks = links.filter(l => l.status === 'error').length;
    const pendingLinks = links.filter(l => l.status === 'pending').length;
    
    const responseTimes = links.filter(l => l.response_time !== null).map(l => l.response_time!);
    const averageResponseTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((acc, time) => acc + time, 0) / responseTimes.length)
      : 0;

    setStats({
      totalCompanies,
      totalLinks,
      onlineLinks,
      offlineLinks,
      errorLinks,
      pendingLinks,
      averageResponseTime
    });
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredData({ companies, links });
      return;
    }

    const filteredCompanies = companies.filter(company =>
      company.name.toLowerCase().includes(query.toLowerCase()) ||
      company.description?.toLowerCase().includes(query.toLowerCase())
    );

    const filteredLinks = links.filter(link =>
      link.name.toLowerCase().includes(query.toLowerCase()) ||
      link.url.toLowerCase().includes(query.toLowerCase()) ||
      link.description?.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredData({ companies: filteredCompanies, links: filteredLinks });
  };

  const createCompany = async () => {
    if (!newCompany.name.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([
          {
            name: newCompany.name,
            description: newCompany.description,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setCompanies(prev => [data, ...prev]);
      setNewCompany({ name: '', description: '' });
      setIsCompanyDialogOpen(false);
      toast.success('Empresa criada com sucesso!');
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Erro ao criar empresa');
    }
  };

  const updateCompany = async () => {
    if (!editingCompany || !newCompany.name.trim()) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .update({
          name: newCompany.name,
          description: newCompany.description,
        })
        .eq('id', editingCompany.id)
        .select()
        .single();

      if (error) throw error;

      setCompanies(prev => prev.map(company => 
        company.id === editingCompany.id ? data : company
      ));
      setEditingCompany(null);
      setNewCompany({ name: '', description: '' });
      setIsCompanyDialogOpen(false);
      toast.success('Empresa atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Erro ao atualizar empresa');
    }
  };

  const deleteCompany = async (companyId: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;

      setCompanies(prev => prev.filter(c => c.id !== companyId));
      setLinks(prev => prev.filter(l => l.company_id !== companyId));
      toast.success('Empresa excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Erro ao excluir empresa');
    }
  };

  const createLink = async () => {
    if (!newLink.name.trim() || !newLink.url.trim() || !newLink.company_id || !user) return;

    try {
      const { data, error } = await supabase
        .from('links')
        .insert([
          {
            name: newLink.name,
            url: newLink.url,
            description: newLink.description,
            company_id: newLink.company_id,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const typedLink = { ...data, status: data.status as Link['status'] } as Link;
      setLinks(prev => [typedLink, ...prev]);
      setNewLink({ name: '', url: '', description: '', company_id: '' });
      setIsLinkDialogOpen(false);
      toast.success('Link criado com sucesso!');
    } catch (error) {
      console.error('Error creating link:', error);
      toast.error('Erro ao criar link');
    }
  };

  const updateLink = async () => {
    if (!editingLink || !newLink.name.trim() || !newLink.url.trim() || !newLink.company_id) return;

    try {
      const { data, error } = await supabase
        .from('links')
        .update({
          name: newLink.name,
          url: newLink.url,
          description: newLink.description,
          company_id: newLink.company_id,
        })
        .eq('id', editingLink.id)
        .select()
        .single();

      if (error) throw error;

      const typedLink = { ...data, status: data.status as Link['status'] } as Link;
      setLinks(prev => prev.map(link => 
        link.id === editingLink.id ? typedLink : link
      ));
      setEditingLink(null);
      setNewLink({ name: '', url: '', description: '', company_id: '' });
      setIsLinkDialogOpen(false);
      toast.success('Link atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Erro ao atualizar link');
    }
  };

  const deleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;

      setLinks(prev => prev.filter(l => l.id !== linkId));
      toast.success('Link excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Erro ao excluir link');
    }
  };

  const openEditCompanyDialog = (company: Company) => {
    setEditingCompany(company);
    setNewCompany({
      name: company.name,
      description: company.description || '',
    });
    setIsCompanyDialogOpen(true);
  };

  const openEditLinkDialog = (link: Link) => {
    setEditingLink(link);
    setNewLink({
      name: link.name,
      url: link.url,
      description: link.description || '',
      company_id: link.company_id,
    });
    setIsLinkDialogOpen(true);
  };

  const closeCompanyDialog = () => {
    setIsCompanyDialogOpen(false);
    setEditingCompany(null);
    setNewCompany({ name: '', description: '' });
  };

  const closeLinkDialog = () => {
    setIsLinkDialogOpen(false);
    setEditingLink(null);
    setNewLink({ name: '', url: '', description: '', company_id: '' });
  };

  const offlineLinks = links.filter(link => link.status === 'offline');

  if (loading) {
    return (
      <div className="min-h-screen bg-saas-black">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saas-red"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-saas-black">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Monitore suas empresas e links em tempo real</p>
          </div>
          
          <SearchBar onSearch={handleSearch} placeholder="Pesquisar empresas e links..." />
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <QuickStats stats={stats} />
        </div>

        {/* Monitoring Controls */}
        <div className="mb-8">
          <MonitoringControls userId={user?.id} />
        </div>

        {/* Offline Links Alert */}
        {offlineLinks.length > 0 && (
          <Alert className="mb-8 border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-200">
              <strong>{offlineLinks.length} link(s) offline:</strong>{' '}
              {offlineLinks.map(link => link.name).join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Charts Section */}
        <div className="mb-8">
          <DashboardCharts companies={companies} links={links} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Dialog open={isCompanyDialogOpen} onOpenChange={closeCompanyDialog}>
            <DialogTrigger asChild>
              <Button className="bg-saas-red hover:bg-saas-red-dark text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nova Empresa
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-saas-black-light border-saas-gray/20">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingCompany ? 'Editar Empresa' : 'Criar Nova Empresa'}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {editingCompany ? 'Edite as informações da empresa.' : 'Adicione uma nova empresa para organizar seus links.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="company-name" className="text-gray-300">Nome</Label>
                  <Input
                    id="company-name"
                    placeholder="Ex: Google, Facebook, etc."
                    value={newCompany.name}
                    onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-saas-black border-saas-gray/20 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-description" className="text-gray-300">Descrição (opcional)</Label>
                  <Textarea
                    id="company-description"
                    placeholder="Descrição da empresa"
                    value={newCompany.description}
                    onChange={(e) => setNewCompany(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-saas-black border-saas-gray/20 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeCompanyDialog} className="border-saas-gray/20 text-gray-300">
                  Cancelar
                </Button>
                <Button 
                  onClick={editingCompany ? updateCompany : createCompany} 
                  className="bg-saas-red hover:bg-saas-red-dark text-white"
                >
                  {editingCompany ? 'Atualizar' : 'Criar'} Empresa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isLinkDialogOpen} onOpenChange={closeLinkDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-saas-gray/20 text-gray-300">
                <Plus className="mr-2 h-4 w-4" />
                Novo Link
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-saas-black-light border-saas-gray/20">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingLink ? 'Editar Link' : 'Criar Novo Link'}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {editingLink ? 'Edite as informações do link.' : 'Adicione um novo link para monitorar.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="link-name" className="text-gray-300">Nome</Label>
                  <Input
                    id="link-name"
                    placeholder="Ex: Site Principal"
                    value={newLink.name}
                    onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-saas-black border-saas-gray/20 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link-url" className="text-gray-300">URL</Label>
                  <Input
                    id="link-url"
                    placeholder="https://exemplo.com"
                    value={newLink.url}
                    onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                    className="bg-saas-black border-saas-gray/20 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link-company" className="text-gray-300">Empresa</Label>
                  <Select
                    value={newLink.company_id}
                    onValueChange={(value) => setNewLink(prev => ({ ...prev, company_id: value }))}
                  >
                    <SelectTrigger className="bg-saas-black border-saas-gray/20 text-white">
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent className="bg-saas-black-light border-saas-gray/20">
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id} className="text-white">
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="link-description" className="text-gray-300">Descrição (opcional)</Label>
                  <Textarea
                    id="link-description"
                    placeholder="Descrição do link"
                    value={newLink.description}
                    onChange={(e) => setNewLink(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-saas-black border-saas-gray/20 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeLinkDialog} className="border-saas-gray/20 text-gray-300">
                  Cancelar
                </Button>
                <Button 
                  onClick={editingLink ? updateLink : createLink} 
                  className="bg-saas-red hover:bg-saas-red-dark text-white"
                >
                  {editingLink ? 'Atualizar' : 'Criar'} Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Companies and Links Grid */}
        <div className="space-y-8">
          {filteredData.companies.map((company) => {
            const companyLinks = filteredData.links.filter(link => link.company_id === company.id);
            
            return (
              <Card key={company.id} className="bg-saas-black-light border-saas-gray/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-saas-red" />
                        {company.name}
                      </CardTitle>
                      {company.description && (
                        <CardDescription className="text-gray-400 mt-1">
                          {company.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => openEditCompanyDialog(company)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-400 hover:text-red-300"
                        onClick={() => deleteCompany(company.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {companyLinks.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">Nenhum link cadastrado</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {companyLinks.map((link) => (
                        <Card key={link.id} className="bg-saas-black border-saas-gray/20">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white truncate">{link.name}</h4>
                                <a 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-xs text-blue-400 hover:underline truncate block"
                                >
                                  {link.url}
                                </a>
                              </div>
                              <div className="flex gap-1 ml-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                  onClick={() => window.open(link.url, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300"
                                  onClick={() => openEditLinkDialog(link)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                  onClick={() => deleteLink(link.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <LinkStatusIndicator 
                                status={link.status}
                                responseTime={link.response_time}
                                lastChecked={link.last_checked}
                              />
                            </div>
                            {link.description && (
                              <p className="text-xs text-gray-400 mt-2 line-clamp-2">{link.description}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredData.companies.length === 0 && (
          <Card className="bg-saas-black-light border-saas-gray/20">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Nenhuma empresa encontrada</h3>
                <p className="text-gray-400 mb-4">Comece criando sua primeira empresa e adicionando links para monitorar</p>
                <Button 
                  onClick={() => setIsCompanyDialogOpen(true)}
                  className="bg-saas-red hover:bg-saas-red-dark text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Empresa
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

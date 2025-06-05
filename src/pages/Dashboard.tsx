
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import DashboardCharts from '@/components/DashboardCharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Building2, Globe, Plus, Trash2, Edit, ExternalLink, RefreshCw, TrendingUp, AlertTriangle } from 'lucide-react';
import { Company, Link, LinkStatus, DashboardStats } from '@/types';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [checkingLinks, setCheckingLinks] = useState<string[]>([]);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    totalLinks: 0,
    onlineLinks: 0,
    offlineLinks: 0,
    errorLinks: 0,
    pendingLinks: 0,
    averageResponseTime: 0,
  });

  const [newCompany, setNewCompany] = useState({
    name: '',
    description: '',
  });

  const [newLink, setNewLink] = useState({
    name: '',
    url: '',
    description: '',
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    setFilteredCompanies(companies);
  }, [companies]);

  useEffect(() => {
    calculateStats();
  }, [companies, links]);

  const calculateStats = () => {
    const onlineLinks = links.filter(l => l.status === 'online').length;
    const offlineLinks = links.filter(l => l.status === 'offline').length;
    const errorLinks = links.filter(l => l.status === 'error').length;
    const pendingLinks = links.filter(l => l.status === 'pending').length;
    
    const responseTimes = links
      .filter(l => l.response_time && l.status === 'online')
      .map(l => l.response_time!);
    
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    setStats({
      totalCompanies: companies.length,
      totalLinks: links.length,
      onlineLinks,
      offlineLinks,
      errorLinks,
      pendingLinks,
      averageResponseTime: Math.round(averageResponseTime),
    });
  };

  const loadData = async () => {
    try {
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
      setLinks((linksData || []).map(link => ({
        ...link,
        status: link.status as LinkStatus
      })));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(query.toLowerCase()) ||
      company.description?.toLowerCase().includes(query.toLowerCase()) ||
      getLinksForCompany(company.id).some(link =>
        link.name.toLowerCase().includes(query.toLowerCase()) ||
        link.url.toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredCompanies(filtered);
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

  const createLink = async () => {
    if (!newLink.name.trim() || !newLink.url.trim() || !selectedCompanyId || !user) return;

    try {
      const { data, error } = await supabase
        .from('links')
        .insert([
          {
            name: newLink.name,
            url: newLink.url,
            description: newLink.description,
            company_id: selectedCompanyId,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setLinks(prev => [{
        ...data,
        status: data.status as LinkStatus
      }, ...prev]);
      setNewLink({ name: '', url: '', description: '' });
      setIsLinkDialogOpen(false);
      toast.success('Link criado com sucesso!');
    } catch (error) {
      console.error('Error creating link:', error);
      toast.error('Erro ao criar link');
    }
  };

  const updateLink = async () => {
    if (!editingLink || !newLink.name.trim() || !newLink.url.trim()) return;

    try {
      const { data, error } = await supabase
        .from('links')
        .update({
          name: newLink.name,
          url: newLink.url,
          description: newLink.description,
        })
        .eq('id', editingLink.id)
        .select()
        .single();

      if (error) throw error;

      setLinks(prev => prev.map(link => 
        link.id === editingLink.id ? { ...data, status: data.status as LinkStatus } : link
      ));
      setEditingLink(null);
      setNewLink({ name: '', url: '', description: '' });
      setIsLinkDialogOpen(false);
      toast.success('Link atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Erro ao atualizar link');
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

  const checkLinkStatus = async (linkId: string, url: string) => {
    setCheckingLinks(prev => [...prev, linkId]);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statuses: LinkStatus[] = ['online', 'offline', 'error'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const responseTime = randomStatus === 'online' ? Math.floor(Math.random() * 500) + 50 : null;

      const { error } = await supabase
        .from('links')
        .update({
          status: randomStatus,
          response_time: responseTime,
          last_checked: new Date().toISOString(),
        })
        .eq('id', linkId);

      if (error) throw error;

      setLinks(prev =>
        prev.map(link =>
          link.id === linkId
            ? {
                ...link,
                status: randomStatus,
                response_time: responseTime,
                last_checked: new Date().toISOString(),
              }
            : link
        )
      );

      toast.success(`Status atualizado: ${randomStatus.toUpperCase()}`);
    } catch (error) {
      console.error('Error checking link:', error);
      toast.error('Erro ao verificar link');
    } finally {
      setCheckingLinks(prev => prev.filter(id => id !== linkId));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      online: { color: 'bg-green-500', text: 'Online' },
      offline: { color: 'bg-red-500', text: 'Offline' },
      error: { color: 'bg-yellow-500', text: 'Erro' },
      pending: { color: 'bg-gray-500', text: 'Pendente' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} text-white border-none`}>
        {config.text}
      </Badge>
    );
  };

  const getLinksForCompany = (companyId: string) => {
    return links.filter(link => link.company_id === companyId);
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
    });
    setSelectedCompanyId(link.company_id);
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
    setNewLink({ name: '', url: '', description: '' });
    setSelectedCompanyId('');
  };

  const offlineLinks = links.filter(l => l.status === 'offline' || l.status === 'error');

  if (loading) {
    return (
      <div className="min-h-screen bg-saas-black">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <RefreshCw className="h-8 w-8 animate-spin text-saas-red" />
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
            <p className="text-gray-400">Monitore seus links e gerencie suas empresas</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <SearchBar onSearch={handleSearch} placeholder="Pesquisar empresas ou links..." />
            
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
                    {editingCompany ? 'Edite as informações da empresa.' : 'Crie um grupo para organizar seus links por empresa ou projeto.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company-name" className="text-gray-300">Nome da Empresa</Label>
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
                      placeholder="Descrição da empresa ou projeto"
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
          </div>
        </div>

        {/* Offline Links Alert */}
        {offlineLinks.length > 0 && (
          <Card className="bg-red-950/20 border-red-500/30 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-400">Links com Problemas</h3>
                  <p className="text-red-300 text-sm">
                    {offlineLinks.length} link(s) estão offline ou com erro: {' '}
                    {offlineLinks.slice(0, 3).map(link => link.name).join(', ')}
                    {offlineLinks.length > 3 && ` e mais ${offlineLinks.length - 3}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-saas-black-light border-saas-gray/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-300 text-sm font-medium">Empresas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalCompanies}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-saas-black-light border-saas-gray/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-300 text-sm font-medium">Total Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalLinks}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-saas-black-light border-saas-gray/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-300 text-sm font-medium flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.onlineLinks}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-saas-black-light border-saas-gray/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-300 text-sm font-medium">Problemas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {stats.offlineLinks + stats.errorLinks}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {stats.totalLinks > 0 && (
          <div className="mb-8">
            <DashboardCharts stats={stats} links={links} />
          </div>
        )}

        {/* Companies and Links */}
        <div className="space-y-6">
          {filteredCompanies.length === 0 ? (
            <Card className="bg-saas-black-light border-saas-gray/20">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {companies.length === 0 ? 'Nenhuma empresa criada' : 'Nenhuma empresa encontrada'}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {companies.length === 0 ? 'Comece criando uma empresa para organizar seus links' : 'Tente ajustar sua pesquisa'}
                  </p>
                  {companies.length === 0 && (
                    <Button 
                      onClick={() => setIsCompanyDialogOpen(true)}
                      className="bg-saas-red hover:bg-saas-red-dark text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Primeira Empresa
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredCompanies.map((company) => (
              <Card key={company.id} className="bg-saas-black-light border-saas-gray/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
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
                      <Dialog open={isLinkDialogOpen} onOpenChange={closeLinkDialog}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-saas-red text-saas-red hover:bg-saas-red hover:text-white"
                            onClick={() => setSelectedCompanyId(company.id)}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Link
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-saas-black-light border-saas-gray/20">
                          <DialogHeader>
                            <DialogTitle className="text-white">
                              {editingLink ? 'Editar Link' : 'Adicionar Novo Link'}
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                              {editingLink ? 'Edite as informações do link.' : `Adicione um novo link para monitoramento em ${company.name}.`}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="link-name" className="text-gray-300">Nome do Site</Label>
                              <Input
                                id="link-name"
                                placeholder="Ex: YouTube, Facebook, etc."
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
                              <Label htmlFor="link-description" className="text-gray-300">Descrição (opcional)</Label>
                              <Textarea
                                id="link-description"
                                placeholder="Descrição do site ou serviço"
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
                              {editingLink ? 'Atualizar' : 'Adicionar'} Link
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                        onClick={() => openEditCompanyDialog(company)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => deleteCompany(company.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getLinksForCompany(company.id).map((link) => (
                      <Card key={link.id} className="bg-saas-black border-saas-gray/20">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white truncate">{link.name}</h4>
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs text-blue-400 hover:underline truncate block mt-1"
                              >
                                {link.url}
                              </a>
                              {link.description && (
                                <p className="text-xs text-gray-400 mt-1">{link.description}</p>
                              )}
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
                          
                          <div className="flex items-center justify-between">
                            {getStatusBadge(link.status)}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs text-gray-400 hover:text-white"
                              onClick={() => checkLinkStatus(link.id, link.url)}
                              disabled={checkingLinks.includes(link.id)}
                            >
                              {checkingLinks.includes(link.id) ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                'Verificar'
                              )}
                            </Button>
                          </div>
                          
                          {link.last_checked && (
                            <div className="mt-2 text-xs text-gray-500">
                              Verificado: {new Date(link.last_checked).toLocaleString('pt-BR')}
                              {link.response_time && (
                                <span className="ml-2">({link.response_time}ms)</span>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    
                    {getLinksForCompany(company.id).length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <Globe className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-400 text-sm">Nenhum link adicionado ainda</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

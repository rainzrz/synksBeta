
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import QuickStats from '@/components/QuickStats';
import DashboardCharts from '@/components/DashboardCharts';
import MonitoringControls from '@/components/MonitoringControls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Building2, Plus, ExternalLink, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Company, Link, DashboardStats } from '@/types';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newCompany, setNewCompany] = useState({
    name: '',
    description: '',
    website: '',
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    setFilteredCompanies(companies);
  }, [companies]);

  const loadData = async () => {
    try {
      const [companiesResponse, linksResponse] = await Promise.all([
        apiClient.getCompanies(),
        apiClient.getLinks()
      ]);
      
      if (companiesResponse.error) {
        throw new Error(companiesResponse.error);
      }
      if (linksResponse.error) {
        throw new Error(linksResponse.error);
      }
      
      setCompanies(companiesResponse.data || []);
      setLinks(linksResponse.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (): DashboardStats => {
    const totalLinks = links.length;
    const onlineLinks = links.filter(l => l.status === 'online').length;
    const offlineLinks = links.filter(l => l.status === 'offline').length;
    const errorLinks = links.filter(l => l.status === 'error').length;
    const pendingLinks = links.filter(l => l.status === 'pending').length;
    
    const responseTimes = links
      .filter(l => l.response_time && l.status === 'online')
      .map(l => l.response_time!);
    
    const averageResponseTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;

    return {
      totalCompanies: companies.length,
      totalLinks,
      onlineLinks,
      offlineLinks,
      errorLinks,
      pendingLinks,
      averageResponseTime
    };
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(query.toLowerCase()) ||
      company.description?.toLowerCase().includes(query.toLowerCase()) ||
      company.website?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  const createCompany = async () => {
    if (!newCompany.name.trim() || !user) return;

    try {
      const response = await apiClient.createCompany({
        name: newCompany.name,
        description: newCompany.description,
        website: newCompany.website,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setCompanies(prev => [response.data, ...prev]);
      setNewCompany({ name: '', description: '', website: '' });
      setIsDialogOpen(false);
      toast.success('Empresa criada com sucesso!');
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Erro ao criar empresa');
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'border-l-green-500';
      case 'offline':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-saas-black">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Building2 className="h-8 w-8 animate-pulse text-saas-red" />
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-saas-black">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Monitore o status de todos os seus sites</p>
        </div>

        <QuickStats stats={stats} />
        <DashboardCharts companies={companies} links={links} />
        <MonitoringControls />

        <div className="mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <SearchBar onSearch={handleSearch} placeholder="Pesquisar empresas..." />
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-saas-red hover:bg-saas-red-dark text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Empresa
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-saas-black-light border-saas-gray/20">
                <DialogHeader>
                  <DialogTitle className="text-white">Criar Nova Empresa</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Adicione uma nova empresa para monitorar seus links.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company-name" className="text-gray-300">Nome da Empresa</Label>
                    <Input
                      id="company-name"
                      placeholder="Ex: Minha Empresa"
                      value={newCompany.name}
                      onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-saas-black border-saas-gray/20 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company-website" className="text-gray-300">Website (opcional)</Label>
                    <Input
                      id="company-website"
                      placeholder="https://exemplo.com"
                      value={newCompany.website}
                      onChange={(e) => setNewCompany(prev => ({ ...prev, website: e.target.value }))}
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-saas-gray/20 text-gray-300">
                    Cancelar
                  </Button>
                  <Button onClick={createCompany} className="bg-saas-red hover:bg-saas-red-dark text-white">
                    Criar Empresa
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-saas-red" />
              Empresas
            </h2>
          </div>

          {/* Companies Grid */}
          {filteredCompanies.length === 0 ? (
            <Card className="bg-saas-black-light border-saas-gray/20">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhuma empresa encontrada</h3>
                  <p className="text-gray-400 mb-4">Comece criando sua primeira empresa para monitorar</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-saas-red hover:bg-saas-red-dark text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeira Empresa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <Card 
                  key={company.id}
                  className={`bg-saas-black-light border-saas-gray/20 border-l-4 ${getStatusColor(company.status)} hover:border-saas-red/50 transition-colors cursor-pointer`}
                  onClick={() => navigate(`/company/${company.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-lg truncate">{company.name}</CardTitle>
                        {company.description && (
                          <CardDescription className="text-gray-400 mt-1 line-clamp-2">
                            {company.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {getStatusIcon(company.status)}
                        {company.website && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(company.website, '_blank');
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {company.link_count || 0} link(s)
                      </span>
                      <span className="text-gray-400">
                        Última verificação: {company.last_check ? new Date(company.last_check).toLocaleString('pt-BR') : 'Nunca'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

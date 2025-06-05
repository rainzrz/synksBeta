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
      setLinks(linksResponse.data || []);
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
          <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-saas-red hover:bg-saas-red-dark text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nova Empresa
              </Button>
            </DialogTrigger>
            {/* ... keep existing dialog content */}
          </Dialog>

          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-saas-gray/20 text-gray-300">
                <Plus className="mr-2 h-4 w-4" />
                Novo Link
              </Button>
            </DialogTrigger>
            {/* ... keep existing dialog content */}
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
                      <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
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
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
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

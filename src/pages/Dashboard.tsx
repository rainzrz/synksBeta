
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client, Group, Link, LinkStatus } from "@/types";
import LinkStatusBadge from "@/components/LinkStatusBadge";
import { PlusIcon, LinkIcon, UsersIcon, FolderIcon, AlertCircleIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalGroups: 0,
    totalLinks: 0,
    onlineLinks: 0,
    offlineLinks: 0,
    errorLinks: 0
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulated data
        const demoClients: Client[] = [
          { id: '1', name: 'Cliente A', createdAt: new Date() },
          { id: '2', name: 'Cliente B', createdAt: new Date() }
        ];

        const demoGroups: Group[] = [
          { id: '1', name: 'Base de Produção', clientId: '1', createdAt: new Date() },
          { id: '2', name: 'Base de Teste', clientId: '1', createdAt: new Date() },
          { id: '3', name: 'Base Principal', clientId: '2', createdAt: new Date() }
        ];

        const demoLinks: Link[] = [
          { 
            id: '1', 
            url: 'https://youtube.com', 
            name: 'Youtube',
            status: 'online', 
            groupId: '1', 
            createdAt: new Date(),
            lastChecked: new Date(),
            responseTime: 120
          },
          { 
            id: '2', 
            url: 'https://invalidsite1234567890.com', 
            name: 'Sistema Inativo',
            description: 'Este é um exemplo de sistema inativo',
            status: 'offline', 
            groupId: '1', 
            createdAt: new Date(),
            lastChecked: new Date(),
            downtime: {
              since: new Date(Date.now() - 3600000),
              duration: '1 hora'
            }
          },
          { 
            id: '3', 
            url: 'https://github.com', 
            name: 'Github',
            status: 'online', 
            groupId: '2', 
            createdAt: new Date(),
            lastChecked: new Date(),
            responseTime: 85
          },
          { 
            id: '4', 
            url: 'http://localhost:3000', 
            name: 'Sistema Local',
            status: 'error', 
            groupId: '2', 
            createdAt: new Date(),
            lastChecked: new Date()
          },
          { 
            id: '5', 
            url: 'https://google.com', 
            name: 'Google',
            status: 'online', 
            groupId: '3', 
            createdAt: new Date(),
            lastChecked: new Date(),
            responseTime: 45
          }
        ];

        setClients(demoClients);
        setGroups(demoGroups);
        setLinks(demoLinks);
        
        // Calculate statistics
        setStats({
          totalClients: demoClients.length,
          totalGroups: demoGroups.length,
          totalLinks: demoLinks.length,
          onlineLinks: demoLinks.filter(link => link.status === 'online').length,
          offlineLinks: demoLinks.filter(link => link.status === 'offline').length,
          errorLinks: demoLinks.filter(link => link.status === 'error').length
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Erro ao carregar dados');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const checkLink = (linkId: string) => {
    // Simulate checking link status
    setLinks(prevLinks => 
      prevLinks.map(link => 
        link.id === linkId 
          ? { ...link, status: 'loading' as LinkStatus } 
          : link
      )
    );

    setTimeout(() => {
      const randomStatus: LinkStatus[] = ['online', 'offline', 'error'];
      const newStatus = randomStatus[Math.floor(Math.random() * randomStatus.length)];
      
      setLinks(prevLinks => 
        prevLinks.map(link => 
          link.id === linkId
            ? { 
                ...link, 
                status: newStatus,
                lastChecked: new Date(),
                responseTime: newStatus === 'online' ? Math.floor(Math.random() * 200) + 30 : undefined,
                downtime: newStatus === 'offline' 
                  ? { 
                      since: new Date(),
                      duration: 'Recente' 
                    } 
                  : undefined
              } 
            : link
        )
      );

      // Update stats
      setStats(prev => {
        const updatedLinks = links.map(link => 
          link.id === linkId ? { ...link, status: newStatus } : link
        );
        
        return {
          ...prev,
          onlineLinks: updatedLinks.filter(link => link.status === 'online').length,
          offlineLinks: updatedLinks.filter(link => link.status === 'offline').length,
          errorLinks: updatedLinks.filter(link => link.status === 'error').length
        };
      });

      toast.success(`Status do link verificado: ${newStatus.toUpperCase()}`);
    }, 2000);
  };

  const getClientNameById = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente Desconhecido';
  };

  const getGroupNameById = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : 'Grupo Desconhecido';
  };
  
  const getClientIdByGroupId = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.clientId : '';
  };

  const getLinksForGroup = (groupId: string) => {
    return links.filter(link => link.groupId === groupId);
  };

  const getAllGroupsForClient = (clientId: string) => {
    return groups.filter(group => group.clientId === clientId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {user?.role === 'editor' && (
            <Button onClick={() => navigate("/add-client")}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-violet-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <UsersIcon className="mr-2 h-4 w-4" />
                Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalClients}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <FolderIcon className="mr-2 h-4 w-4" />
                Grupos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalGroups}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <LinkIcon className="mr-2 h-4 w-4" />
                Links Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.onlineLinks} / {stats.totalLinks}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-500 to-rose-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <AlertCircleIcon className="mr-2 h-4 w-4" />
                Links Com Problemas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.offlineLinks + stats.errorLinks}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Client Groups */}
        <div className="space-y-8">
          {clients.map(client => (
            <div key={client.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{client.name}</h2>
                {user?.role === 'editor' && (
                  <div className="space-x-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/client/${client.id}/new-group`)}
                    >
                      <PlusIcon className="mr-1 h-3 w-3" /> Grupo
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/client/${client.id}/edit`)}
                    >
                      Editar Cliente
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {getAllGroupsForClient(client.id).map(group => (
                  <div key={group.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-700">{group.name}</h3>
                      {user?.role === 'editor' && (
                        <div className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/group/${group.id}/new-link`)}
                          >
                            <PlusIcon className="mr-1 h-3 w-3" /> Link
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/group/${group.id}/edit`)}
                          >
                            Editar Grupo
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getLinksForGroup(group.id).map(link => (
                        <Card key={link.id} className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-base font-medium">{link.name}</h4>
                                {link.description && (
                                  <p className="text-sm text-gray-500 mt-1">{link.description}</p>
                                )}
                                <a 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-xs text-blue-500 hover:underline truncate block mt-1 max-w-[200px]"
                                >
                                  {link.url}
                                </a>
                              </div>
                              <LinkStatusBadge 
                                status={link.status} 
                                lastChecked={link.lastChecked} 
                                downtime={link.downtime} 
                              />
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-2 flex justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => checkLink(link.id)}
                              disabled={link.status === 'loading'}
                            >
                              {link.status === 'loading' ? 'Verificando...' : 'Verificar Status'}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    {getLinksForGroup(group.id).length === 0 && (
                      <p className="text-gray-500 text-center py-4 italic">
                        Nenhum link cadastrado neste grupo.
                      </p>
                    )}
                  </div>
                ))}
                
                {getAllGroupsForClient(client.id).length === 0 && (
                  <p className="text-gray-500 text-center py-4 italic">
                    Nenhum grupo cadastrado para este cliente.
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {clients.length === 0 && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-xl text-gray-500 mb-4">
                Nenhum cliente cadastrado
              </p>
              {user?.role === 'editor' && (
                <Button onClick={() => navigate('/add-client')}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Cliente
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

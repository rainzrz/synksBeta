
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, Globe, ExternalLink, Edit2, Trash2, Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

export default function Company() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [linkForm, setLinkForm] = useState({ name: '', url: '', description: '' });

  useEffect(() => {
    if (user && id) {
      loadCompanyData();
    }
  }, [user, id]);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      
      // Load company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (companyError) throw companyError;

      // Load company links
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('company_id', id)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (linksError) throw linksError;

      setCompany(companyData);
      setLinks((linksData || []).map(link => ({
        ...link,
        status: link.status as 'online' | 'offline' | 'error' | 'pending'
      })));
    } catch (error) {
      console.error('Error loading company data:', error);
      toast.error('Erro ao carregar dados da empresa');
      navigate('/dashboard');
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

  const handleCreateLink = async () => {
    if (!linkForm.name.trim() || !linkForm.url.trim()) {
      toast.error('Nome e URL são obrigatórios');
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
          company_id: id,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setLinks(prev => [{
        ...data,
        status: data.status as 'online' | 'offline' | 'error' | 'pending'
      }, ...prev]);
      setLinkForm({ name: '', url: '', description: '' });
      setShowLinkDialog(false);
      toast.success('Link criado com sucesso!');
    } catch (error) {
      console.error('Error creating link:', error);
      toast.error('Erro ao criar link');
    }
  };

  const handleUpdateLink = async () => {
    if (!editingLink || !linkForm.name.trim() || !linkForm.url.trim()) return;

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
      setLinkForm({ name: '', url: '', description: '' });
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

  const openLinkDialog = (link?: Link) => {
    if (link) {
      setEditingLink(link);
      setLinkForm({ 
        name: link.name, 
        url: link.url, 
        description: link.description || ''
      });
    } else {
      setEditingLink(null);
      setLinkForm({ name: '', url: '', description: '' });
    }
    setShowLinkDialog(true);
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

  if (!company) {
    return (
      <div className="min-h-screen bg-saas-black">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <p className="text-white text-center">Empresa não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-saas-black">
      <Navbar />

      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{company.name}</h1>
            {company.description && (
              <p className="text-gray-400 mt-2">{company.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Links ({links.length})</h2>
          <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => openLinkDialog()} className="bg-saas-red hover:bg-saas-red-dark text-white">
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

        {links.length === 0 ? (
          <Card className="bg-saas-black-light border-saas-gray/20">
            <CardContent className="p-8">
              <div className="text-center">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Nenhum link cadastrado para esta empresa</p>
                <Button
                  onClick={() => openLinkDialog()}
                  className="bg-saas-red hover:bg-saas-red-dark text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Link
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {links.map(link => (
              <Card 
                key={link.id} 
                className="bg-saas-black-light border-saas-gray/20 cursor-pointer hover:border-saas-red/40 transition-colors"
                onClick={() => window.open(link.url, '_blank')}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{link.name}</CardTitle>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          openLinkDialog(link);
                        }}
                        className="text-gray-400 hover:text-white h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLink(link);
                        }}
                        className="text-gray-400 hover:text-red-400 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(link.status)}
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-saas-red text-sm truncate">{link.url}</p>
                    {link.description && (
                      <p className="text-gray-400 text-sm">{link.description}</p>
                    )}
                    {link.response_time && (
                      <p className="text-gray-500 text-xs">
                        Tempo de resposta: {link.response_time}ms
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Wrench, Plus, Trash2, Edit, ExternalLink, Settings } from 'lucide-react';
import { Tool } from '@/types';

export default function Tools() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  const [newTool, setNewTool] = useState({
    name: '',
    url: '',
    description: '',
    category: '',
    icon: '',
  });

  const categories = [
    'Automação',
    'Monitoramento',
    'Análise',
    'Desenvolvimento',
    'Comunicação',
    'Produtividade',
    'Outros'
  ];

  useEffect(() => {
    if (user) {
      loadTools();
    }
  }, [user]);

  useEffect(() => {
    setFilteredTools(tools);
  }, [tools]);

  const loadTools = async () => {
    try {
      // Using any type temporarily until Supabase types are updated
      const { data, error } = await (supabase as any)
        .from('tools')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Error loading tools:', error);
      toast.error('Erro ao carregar ferramentas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTools(tools);
      return;
    }

    const filtered = tools.filter(tool =>
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description?.toLowerCase().includes(query.toLowerCase()) ||
      tool.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTools(filtered);
  };

  const createTool = async () => {
    if (!newTool.name.trim() || !newTool.url.trim() || !user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('tools')
        .insert([
          {
            name: newTool.name,
            url: newTool.url,
            description: newTool.description,
            category: newTool.category || 'Outros',
            icon: newTool.icon,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTools(prev => [data, ...prev]);
      setNewTool({ name: '', url: '', description: '', category: '', icon: '' });
      setIsDialogOpen(false);
      toast.success('Ferramenta criada com sucesso!');
    } catch (error) {
      console.error('Error creating tool:', error);
      toast.error('Erro ao criar ferramenta');
    }
  };

  const updateTool = async () => {
    if (!editingTool || !newTool.name.trim() || !newTool.url.trim()) return;

    try {
      const { data, error } = await (supabase as any)
        .from('tools')
        .update({
          name: newTool.name,
          url: newTool.url,
          description: newTool.description,
          category: newTool.category || 'Outros',
          icon: newTool.icon,
        })
        .eq('id', editingTool.id)
        .select()
        .single();

      if (error) throw error;

      setTools(prev => prev.map(tool => 
        tool.id === editingTool.id ? data : tool
      ));
      setEditingTool(null);
      setNewTool({ name: '', url: '', description: '', category: '', icon: '' });
      setIsDialogOpen(false);
      toast.success('Ferramenta atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating tool:', error);
      toast.error('Erro ao atualizar ferramenta');
    }
  };

  const deleteTool = async (toolId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('tools')
        .delete()
        .eq('id', toolId);

      if (error) throw error;

      setTools(prev => prev.filter(t => t.id !== toolId));
      toast.success('Ferramenta excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Erro ao excluir ferramenta');
    }
  };

  const openEditDialog = (tool: Tool) => {
    setEditingTool(tool);
    setNewTool({
      name: tool.name,
      url: tool.url,
      description: tool.description || '',
      category: tool.category,
      icon: tool.icon || '',
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTool(null);
    setNewTool({ name: '', url: '', description: '', category: '', icon: '' });
  };

  const toolsByCategory = filteredTools.reduce((acc, tool) => {
    const category = tool.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-saas-black">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Settings className="h-8 w-8 animate-spin text-saas-red" />
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
            <h1 className="text-3xl font-bold text-white mb-2">Ferramentas</h1>
            <p className="text-gray-400">Gerencie suas ferramentas e recursos</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <SearchBar onSearch={handleSearch} placeholder="Pesquisar ferramentas..." />
            
            <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
              <DialogTrigger asChild>
                <Button className="bg-saas-red hover:bg-saas-red-dark text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Ferramenta
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-saas-black-light border-saas-gray/20">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingTool ? 'Editar Ferramenta' : 'Criar Nova Ferramenta'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {editingTool ? 'Edite as informações da ferramenta.' : 'Adicione uma nova ferramenta ao seu arsenal.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tool-name" className="text-gray-300">Nome</Label>
                    <Input
                      id="tool-name"
                      placeholder="Ex: N8N, Uptime Kuma, etc."
                      value={newTool.name}
                      onChange={(e) => setNewTool(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-saas-black border-saas-gray/20 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tool-url" className="text-gray-300">URL</Label>
                    <Input
                      id="tool-url"
                      placeholder="https://exemplo.com"
                      value={newTool.url}
                      onChange={(e) => setNewTool(prev => ({ ...prev, url: e.target.value }))}
                      className="bg-saas-black border-saas-gray/20 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tool-category" className="text-gray-300">Categoria</Label>
                    <Select
                      value={newTool.category}
                      onValueChange={(value) => setNewTool(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="bg-saas-black border-saas-gray/20 text-white">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent className="bg-saas-black-light border-saas-gray/20">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="text-white">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tool-description" className="text-gray-300">Descrição (opcional)</Label>
                    <Textarea
                      id="tool-description"
                      placeholder="Descrição da ferramenta"
                      value={newTool.description}
                      onChange={(e) => setNewTool(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-saas-black border-saas-gray/20 text-white"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={closeDialog} className="border-saas-gray/20 text-gray-300">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={editingTool ? updateTool : createTool} 
                    className="bg-saas-red hover:bg-saas-red-dark text-white"
                  >
                    {editingTool ? 'Atualizar' : 'Criar'} Ferramenta
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tools by Category */}
        <div className="space-y-8">
          {Object.keys(toolsByCategory).length === 0 ? (
            <Card className="bg-saas-black-light border-saas-gray/20">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhuma ferramenta encontrada</h3>
                  <p className="text-gray-400 mb-4">Comece adicionando suas primeiras ferramentas</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-saas-red hover:bg-saas-red-dark text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Ferramenta
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            Object.entries(toolsByCategory).map(([category, categoryTools]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-saas-red" />
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryTools.map((tool) => (
                    <Card key={tool.id} className="bg-saas-black-light border-saas-gray/20">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{tool.name}</h4>
                            <a 
                              href={tool.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs text-blue-400 hover:underline truncate block mt-1"
                            >
                              {tool.url}
                            </a>
                            {tool.description && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                              onClick={() => window.open(tool.url, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300"
                              onClick={() => openEditDialog(tool)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                              onClick={() => deleteTool(tool.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

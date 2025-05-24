
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Users, Clock, Shield, BarChart3, Zap, CheckCircle, AlertTriangle, Search, Download } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header/Navigation */}
      <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Monitor className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Synks</h1>
          </div>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 text-lg">
            Monitoramento Inteligente
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Synks: Monitoramento
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Centralizado </span>
            de Links
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Tenha todos os seus links importantes sob controle, com status em tempo real! 
            Monitore sistemas de clientes, ERPs e ferramentas críticas de forma automatizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg">
              Experimente o Synks
            </Button>
            <Button variant="outline" size="lg" className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3 text-lg">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                O Problema que Você Enfrenta
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong>Verificação manual demorada</strong> de múltiplos links críticos
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong>Identificação tardia</strong> de problemas de acesso aos sistemas
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong>Informações descentralizadas</strong> sobre links e status
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    <strong>Ineficiência operacional</strong> para equipes de TI e suporte
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl">
              <div className="text-center">
                <div className="text-4xl mb-4">😰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Equipes Sobrecarregadas
                </h3>
                <p className="text-gray-600">
                  Gerenciar manualmente dezenas de links críticos consome tempo valioso 
                  e deixa problemas passarem despercebidos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              A Solução: Synks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Centralize, automatize e monitore todos os seus links críticos em uma única plataforma inteligente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader>
                <Monitor className="h-12 w-12 mb-4" />
                <CardTitle>Monitoramento Proativo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-100">
                  Identifique problemas antes que seus clientes os reportem
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader>
                <BarChart3 className="h-12 w-12 mb-4" />
                <CardTitle>Centralização Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">
                  Todos os links, descrições e notas em um só lugar
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
              <CardHeader>
                <Zap className="h-12 w-12 mb-4" />
                <CardTitle>Eficiência Máxima</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-100">
                  Reduza drasticamente o tempo em verificações manuais
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-teal-500 to-teal-600 text-white">
              <CardHeader>
                <Shield className="h-12 w-12 mb-4" />
                <CardTitle>Controle de Acesso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-teal-100">
                  Segurança com diferentes níveis de permissão
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa para monitorar e gerenciar seus links críticos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Intuitivo</h3>
              <p className="text-gray-600">
                Estatísticas em tempo real e lista de itens que precisam de atenção
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestão de Clientes</h3>
              <p className="text-gray-600">
                Organize e gerencie múltiplos clientes e seus links associados
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Monitoramento Automático</h3>
              <p className="text-gray-600">
                Verificação periódica e automática do status de todas as URLs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verificação Manual</h3>
              <p className="text-gray-600">
                Teste links específicos sob demanda com feedback instantâneo
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Busca Global</h3>
              <p className="text-gray-600">
                Encontre rapidamente clientes ou ferramentas específicas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Import/Export</h3>
              <p className="text-gray-600">
                Importe e exporte dados facilmente através de arquivos CSV
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ideal Para
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Monitor className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Empresas de TI</h3>
                <p className="text-sm text-gray-600">
                  Prestadores de suporte a múltiplos clientes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Equipes de Suporte</h3>
                <p className="text-sm text-gray-600">
                  Help Desk e Suporte Técnico
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-indigo-100 hover:border-indigo-300 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analistas de Sistemas</h3>
                <p className="text-sm text-gray-600">
                  Infraestrutura e monitoramento
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-teal-100 hover:border-teal-300 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Organizações</h3>
                <p className="text-sm text-gray-600">
                  Monitoramento centralizado de recursos web
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Simplifique seu Monitoramento
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Pare de perder tempo com verificações manuais. Centralize seus links e ganhe eficiência com o Synks!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-3 text-lg">
              Experimente Grátis
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
              Agendar Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Monitor className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">Synks</span>
            </div>
            <div className="text-gray-400">
              © 2024 Synks. Monitoramento inteligente para sua empresa.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

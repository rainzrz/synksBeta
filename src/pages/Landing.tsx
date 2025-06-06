import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, BarChart3, Globe, CheckCircle, 
  ShieldCheck, Code, LineChart, TrendingUp, Zap
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-saas-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="text-white text-2xl font-bold flex items-center gap-2">
            <Code className="text-saas-red" />
            <span>Synks</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="text-gray-300 hover:text-white transition-colors">Soluções</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contato</a>
          </div>
          <div className="space-x-3">
            <Link to="/auth">
              <Button variant="outline" className="border-saas-red text-white hover:bg-saas-red hover:text-white">
                Entrar
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-saas-red text-white border-none hover:bg-saas-red-dark">
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="mb-3 animate-fade-in">
          <span className="bg-saas-red/20 border border-saas-red text-white text-xs font-semibold px-4 py-1.5 rounded-full">
            Monitoramento em tempo real
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight gradient-text animate-fade-in">
          Monitore seus sites<br />com inteligência.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in">
          Organize seus links por empresas, monitore status em tempo real e receba 
          alertas instantâneos quando algo sair do ar.
        </p>
        <Link to="/auth">
          <Button size="lg" className="bg-saas-red hover:bg-saas-red-dark text-white px-8 py-6 text-lg rounded-md animate-fade-in">
            Comece gratuitamente <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="bg-saas-black-light py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg bg-gradient-to-br from-saas-black to-saas-black-light border border-saas-gray/20 card-hover">
              <div className="text-4xl font-bold text-saas-red mb-2">99.9%</div>
              <div className="text-green-500 text-sm font-medium mb-2">Uptime</div>
              <div className="text-gray-400">Disponibilidade garantida</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-saas-black to-saas-black-light border border-saas-gray/20 card-hover">
              <div className="text-4xl font-bold text-saas-red mb-2">&lt;2s</div>
              <div className="text-green-500 text-sm font-medium mb-2">Resposta</div>
              <div className="text-gray-400">Tempo de verificação</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-saas-black to-saas-black-light border border-saas-gray/20 card-hover">
              <div className="text-4xl font-bold text-saas-red mb-2">24/7</div>
              <div className="text-green-500 text-sm font-medium mb-2">Monitoramento</div>
              <div className="text-gray-400">Sempre ativo</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-24" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Recursos poderosos para seu negócio</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Monitore todos os seus sites e serviços de forma inteligente e organizada.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-saas-black-light p-8 rounded-lg border border-saas-gray/20 card-hover">
              <div className="bg-saas-red/20 w-14 h-14 rounded-lg flex items-center justify-center text-saas-red mb-6">
                <Globe className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">Organização por Empresas</h3>
              <p className="text-gray-400">Agrupe seus links por empresas e projetos para uma visão clara e organizada de todos os seus monitoramentos.</p>
            </div>
            <div className="bg-saas-black-light p-8 rounded-lg border border-saas-gray/20 card-hover">
              <div className="bg-saas-red/20 w-14 h-14 rounded-lg flex items-center justify-center text-saas-red mb-6">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">Monitoramento Inteligente</h3>
              <p className="text-gray-400">Verificação automática do status dos seus sites com tempo de resposta e histórico detalhado de uptime.</p>
            </div>
            <div className="bg-saas-black-light p-8 rounded-lg border border-saas-gray/20 card-hover">
              <div className="bg-saas-red/20 w-14 h-14 rounded-lg flex items-center justify-center text-saas-red mb-6">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">Alertas Instantâneos</h3>
              <p className="text-gray-400">Receba notificações imediatas quando algum site sair do ar, permitindo ação rápida para resolver problemas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div className="py-20 bg-saas-black-light" id="solutions">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Dashboard completo e intuitivo</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Gerencie todos os seus links e monitore o status em tempo real através de um dashboard moderno e responsivo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-center">Controle Total</h3>
              <p className="text-gray-400 mb-6 text-lg text-center">
                Visualize o status de todos os seus sites, organizados por empresa, com informações detalhadas de desempenho.
              </p>
              <ul className="space-y-4 max-w-2xl mx-auto">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-saas-red mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">CRUD completo de empresas e links com interface moderna</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-saas-red mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Status em tempo real com indicadores visuais claros</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-saas-red mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Perfil personalizado com foto e gestão de senha</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-saas-red mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Estatísticas detalhadas de uptime e performance</span>
                </li>
              </ul>
              <div className="text-center mt-8">
                <Link to="/auth">
                  <Button className="bg-saas-red hover:bg-saas-red-dark text-white">
                    Começar agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-saas-black to-saas-black-light py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para monitorar seus sites?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Comece agora mesmo e tenha controle total sobre o status de todos os seus projetos e sites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-saas-red text-white hover:bg-saas-red-dark px-8 py-6 text-lg">
                  Criar Conta Gratuita
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-saas-black py-16 border-t border-saas-gray/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-lg font-bold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Monitoramento</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Sobre nós</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Suporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Documentação</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Synks</h4>
              <div className="flex items-center gap-2 mb-4">
                <Code className="text-saas-red" />
                <span className="text-2xl font-bold">Synks</span>
              </div>
              <p className="text-gray-400 mb-4">Monitoramento inteligente para negócios modernos.</p>
            </div>
          </div>
          <div className="pt-8 border-t border-saas-gray/20 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Synks. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

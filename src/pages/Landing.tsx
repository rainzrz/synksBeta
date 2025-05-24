
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Globe, CheckCircle, Code } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-white text-2xl font-bold">Synks</div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">Sobre</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Preços</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contato</a>
          </div>
          <div className="space-x-3">
            <Link to="/login">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-violet-600 text-white border-none hover:bg-violet-700">
                Registrar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="mb-2">
          <span className="bg-violet-600 text-white text-xs font-medium px-3 py-1 rounded-full">
            Nova integração lançada
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Impulsione seus<br />rankings com IA.
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Eleve a visibilidade de seu site sem esforço com IA, onde
          tecnologia inteligente se encontra com ferramentas de SEO amigáveis.
        </p>
        <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg rounded-md">
          Comece gratuitamente <ArrowRight className="ml-2" />
        </Button>

        {/* Dashboard Image */}
        <div className="mt-16 relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-blue-500 rounded-lg blur opacity-75"></div>
          <div className="relative bg-black rounded-lg overflow-hidden border border-gray-800">
            <img
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
              alt="Dashboard Synks"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-black py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800">
              <div className="text-4xl font-bold text-violet-500 mb-2">10.15%</div>
              <div className="text-green-500 text-sm font-medium mb-2">+5.25%</div>
              <div className="text-gray-400">Aumento médio na visibilidade</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800">
              <div className="text-4xl font-bold text-violet-500 mb-2">35.6K</div>
              <div className="text-green-500 text-sm font-medium mb-2">+12%</div>
              <div className="text-gray-400">Palavras-chave rastreadas</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800">
              <div className="text-4xl font-bold text-violet-500 mb-2">59.8K</div>
              <div className="text-green-500 text-sm font-medium mb-2">+8.7%</div>
              <div className="text-gray-400">Tráfego mensal</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-24" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Resolva problemas antes que eles afetem seus clientes</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Monitoramento centralizado com dados em tempo real para links críticos de sistemas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border border-gray-800">
              <div className="bg-violet-600 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-6">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Monitoramento Proativo</h3>
              <p className="text-gray-400">Identificação rápida de links com problemas, antes que seus usuários reportem.</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border border-gray-800">
              <div className="bg-violet-600 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-6">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Centralização da Informação</h3>
              <p className="text-gray-400">Todos os links, descrições, URLs e notas relevantes em um só lugar.</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border border-gray-800">
              <div className="bg-violet-600 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-6">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Eficiência Operacional</h3>
              <p className="text-gray-400">Reduza drasticamente o tempo gasto em verificações manuais de status.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="bg-black py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-center text-gray-400 mb-10">Utilizado pelas equipes mais inovadoras do mundo</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center p-4 border border-gray-800 rounded-lg">
              <span className="text-xl font-bold">Acme Corp</span>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-800 rounded-lg">
              <span className="text-xl font-bold">Pulse</span>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-800 rounded-lg">
              <span className="text-xl font-bold">Quantum</span>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-800 rounded-lg">
              <span className="text-xl font-bold">Echo Valley</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Detail Section */}
      <div className="py-24" id="about">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Aproveite o poder da IA para otimizar o monitoramento
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Nossa tecnologia intuitiva torna o monitoramento de links eficaz para todos os níveis de habilidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Dashboard amigável</h3>
              <p className="text-gray-400 mb-6">
                Relatórios completos de status de links e visualizações com um único clique.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span>Visualização em tempo real do status de todos os links</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span>Notificações instantâneas quando um link fica offline</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span>Relatórios detalhados de tempo de resposta e disponibilidade</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <span>Organização por grupos e clientes para melhor gestão</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-blue-500 rounded-lg blur opacity-50"></div>
              <div className="relative bg-black rounded-lg overflow-hidden border border-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
                  alt="Dashboard Synks"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-violet-700 to-blue-700 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Simplifique seu monitoramento. Experimente o Synks!
          </h2>
          <p className="text-xl text-white mb-10 max-w-3xl mx-auto">
            Centralize seus links e ganhe eficiência com o Synks. Nossa plataforma foi desenvolvida para equipes de suporte que precisam manter o controle de diversos links críticos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-6 text-lg rounded-md">
                Criar Conta Gratuita
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-md">
              Agendar Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Integrações</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Preços</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Sobre nós</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Carreiras</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Termos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Licenças</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Synks</h4>
              <div className="text-4xl font-bold text-violet-500 mb-2">Synks</div>
              <p className="text-gray-400">Monitoramento Inteligente de Links</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Synks. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

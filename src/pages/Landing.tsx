
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, BarChart3, Globe, CheckCircle, 
  ShieldCheck, Zap, LineChart, Lock, Code
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
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Preços</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contato</a>
          </div>
          <div className="space-x-3">
            <Link to="/login">
              <Button variant="outline" className="border-saas-red text-white hover:bg-saas-red hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-saas-red text-white border-none hover:bg-saas-red-dark">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="mb-3 animate-fade-in">
          <span className="bg-saas-red/20 border border-saas-red text-white text-xs font-semibold px-4 py-1.5 rounded-full">
            Nova versão disponível
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight gradient-text animate-fade-in">
          Potencialize seu<br />negócio digital.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in">
          Plataforma completa para monitoramento, análise e otimização
          do seu negócio digital com soluções avançadas de tecnologia.
        </p>
        <Button size="lg" className="bg-saas-red hover:bg-saas-red-dark text-white px-8 py-6 text-lg rounded-md animate-fade-in">
          Comece gratuitamente <ArrowRight className="ml-2" />
        </Button>

        {/* Dashboard Preview */}
        <div className="mt-16 relative animate-fade-in">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-saas-red to-saas-red-dark rounded-lg blur opacity-25"></div>
          <div className="relative bg-saas-black-light rounded-lg overflow-hidden border border-saas-gray/20 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
              alt="Dashboard Synks"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-saas-black-light py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg bg-gradient-to-br from-saas-black to-saas-black-light border border-saas-gray/20 card-hover">
              <div className="text-4xl font-bold text-saas-red mb-2">10.15%</div>
              <div className="text-green-500 text-sm font-medium mb-2">+5.25%</div>
              <div className="text-gray-400">Aumento médio na conversão</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-saas-black to-saas-black-light border border-saas-gray/20 card-hover">
              <div className="text-4xl font-bold text-saas-red mb-2">35.6K</div>
              <div className="text-green-500 text-sm font-medium mb-2">+12%</div>
              <div className="text-gray-400">Usuários ativos</div>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-br from-saas-black to-saas-black-light border border-saas-gray/20 card-hover">
              <div className="text-4xl font-bold text-saas-red mb-2">98.7%</div>
              <div className="text-green-500 text-sm font-medium mb-2">+2.3%</div>
              <div className="text-gray-400">Uptime garantido</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-24" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Recursos feitos para otimizar seu desempenho</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Soluções completas para monitoramento e análise em tempo real de todos os aspectos do seu negócio digital.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-saas-black-light p-8 rounded-lg border border-saas-gray/20 card-hover">
              <div className="bg-saas-red/20 w-14 h-14 rounded-lg flex items-center justify-center text-saas-red mb-6">
                <Globe className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">Monitoramento Inteligente</h3>
              <p className="text-gray-400">Detecte problemas antes dos seus usuários com nossa tecnologia de monitoramento preditivo.</p>
            </div>
            <div className="bg-saas-black-light p-8 rounded-lg border border-saas-gray/20 card-hover">
              <div className="bg-saas-red/20 w-14 h-14 rounded-lg flex items-center justify-center text-saas-red mb-6">
                <BarChart3 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">Análise Avançada</h3>
              <p className="text-gray-400">Transforme dados complexos em insights acionáveis com nossos painéis personalizáveis.</p>
            </div>
            <div className="bg-saas-black-light p-8 rounded-lg border border-saas-gray/20 card-hover">
              <div className="bg-saas-red/20 w-14 h-14 rounded-lg flex items-center justify-center text-saas-red mb-6">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">Segurança Máxima</h3>
              <p className="text-gray-400">Proteção completa para seus dados com criptografia de ponta e monitoramento 24/7.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div className="py-20 bg-saas-black-light" id="solutions">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Soluções para cada necessidade</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Independente do tamanho do seu negócio, temos a solução ideal para você.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-saas-red to-saas-red-dark rounded-lg blur opacity-25"></div>
              <div className="relative bg-saas-black rounded-lg overflow-hidden border border-saas-gray/20">
                <img
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
                  alt="Analytics Dashboard"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6">Dashboard Intuitivo</h3>
              <p className="text-gray-400 mb-6 text-lg">
                Visualize todos os dados importantes em um único lugar com nosso dashboard de alta performance.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-saas-red mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Visualização em tempo real de métricas críticas</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-saas-red mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Alertas personalizados para eventos importantes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-saas-red mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Relatórios automatizados enviados por email</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-saas-red mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Integração com mais de 50 plataformas</span>
                </li>
              </ul>
              <Button className="mt-8 bg-saas-red hover:bg-saas-red-dark text-white">
                Saiba mais
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24" id="pricing">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Preços transparentes</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Escolha o plano ideal para seu negócio sem surpresas ou taxas ocultas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-saas-black-light p-8 rounded-lg border border-saas-gray/20 flex flex-col h-full card-hover">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Starter</h3>
                <div className="text-4xl font-bold mb-2">R$49<span className="text-lg font-normal text-gray-400">/mês</span></div>
                <p className="text-gray-400">Perfeito para pequenos negócios</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>5 projetos</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>50.000 requisições/mês</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>Monitoramento básico</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>Email support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full border-saas-red text-white hover:bg-saas-red hover:text-white">
                Começar
              </Button>
            </div>
            
            <div className="bg-saas-black-light p-8 rounded-lg border border-saas-red flex flex-col h-full relative card-hover">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-saas-red text-white text-xs font-bold py-1 px-4 rounded-full">
                MAIS POPULAR
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Professional</h3>
                <div className="text-4xl font-bold mb-2">R$99<span className="text-lg font-normal text-gray-400">/mês</span></div>
                <p className="text-gray-400">Ideal para empresas em crescimento</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>20 projetos</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>500.000 requisições/mês</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>Monitoramento avançado</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>Dashboard personalizado</span>
                </li>
              </ul>
              <Button className="w-full bg-saas-red text-white hover:bg-saas-red-dark">
                Começar
              </Button>
            </div>
            
            <div className="bg-saas-black-light p-8 rounded-lg border border-saas-gray/20 flex flex-col h-full card-hover">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <div className="text-4xl font-bold mb-2">R$299<span className="text-lg font-normal text-gray-400">/mês</span></div>
                <p className="text-gray-400">Para grandes corporações</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>Projetos ilimitados</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>Requisições ilimitadas</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>Monitoramento premium</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>Suporte 24/7</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>API dedicada</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <CheckCircle className="h-5 w-5 text-saas-red mr-3 flex-shrink-0" />
                  <span>Gerente de conta</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full border-saas-red text-white hover:bg-saas-red hover:text-white">
                Contato
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-saas-black to-saas-black-light py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Junte-se a milhares de empresas que já utilizam nossa plataforma para impulsionar seus resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-saas-red text-white hover:bg-saas-red-dark px-8 py-6 text-lg">
                  Criar Conta Gratuita
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-saas-red text-white hover:bg-saas-red/10 px-8 py-6 text-lg">
                Agendar Demo
              </Button>
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
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Integrações</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Preços</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Sobre nós</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Carreiras</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Termos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-saas-red transition-colors">Licenças</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Synks</h4>
              <div className="flex items-center gap-2 mb-4">
                <Code className="text-saas-red" />
                <span className="text-2xl font-bold">Synks</span>
              </div>
              <p className="text-gray-400 mb-4">Tecnologia avançada para negócios modernos.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-saas-red transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-saas-red transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
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

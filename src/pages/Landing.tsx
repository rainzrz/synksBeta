
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600 to-blue-700">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-white text-2xl font-bold">Synks</div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-700">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-white text-blue-700 hover:bg-blue-100">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-white">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Monitoramento Inteligente e Centralizado de Links
            </h1>
            <p className="text-xl mb-8">
              Tenha todos os seus links importantes sob controle, com status em tempo real. Synks ajuda equipes de suporte a monitorar e gerenciar links críticos para sistemas de clientes.
            </p>
            <div className="flex space-x-4">
              <Link to="/register">
                <Button className="bg-white text-blue-700 hover:bg-blue-100 px-8 py-3 text-lg">
                  Começar Agora
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-700 px-8 py-3 text-lg">
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
              alt="Dashboard Synks"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Resolva problemas antes que eles afetem seus clientes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-violet-100 to-blue-100 p-8 rounded-lg shadow-lg">
              <div className="bg-gradient-to-r from-violet-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Monitoramento Proativo</h3>
              <p>Identificação rápida de links com problemas, antes que seus usuários reportem.</p>
            </div>
            <div className="bg-gradient-to-br from-violet-100 to-blue-100 p-8 rounded-lg shadow-lg">
              <div className="bg-gradient-to-r from-violet-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Centralização da Informação</h3>
              <p>Todos os links, descrições, URLs e notas relevantes em um só lugar.</p>
            </div>
            <div className="bg-gradient-to-br from-violet-100 to-blue-100 p-8 rounded-lg shadow-lg">
              <div className="bg-gradient-to-r from-violet-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Eficiência Operacional</h3>
              <p>Reduza drasticamente o tempo gasto em verificações manuais de status.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-violet-700 to-blue-800 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Simplifique seu monitoramento. Experimente o Synks!
          </h2>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Centralize seus links e ganhe eficiência com o Synks. Nossa plataforma foi desenvolvida para equipes de suporte que precisam manter o controle de diversos links críticos.
          </p>
          <Link to="/register">
            <Button className="bg-white text-blue-700 hover:bg-blue-100 px-8 py-4 text-lg">
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl font-bold">Synks</div>
              <p className="text-gray-400">Monitoramento Inteligente de Links</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">Termos</a>
              <a href="#" className="hover:text-blue-400">Privacidade</a>
              <a href="#" className="hover:text-blue-400">Contato</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            &copy; {new Date().getFullYear()} Synks. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

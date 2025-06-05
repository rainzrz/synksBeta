
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Code } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    try {
      await signIn(email, password);
    } catch (error) {
      // Error is handled in the auth context
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-saas-black to-saas-black-light p-4">
      <Card className="w-full max-w-md bg-saas-black-light border-saas-gray/20">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-saas-red" />
              <span className="text-2xl font-bold">Synks</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">Login</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-saas-black border-saas-gray/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
                <Link to="/forgot-password" className="text-sm text-saas-red hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-saas-black border-saas-gray/20 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-saas-red hover:bg-saas-red-dark text-white" disabled={isLoading}>
              {isLoading ? 
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </> : 
                "Entrar"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-400">Não tem uma conta? {" "}
              <Link to="/register" className="text-saas-red hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-saas-red">
            Voltar para página inicial
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;


import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Code } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, isLoading } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    try {
      await signup(email, password, name);
    } catch (error) {
      // Error is handled in the auth context
      console.error("Registration failed:", error);
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
          <CardTitle className="text-2xl font-bold text-center text-white">Criar conta</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Preencha os dados abaixo para criar sua conta no Synks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Nome</Label>
              <Input 
                id="name" 
                placeholder="Seu nome" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="bg-saas-black border-saas-gray/20 text-white"
              />
            </div>
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
              <Label htmlFor="password" className="text-gray-300">Senha</Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Senha</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="bg-saas-black border-saas-gray/20 text-white"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-saas-red hover:bg-saas-red-dark text-white" 
              disabled={isLoading}
            >
              {isLoading ? 
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </> : 
                "Cadastrar"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-400">Já tem uma conta? {" "}
              <Link to="/login" className="text-saas-red hover:underline">
                Faça login
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

export default Register;

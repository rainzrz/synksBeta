
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { SearchIcon, UserIcon, LogOutIcon } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      // Implement search functionality
      console.log(`Searching for: ${search}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="bg-gradient-to-r from-violet-600 to-blue-700 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-white text-xl font-bold">
              Synks
            </Link>
          </div>

          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md mx-6">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-white opacity-70" />
              <Input
                placeholder="Buscar links, grupos ou clientes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/10 border-0 focus-visible:ring-0 text-white pl-8 placeholder:text-white/70"
              />
            </div>
          </form>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-white/20 text-white">
                      {user?.name ? getInitials(user.name) : "SY"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-md p-1 border">
                <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 h-px bg-gray-200" />
                <DropdownMenuItem 
                  className="px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-gray-100 flex items-center"
                  onClick={() => navigate("/profile")}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-gray-100 text-red-600 flex items-center"
                  onClick={() => logout()}
                >
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

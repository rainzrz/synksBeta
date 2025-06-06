
<div align="center">
  <h1>🔗 Monitor de Links</h1>
  <p><strong>Sistema completo de monitoramento de links e websites</strong></p>
  
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite" alt="Vite">
</div>

---

## 📋 Sobre o Projeto

O **Monitor de Links** é uma aplicação web moderna desenvolvida para monitorar a disponibilidade e performance de websites e serviços online. Com uma interface intuitiva e elegante, permite que usuários organizem seus links por empresas e acompanhem o status em tempo real.

### ✨ Funcionalidades Principais

- 🏢 **Gestão de Empresas**: Organize seus links por empresas
- 🔗 **Monitoramento de Links**: Acompanhe status (online/offline/erro)
- ⚡ **Tempo de Resposta**: Monitore a performance dos seus sites
- 👤 **Sistema de Autenticação**: Login seguro com Supabase Auth
- 📊 **Dashboard Intuitivo**: Visualize estatísticas e métricas
- 🎨 **Interface Moderna**: Design responsivo com Tailwind CSS
- 🔔 **Notificações**: Alertas em tempo real sobre mudanças de status

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18.3** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos
- **React Router** - Roteamento client-side
- **TanStack Query** - Gerenciamento de estado server

### Backend & Banco de Dados
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança ao nível de linha

### Outras Ferramentas
- **Lucide React** - Ícones modernos
- **React Hook Form** - Gerenciamento de formulários
- **Sonner** - Sistema de notificações toast
- **Zod** - Validação de schemas

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter instalado:
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- Conta no **Supabase**

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd monitor-de-links
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env.local` na raiz do projeto:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   
   Abra seu navegador e acesse: `http://localhost:5173`

---

## 📦 Scripts Disponíveis

```bash
# Executar em modo de desenvolvimento
npm run dev

# Criar build de produção
npm run build

# Fazer preview do build
npm run preview

# Executar linting
npm run lint
```

---

## 🗃️ Estrutura do Banco de Dados

### Tabelas Principais

#### `companies`
- Armazena informações das empresas
- Relacionada ao usuário autenticado

#### `links`
- Armazena os links para monitoramento
- Relacionada às empresas e usuários
- Campos de status e tempo de resposta

#### `profiles`
- Perfis dos usuários
- Informações adicionais do usuário

---

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:

- **Cores Principais**: 
  - `saas-black` - Fundo principal
  - `saas-red` - Cor de destaque
  - `saas-gray` - Elementos secundários

- **Tipografia**: Sistema de fontes moderno e legível
- **Componentes**: Baseados no shadcn/ui com customizações

---

## 🔧 Configuração do Supabase

### Políticas RLS (Row Level Security)

O projeto utiliza políticas de segurança para garantir que:
- Usuários só vejam suas próprias empresas
- Usuários só gerenciem seus próprios links
- Dados são protegidos ao nível de linha

### Autenticação

- Login com email/senha
- Registro de novos usuários
- Recuperação de senha
- Sessões persistentes

---

## 🚀 Deploy

### Opções de Deploy

1. **Vercel** (Recomendado)
   ```bash
   npm run build
   # Deploy via Vercel CLI ou GitHub integration
   ```

2. **Netlify**
   ```bash
   npm run build
   # Deploy da pasta dist/
   ```

3. **Docker + Nginx**
   - Dockerização completa disponível
   - Configuração para produção incluída

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🆘 Suporte

Se você encontrar algum problema ou tiver sugestões:

1. **Issues**: Abra uma issue no GitHub
2. **Documentação**: Consulte a documentação do Supabase
3. **Comunidade**: Participe da comunidade Lovable no Discord

---

<div align="center">
  <p>Desenvolvido com ❤️ usando <a href="https://lovable.dev">Lovable</a></p>
  
  **[🌐 Ver Demo](https://lovable.dev/projects/3f0cf4db-6c1d-4c9a-b353-38a26742e951) | [📚 Documentação](https://docs.lovable.dev/) | [💬 Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)**
</div>

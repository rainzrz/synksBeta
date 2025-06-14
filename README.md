
# Synks - Plataforma de Gerenciamento de Empresas e Links

## Descrição

Synks é uma plataforma completa para gerenciamento de empresas, links e ferramentas. Permite monitoramento de status de links, organização de recursos por empresa e gestão centralizada de ferramentas.

## Funcionalidades

### 📊 Dashboard
- Visão geral de todas as empresas
- Estatísticas de links e status
- Cards clicáveis para navegação rápida

### 🏢 Gerenciamento de Empresas
- Criação e edição de empresas
- Pesquisa e filtros avançados
- Organização por categorias

### 🔗 Monitoramento de Links
- Verificação automática de status dos links
- Indicadores visuais de saúde (online/offline)
- Organização por empresa
- Histórico de verificações

### 🛠️ Ferramentas
- Catálogo de ferramentas organizadas por categoria
- Cards clicáveis para acesso direto
- Gerenciamento completo (criar, editar, excluir)
- Categorias: Automação, Monitoramento, Análise, Desenvolvimento, Comunicação, Produtividade

### 👤 Perfil de Usuário
- Upload de foto de perfil
- Edição de informações pessoais
- Alteração de senha
- Sistema de autenticação seguro

## Tecnologias

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes de interface
- **React Router** - Navegação
- **TanStack Query** - Gerenciamento de estado e cache
- **React Hook Form** - Formulários
- **Zod** - Validação de dados
- **Vite** - Build tool
- **Sonner** - Notificações toast

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **bcrypt** - Criptografia de senhas

### Infraestrutura
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Proxy reverso

## Instalação

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose

### Com Docker (Recomendado)

1. Clone o repositório:
```bash
git clone <repository-url>
cd systemhaus
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Inicie os serviços:
```bash
docker-compose up -d
```

4. A aplicação estará disponível em `http://localhost`

### Instalação Manual

1. Configure o banco de dados PostgreSQL
2. Execute o script de inicialização: `database/init.sql`
3. Instale as dependências:

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

4. Configure as variáveis de ambiente nos arquivos `.env`
5. Inicie os serviços:

```bash
# Backend (porta 3001)
cd backend
npm start

# Frontend (porta 5173 em dev)
npm run dev
```

## Estrutura do Projeto

```
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizáveis
│   │   └── ui/            # Componentes Shadcn/UI
│   ├── pages/             # Páginas da aplicação
│   ├── contexts/          # Contextos React
│   ├── hooks/             # Hooks customizados
│   ├── lib/               # Utilitários e configurações
│   ├── types/             # Definições TypeScript
│   └── utils/             # Funções utilitárias
├── backend/               # Backend Node.js
│   └── src/
│       ├── routes/        # Rotas da API
│       ├── middleware/    # Middlewares
│       └── config/        # Configurações
├── database/              # Scripts SQL
├── scripts/               # Scripts utilitários
├── nginx.conf             # Configuração Nginx
└── docker-compose.yml     # Orquestração Docker
```

## API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário
- `PUT /api/auth/change-password` - Alteração de senha

### Perfil
- `GET /api/profile` - Obter perfil do usuário
- `PUT /api/profile` - Atualizar perfil

### Empresas
- `GET /api/companies` - Listar empresas
- `POST /api/companies` - Criar empresa
- `PUT /api/companies/:id` - Atualizar empresa
- `DELETE /api/companies/:id` - Excluir empresa

### Links
- `GET /api/links` - Listar todos os links
- `GET /api/links/company/:id` - Links de uma empresa
- `POST /api/links` - Criar link
- `PUT /api/links/:id` - Atualizar link
- `DELETE /api/links/:id` - Excluir link
- `POST /api/links/:id/check` - Verificar status do link

### Ferramentas
- `GET /api/tools` - Listar ferramentas
- `POST /api/tools` - Criar ferramenta
- `PUT /api/tools/:id` - Atualizar ferramenta
- `DELETE /api/tools/:id` - Excluir ferramenta

### Upload
- `POST /api/upload` - Upload de arquivos

## Configuração de Desenvolvimento

### Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/monitor_links
POSTGRES_DB=monitor_links
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123

# JWT
JWT_SECRET=your-jwt-secret-super-secure

# Server
NODE_ENV=development
PORT=3001
```

### Scripts Úteis

```bash
# Desenvolvimento
npm run dev                 # Inicia frontend em modo dev
npm run build              # Build do frontend
npm run preview            # Preview do build

# Backend
cd backend && npm start    # Inicia backend
cd backend && npm run dev  # Backend em modo dev

# Docker
docker-compose up -d       # Inicia todos os serviços
docker-compose logs -f     # Visualiza logs
docker-compose down        # Para todos os serviços
```

## Funcionalidades Principais

### Sistema de Autenticação
- Registro e login de usuários
- Tokens JWT para autenticação
- Middleware de proteção de rotas
- Alteração segura de senhas

### Monitoramento de Links
- Verificação automática de status HTTP
- Indicadores visuais (verde/vermelho)
- Histórico de última verificação
- Organização por empresa

### Gestão de Empresas
- CRUD completo de empresas
- Pesquisa e filtros
- Associação com links
- Contadores de links por empresa

### Upload de Arquivos
- Sistema seguro de upload
- Validação de tipos de arquivo
- Limite de tamanho (10MB)
- Armazenamento local

## URLs de Acesso

- **Frontend**: http://localhost (com Docker) ou http://localhost:5173 (desenvolvimento)
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

## Backup e Deploy

### Backup do Banco
```bash
./scripts/backup.sh
```

### Deploy
```bash
./scripts/deploy.sh
```

## Troubleshooting

### Problemas Comuns

1. **Container não inicia**:
   ```bash
   docker-compose logs nome_do_servico
   ```

2. **Problemas de conexão com banco**:
   ```bash
   docker-compose exec postgres pg_isready -U postgres
   ```

3. **Permissões de scripts**:
   ```bash
   chmod +x scripts/*.sh
   ```

## Licença
Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.


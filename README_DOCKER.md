
# 🐳 Docker Setup - Monitor de Links

Este guia completo irá te ajudar a dockerizar a aplicação e migrar do Supabase para PostgreSQL local.

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Git
- Acesso aos dados do Supabase (para exportar)

## 🚀 Guia de Migração Completo

### 1. Exportar Dados do Supabase

Primeiro, exporte seus dados existentes do Supabase:

```bash
# Configure suas credenciais no script
nano scripts/export-supabase.sh

# Execute o export
chmod +x scripts/export-supabase.sh
./scripts/export-supabase.sh
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite as configurações conforme necessário
nano .env
```

### 3. Iniciar a Aplicação

```bash
# Construir e iniciar todos os containers
docker-compose up -d

# Ou usar o script de deploy
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 4. Verificar a Instalação

```bash
# Verificar status dos containers
docker-compose ps

# Verificar logs
docker-compose logs -f
```

## 📊 Estrutura dos Containers

```
┌─────────────────────────────────────────┐
│                Frontend                 │
│            (Nginx + React)              │
│              Port: 80                   │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│               Backend API               │
│            (Node.js + Express)          │
│              Port: 3001                 │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              PostgreSQL                 │
│            (Database)                   │
│              Port: 5432                 │
└─────────────────────────────────────────┘
```

## 🔧 Comandos Úteis

### Gerenciamento de Containers

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Reconstruir containers
docker-compose build --no-cache

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
```

### Backup e Restore

```bash
# Fazer backup do banco
chmod +x scripts/backup.sh
./scripts/backup.sh

# Restaurar backup
docker-compose exec -T postgres psql -U postgres monitor_links < ./backups/backup_file.sql
```

### Acesso ao Banco de Dados

```bash
# Conectar ao PostgreSQL
docker-compose exec postgres psql -U postgres -d monitor_links

# Ou usando um cliente externo
psql -h localhost -p 5432 -U postgres -d monitor_links
```

## 🌐 URLs de Acesso

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

## 📝 Importar Dados Existentes

Se você já tem dados do Supabase:

```bash
# 1. Certifique-se que os containers estão rodando
docker-compose up -d

# 2. Importe os dados
docker-compose exec -T postgres psql -U postgres monitor_links < ./exports/data.sql
```

## 🔒 Configurações de Segurança

### Para Produção:

1. **Altere as senhas padrão**:
   ```bash
   # No .env, altere:
   POSTGRES_PASSWORD=sua_senha_super_segura
   JWT_SECRET=seu_jwt_secret_muito_seguro_e_longo
   ```

2. **Configure SSL/TLS**:
   - Use proxy reverso (Nginx/Traefik)
   - Configure certificados SSL
   - Ative HTTPS

3. **Firewall e Rede**:
   - Exponha apenas portas necessárias
   - Use redes Docker isoladas
   - Configure firewall do servidor

## 🚨 Troubleshooting

### Container não inicia

```bash
# Verificar logs
docker-compose logs nome_do_servico

# Verificar recursos
docker system df
docker system prune  # Limpar recursos não utilizados
```

### Problemas de Conexão com Banco

```bash
# Verificar se o PostgreSQL está rodando
docker-compose exec postgres pg_isready -U postgres

# Verificar conectividade de rede
docker-compose exec backend ping postgres
```

### Problemas de Permissão

```bash
# Dar permissões aos scripts
chmod +x scripts/*.sh

# Verificar volumes
docker volume ls
docker volume inspect nome_do_volume
```

## 📈 Monitoramento

### Logs

```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs com timestamp
docker-compose logs -f -t

# Últimas 100 linhas
docker-compose logs --tail=100
```

### Recursos

```bash
# Uso de recursos
docker stats

# Espaço em disco
docker system df
```

## 🔄 Atualizações

```bash
# 1. Fazer backup
./scripts/backup.sh

# 2. Parar containers
docker-compose down

# 3. Atualizar código
git pull

# 4. Reconstruir e iniciar
docker-compose build --no-cache
docker-compose up -d
```

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs: `docker-compose logs`
2. Consulte a documentação do Docker
3. Verifique se todas as portas estão disponíveis
4. Confirme que não há conflitos de rede

---

**Próximos Passos:**
- Configure backup automático
- Implemente CI/CD
- Configure monitoramento (Prometheus/Grafana)
- Configure alertas

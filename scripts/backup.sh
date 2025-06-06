
#!/bin/bash

# Backup script for PostgreSQL
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/monitor_links_$TIMESTAMP.sql"

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

echo "📦 Iniciando backup do banco de dados..."

# Fazer backup do PostgreSQL
docker-compose exec -T postgres pg_dump -U postgres monitor_links > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup criado com sucesso: $BACKUP_FILE"
    
    # Manter apenas os últimos 7 backups
    ls -t $BACKUP_DIR/monitor_links_*.sql | tail -n +8 | xargs -r rm
    echo "🧹 Backups antigos removidos (mantendo últimos 7)"
else
    echo "❌ Erro ao criar backup"
    exit 1
fi


#!/bin/bash

# Deploy script for Monitor de Links
echo "🚀 Iniciando deploy do Monitor de Links..."

# Parar containers existentes
echo "📦 Parando containers existentes..."
docker-compose down

# Construir imagens
echo "🔨 Construindo imagens..."
docker-compose build --no-cache

# Iniciar containers
echo "▶️ Iniciando containers..."
docker-compose up -d

# Aguardar containers iniciarem
echo "⏳ Aguardando containers iniciarem..."
sleep 30

# Verificar status
echo "📊 Verificando status dos containers..."
docker-compose ps

# Verificar logs
echo "📝 Últimos logs:"
docker-compose logs --tail=50

echo "✅ Deploy concluído!"
echo "🌐 Aplicação disponível em: http://localhost"
echo "🔗 API disponível em: http://localhost:3001"
echo "🗄️ PostgreSQL disponível em: localhost:5432"

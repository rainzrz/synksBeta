
#!/bin/bash

# Script para exportar dados do Supabase
# Configure suas credenciais do Supabase aqui
SUPABASE_URL="https://hejepezxxevayvaizbke.supabase.co"
SUPABASE_DB_URL="postgresql://postgres:[SUA_SENHA]@db.hejepezxxevayvaizbke.supabase.co:5432/postgres"

echo "📥 Exportando dados do Supabase..."

# Criar diretório de export
mkdir -p ./exports

# Exportar schema
echo "📋 Exportando schema..."
pg_dump --schema-only --no-owner --no-privileges "$SUPABASE_DB_URL" > ./exports/schema.sql

# Exportar dados das tabelas
echo "📊 Exportando dados..."
pg_dump --data-only --no-owner --no-privileges \
  --table=companies \
  --table=links \
  --table=profiles \
  --table=tools \
  "$SUPABASE_DB_URL" > ./exports/data.sql

echo "✅ Export concluído!"
echo "📁 Arquivos salvos em ./exports/"

#!/usr/bin/env bash
# Executa uma única vez para configurar o projeto GCP antes do Terraform
# Uso: bash infra/setup-gcp.sh <PROJECT_ID>

set -euo pipefail

PROJECT_ID="${1:?Informe o PROJECT_ID como argumento}"
REGION="us-central1"
SA_NAME="pi3-github-actions"

echo "==> Configurando projeto: $PROJECT_ID"
gcloud config set project "$PROJECT_ID"

echo "==> Habilitando APIs..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  iam.googleapis.com

echo "==> Criando Service Account para GitHub Actions..."
gcloud iam service-accounts create "$SA_NAME" \
  --display-name "Pi3 GitHub Actions SA" \
  --project "$PROJECT_ID" || true

SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

echo "==> Atribuindo permissões..."
for ROLE in \
  roles/run.admin \
  roles/cloudsql.admin \
  roles/secretmanager.admin \
  roles/artifactregistry.admin \
  roles/iam.serviceAccountUser \
  roles/storage.admin; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member "serviceAccount:$SA_EMAIL" \
    --role "$ROLE" --quiet
done

echo "==> Criando chave JSON para o GitHub Secret GCP_SA_KEY..."
gcloud iam service-accounts keys create infra/gcp-sa-key.json \
  --iam-account "$SA_EMAIL"

echo ""
echo "✅ Pronto! Próximos passos:"
echo "   1. Copie o conteúdo de infra/gcp-sa-key.json para o GitHub Secret GCP_SA_KEY"
echo "   2. Adicione os Secrets no repositório GitHub:"
echo "      - GCP_PROJECT_ID = $PROJECT_ID"
echo "      - GCP_SA_KEY     = (conteúdo do gcp-sa-key.json)"
echo "      - CLOUD_SQL_CONNECTION_NAME = (após rodar terraform apply)"
echo "   3. Delete o arquivo infra/gcp-sa-key.json IMEDIATAMENTE após copiar"
echo "   4. Execute: cd infra && terraform init && terraform apply"

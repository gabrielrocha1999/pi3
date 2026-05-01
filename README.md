# Pi3 — Gestão Financeira e Estoque

Aplicação web para gestão financeira e controle de estoque voltada a microempresas.

## Stack

| Camada     | Tecnologia                              |
|------------|-----------------------------------------|
| Backend    | FastAPI (Python 3.12) + SQLAlchemy      |
| Frontend   | React 19 + TypeScript + Tailwind CSS    |
| Banco      | PostgreSQL (Cloud SQL no GCP)           |
| Deploy     | Cloud Run (GCP)                         |
| CI/CD      | GitHub Actions                          |
| Infra      | Terraform                               |

---

## Desenvolvimento local

### Pré-requisitos
- Docker + Docker Compose
- Python 3.12
- Node.js 20+

### Subir tudo com Docker Compose

```bash
docker-compose up --build
```

| Serviço  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:8080  |
| API Docs | http://localhost:8080/docs |

### Backend sem Docker

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # configure DATABASE_URL
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend sem Docker

```bash
cd frontend
npm install
cp .env.example .env   # configure VITE_API_URL
npm run dev
```

---

## Testes

```bash
cd backend
pytest tests/ -v
```

---

## Deploy no GCP

### 1. Configuração inicial (uma única vez)

```bash
bash infra/setup-gcp.sh SEU_PROJECT_ID
```

Isso cria a Service Account e habilita as APIs necessárias.

### 2. Adicionar Secrets no GitHub

Vá em **Settings → Secrets and variables → Actions** e adicione:

| Secret                    | Valor                                      |
|---------------------------|--------------------------------------------|
| `GCP_PROJECT_ID`          | ID do seu projeto GCP                      |
| `GCP_SA_KEY`              | Conteúdo JSON da Service Account           |
| `CLOUD_SQL_CONNECTION_NAME` | Preenchido após o `terraform apply`      |

### 3. Provisionar infraestrutura com Terraform

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# edite terraform.tfvars com seus valores

terraform init
terraform plan
terraform apply
```

Após o apply, copie o `cloud_sql_connection_name` do output e adicione ao GitHub Secret.

### 4. Deploy automático

Todo push na branch `main` dispara o pipeline que:
1. Roda os testes do backend
2. Faz build do frontend (TypeScript + Vite)
3. Publica imagens no Artifact Registry
4. Faz deploy no Cloud Run (backend e frontend)

---

## Estrutura do projeto

```
Pi3/
├── backend/
│   ├── app/
│   │   ├── controllers/     # Rotas HTTP
│   │   ├── services/        # Regras de negócio
│   │   ├── repositories/    # Acesso ao banco
│   │   ├── models/          # SQLAlchemy
│   │   ├── schemas/         # Pydantic
│   │   └── core/            # Config + DB
│   ├── alembic/             # Migrations
│   └── tests/
├── frontend/
│   └── src/
│       ├── api/             # Camada Axios
│       ├── components/      # Sidebar, Header, Modal, etc.
│       ├── pages/           # Dashboard, Vendas, Despesas, Estoque
│       ├── context/         # Acessibilidade (daltonismo)
│       └── types/
├── infra/                   # Terraform (Cloud SQL + Cloud Run)
└── .github/workflows/       # GitHub Actions CI/CD
```

---

## Endpoints da API

| Método | Rota                      | Descrição                   |
|--------|---------------------------|-----------------------------|
| GET    | `/dashboard/`             | Métricas gerais             |
| GET    | `/produtos/`              | Listar produtos             |
| POST   | `/produtos/`              | Criar produto               |
| PUT    | `/produtos/{id}`          | Atualizar produto           |
| DELETE | `/produtos/{id}`          | Deletar produto             |
| GET    | `/vendas/`                | Listar vendas               |
| POST   | `/vendas/`                | Registrar venda             |
| GET    | `/despesas/`              | Listar despesas             |
| POST   | `/despesas/`              | Criar despesa               |
| PUT    | `/despesas/{id}`          | Atualizar despesa           |
| DELETE | `/despesas/{id}`          | Deletar despesa             |
| GET    | `/external/cep/{cep}`     | Consulta ViaCEP             |
| GET    | `/external/cnpj/{cnpj}`   | Consulta BrasilAPI          |

Documentação interativa disponível em `/docs` (Swagger UI).

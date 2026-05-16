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

## Deploy em VM (Oracle Cloud / Ubuntu)

### Pré-requisitos na VM
- Docker + Docker Compose instalados
- Portas **3000** (frontend) e **8080** (backend) liberadas no firewall da Oracle Cloud (Security List → Ingress Rules)

### 1. Clonar o repositório

```bash
git clone https://github.com/<seu-usuario>/pi3.git
cd pi3
```

### 2. Subir os containers

```bash
docker compose up -d --build
```

| Serviço  | URL                              |
|----------|----------------------------------|
| Frontend | http://<IP_DA_VM>:3000           |
| Backend  | http://<IP_DA_VM>:8080           |
| API Docs | http://<IP_DA_VM>:8080/docs      |

### Como funciona a comunicação frontend → backend

O frontend faz chamadas para `/api/*` que o nginx (container frontend) redireciona internamente para o backend via rede Docker. A porta 8080 não precisa ficar exposta publicamente.

```
Browser → http://<IP>:3000/api/produtos/
              ↓ nginx (container frontend)
          http://backend:8080/produtos/
              ↓ rede interna Docker
          FastAPI responde
```

### Solução de problemas comuns

**Porta já em uso (`port is already allocated`):**
```bash
docker stop $(docker ps -q)
docker container prune -f
docker compose up -d
```

**Atualizar após push no repositório:**
```bash
git pull
docker compose down
docker compose up -d --build
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

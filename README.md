# Pi3 — Gestão Financeira e Estoque

Aplicação web para gestão financeira e controle de estoque voltada a microempresas.

## Stack

| Camada     | Tecnologia                              |
|------------|-----------------------------------------|
| Backend    | FastAPI (Python 3.12) + SQLAlchemy      |
| Frontend   | React 19 + TypeScript + Tailwind CSS    |
| Banco      | PostgreSQL                              |
| CI/CD      | GitHub Actions                          |

---

## Como executar

### Opção 1 — Rodar localmente (sua máquina)

**Pré-requisitos:**
- Docker e Docker Compose instalados

**Passo 1:** Crie o arquivo de variáveis de ambiente do frontend:

```bash
# Crie o arquivo frontend/.env com o seguinte conteúdo:
VITE_API_URL=http://localhost:8080
```

**Passo 2:** Suba os containers:

```bash
docker compose up -d --build
```

**Passo 3:** Acesse no navegador:

| Serviço  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000      |
| Backend  | http://localhost:8080      |
| API Docs | http://localhost:8080/docs |

> **Atenção:** `VITE_API_URL` é injetado no momento do build. Sempre que alterar o `.env`, rode novamente com `--build`.

---

### Opção 2 — Rodar em uma VM (Oracle Cloud / Ubuntu)

**Pré-requisitos:**
- Docker e Docker Compose instalados na VM
- Porta **3000** liberada no firewall da Oracle Cloud (Security List → Ingress Rules → TCP 3000)

**Passo 1:** Clone o repositório na VM:

```bash
git clone https://github.com/<seu-usuario>/pi3.git
cd pi3
```

**Passo 2:** Suba os containers (sem criar `.env` — o proxy nginx já cuida da comunicação):

```bash
docker compose up -d --build
```

**Passo 3:** Acesse no navegador:

| Serviço  | URL                              |
|----------|----------------------------------|
| Frontend | http://<IP_DA_VM>:3000           |
| API Docs | http://<IP_DA_VM>:8080/docs      |

**Como funciona a comunicação na VM:**

O frontend faz chamadas para `/api/*` que o nginx redireciona internamente para o backend via rede Docker. A porta 8080 não precisa ficar exposta publicamente.

```
Browser → http://<IP_DA_VM>:3000/api/produtos/
              ↓ nginx (container frontend)
          http://backend:8080/produtos/
              ↓ rede interna Docker
          FastAPI responde
```

**Atualizar após novo push no repositório:**

```bash
git pull
docker compose down
docker compose up -d --build
```

**Solução para erro "port is already allocated":**

```bash
docker stop $(docker ps -q)
docker container prune -f
docker compose up -d
```

---

## Rodar sem Docker (desenvolvimento)

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # configure DATABASE_URL
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # configure VITE_API_URL=http://localhost:8080
npm run dev
```

---

## Testes

```bash
cd backend
pytest tests/ -v
```

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

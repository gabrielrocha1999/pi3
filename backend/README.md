# Backend — Pi3 Gestão Financeira

API REST desenvolvida com **FastAPI (Python 3.12)** para gestão financeira e controle de estoque de microempresas.

---

## Tecnologias

| Tecnologia | Versão | Função |
|---|---|---|
| FastAPI | 0.111 | Framework web REST |
| SQLAlchemy | 2.0 | ORM |
| Alembic | 1.13 | Migrations de banco |
| Pydantic | 2.7 | Validação de dados |
| PostgreSQL | 15+ | Banco de dados (produção) |
| SQLite | — | Banco de dados (testes) |
| Uvicorn | 0.29 | Servidor ASGI |
| httpx | 0.27 | Cliente HTTP assíncrono (APIs externas) |

---

## Estrutura

```
backend/
├── app/
│   ├── main.py                  # Ponto de entrada — registra rotas e CORS
│   ├── controllers/             # Rotas HTTP (uma por domínio)
│   │   ├── dashboard_controller.py
│   │   ├── produto_controller.py
│   │   ├── venda_controller.py
│   │   ├── despesa_controller.py
│   │   └── external_controller.py   # ViaCEP + BrasilAPI
│   ├── services/                # Regras de negócio
│   │   ├── produto_service.py
│   │   ├── venda_service.py
│   │   └── despesa_service.py
│   ├── repositories/            # Acesso ao banco de dados
│   │   ├── produto_repository.py
│   │   ├── venda_repository.py
│   │   └── despesa_repository.py
│   ├── models/                  # Modelos SQLAlchemy
│   │   ├── produto.py
│   │   ├── venda.py
│   │   └── despesa.py
│   ├── schemas/                 # Schemas Pydantic (request/response)
│   │   ├── produto.py
│   │   ├── venda.py
│   │   ├── despesa.py
│   │   └── dashboard.py
│   └── core/
│       ├── config.py            # Configurações via variáveis de ambiente
│       └── database.py          # Sessão e engine SQLAlchemy
├── alembic/                     # Migrations de banco
│   ├── env.py
│   └── versions/
│       └── 0001_initial_schema.py
├── tests/
│   ├── conftest.py              # Fixtures (banco SQLite em memória)
│   ├── test_produtos.py
│   ├── test_vendas.py
│   ├── test_despesas.py
│   └── test_dashboard.py
├── Dockerfile
├── alembic.ini
└── requirements.txt
```

---

## Como executar localmente

### Pré-requisitos
- Python 3.12+
- PostgreSQL rodando (ou use SQLite via `.env`)

### Instalação

```bash
# 1. Criar e ativar ambiente virtual
python -m venv .venv
source .venv/bin/activate        # Linux/macOS
.venv\Scripts\activate           # Windows

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com sua DATABASE_URL
```

### Configuração (`.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/pi3db
SECRET_KEY=sua-chave-secreta
ENVIRONMENT=development
```

### Executar migrations

```bash
alembic upgrade head
```

### Iniciar servidor

```bash
uvicorn app.main:app --reload
```

API disponível em `http://localhost:8080`
Documentação Swagger em `http://localhost:8080/docs`

---

## Endpoints

### Dashboard
| Método | Rota | Descrição |
|---|---|---|
| GET | `/dashboard/` | Faturamento, despesas, saldo, total de vendas e produtos |

### Produtos
| Método | Rota | Descrição |
|---|---|---|
| GET | `/produtos/` | Listar todos |
| GET | `/produtos/{id}` | Buscar por ID |
| POST | `/produtos/` | Criar produto |
| PUT | `/produtos/{id}` | Atualizar produto |
| DELETE | `/produtos/{id}` | Deletar produto |

### Vendas
| Método | Rota | Descrição |
|---|---|---|
| GET | `/vendas/` | Listar todas |
| GET | `/vendas/{id}` | Buscar por ID |
| POST | `/vendas/` | Registrar venda |

### Despesas
| Método | Rota | Descrição |
|---|---|---|
| GET | `/despesas/` | Listar todas |
| GET | `/despesas/{id}` | Buscar por ID |
| POST | `/despesas/` | Criar despesa |
| PUT | `/despesas/{id}` | Atualizar despesa |
| DELETE | `/despesas/{id}` | Deletar despesa |

### Integrações Externas
| Método | Rota | Descrição |
|---|---|---|
| GET | `/external/cep/{cep}` | Consulta endereço via ViaCEP |
| GET | `/external/cnpj/{cnpj}` | Consulta empresa via BrasilAPI |

---

## Regras de negócio

- **Venda com estoque insuficiente** → retorna HTTP 422 com mensagem detalhada
- **Ao registrar uma venda** → estoque do produto é decrementado automaticamente
- **Faturamento e saldo** → calculados em tempo real no endpoint `/dashboard/`
- **Despesas** → impactam o saldo (faturamento − despesas)

---

## Testes

```bash
pytest tests/ -v
```

Os testes utilizam **SQLite em memória** — não é necessário PostgreSQL para executar.

```
tests/test_produtos.py    — CRUD completo de produtos
tests/test_vendas.py      — registro, redução de estoque, erro de saldo insuficiente
tests/test_despesas.py    — CRUD completo de despesas
tests/test_dashboard.py   — métricas do dashboard
```

---

## Docker

```bash
# Build
docker build -t pi3-backend .

# Executar
docker run -p 8080:8080 -e DATABASE_URL=postgresql://... pi3-backend
```

O `CMD` do Dockerfile executa `alembic upgrade head` antes de iniciar o servidor.

---

## Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `DATABASE_URL` | Sim | — | URL de conexão PostgreSQL |
| `SECRET_KEY` | Não | `dev-secret-key` | Chave para uso futuro (JWT) |
| `ENVIRONMENT` | Não | `development` | Ambiente atual |

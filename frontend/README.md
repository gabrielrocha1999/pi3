# Frontend — Pi3 Gestão Financeira

Interface web desenvolvida com **React 19 + TypeScript + Tailwind CSS** para gestão financeira e controle de estoque de microempresas.

---

## Tecnologias

| Tecnologia | Versão | Função |
|---|---|---|
| React | 19 | Framework UI |
| TypeScript | 5.x | Tipagem estática |
| Vite | 8.x | Build tool e dev server |
| Tailwind CSS | 3.x | Estilização utilitária |
| React Router | 6.x | Roteamento SPA |
| Axios | — | Requisições HTTP |
| Lucide React | — | Ícones |

---

## Estrutura

```
frontend/
├── src/
│   ├── App.tsx                  # Rotas e providers globais
│   ├── main.tsx                 # Ponto de entrada React
│   ├── index.css                # Tailwind + estilos globais (daltonismo, contraste)
│   │
│   ├── api/                     # Camada de comunicação com o backend
│   │   ├── client.ts            # Instância Axios configurada
│   │   ├── dashboard.ts
│   │   ├── produtos.ts
│   │   ├── vendas.ts
│   │   ├── despesas.ts
│   │   └── external.ts          # ViaCEP e BrasilAPI (via backend)
│   │
│   ├── types/
│   │   └── index.ts             # Interfaces TypeScript (Produto, Venda, Despesa, etc.)
│   │
│   ├── context/
│   │   └── AccessibilityContext.tsx  # Filtro de daltonismo + alto contraste
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx       # Shell da aplicação (sidebar + header + outlet)
│   │   │   ├── Sidebar.tsx      # Menu lateral com navegação
│   │   │   └── Header.tsx       # Título da página + controles de acessibilidade
│   │   └── ui/
│   │       ├── Modal.tsx        # Modal genérico reutilizável
│   │       ├── Alert.tsx        # Feedback de sucesso/erro
│   │       ├── Spinner.tsx      # Indicador de carregamento
│   │       └── CepSearch.tsx    # Busca de endereço por CEP
│   │
│   └── pages/
│       ├── Dashboard.tsx        # Cards de métricas financeiras
│       ├── Vendas.tsx           # Listagem e registro de vendas
│       ├── Despesas.tsx         # CRUD de despesas
│       ├── Estoque.tsx          # CRUD de produtos e controle de estoque
│       └── Empresa.tsx          # Consulta de CNPJ via BrasilAPI
│
├── Dockerfile                   # Build multi-stage (Node → Nginx)
├── nginx.conf                   # Configuração Nginx para SPA
├── tailwind.config.js
├── vite.config.ts
└── .env.example
```

---

## Como executar localmente

### Pré-requisitos
- Node.js 20+
- Backend rodando em `http://localhost:8080`

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variável de ambiente
cp .env.example .env
# Edite VITE_API_URL se o backend estiver em outro endereço
```

### Variáveis de ambiente (`.env`)

```env
VITE_API_URL=http://localhost:8080
```

### Iniciar servidor de desenvolvimento

```bash
npm run dev
```

Aplicação disponível em `http://localhost:5173`

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção (TypeScript + Vite) |
| `npm run preview` | Pré-visualizar build de produção localmente |
| `npm run lint` | Verificação ESLint |

---

## Páginas e funcionalidades

### Dashboard (`/`)
- Cards com métricas em tempo real: faturamento total, despesas totais, saldo, total de vendas e produtos cadastrados
- Dados carregados do endpoint `/dashboard/` do backend

### Vendas (`/vendas`)
- Listagem de todas as vendas com produto, cliente, quantidade, preço unitário e total
- Registrar nova venda com seleção de produto e quantidade disponível
- **Busca de CEP do cliente** integrada ao formulário via ViaCEP
- Exibe erro do backend quando estoque é insuficiente

### Despesas (`/despesas`)
- Listagem de despesas com total acumulado
- CRUD completo: criar, editar e excluir despesas
- Campos: descrição, valor e categoria

### Estoque (`/estoque`)
- Listagem de produtos com preço e quantidade em estoque
- CRUD completo: criar, editar e excluir produtos
- Alerta visual (ícone) quando estoque ≤ 5 unidades

### Empresa (`/empresa`)
- Consulta de dados empresariais pelo CNPJ via BrasilAPI
- Exibe: razão social, nome fantasia, situação cadastral, porte, natureza jurídica, capital social, endereço, e-mail e telefone

---

## Acessibilidade

A aplicação implementa suporte a daltonismo e alto contraste, acessíveis pelo seletor no canto superior direito da tela.

| Recurso | Descrição |
|---|---|
| **Filtros de daltonismo** | Protanopia, Deuteranopia e Tritanopia via filtros SVG `feColorMatrix` |
| **Alto contraste** | Toggle que aumenta contraste e saturação em toda a interface |
| **Skip navigation** | Link "Pular para o conteúdo" ativado ao pressionar Tab — auxilia usuários de teclado |
| **ARIA labels** | Todos os botões, inputs e regiões possuem `aria-label` ou `aria-labelledby` |
| **Persistência** | Preferências de acessibilidade salvas no `localStorage` entre sessões |

---

## Docker

```bash
# Build da imagem
docker build -t pi3-frontend .

# Build com URL do backend customizada
docker build --build-arg VITE_API_URL=https://api.exemplo.com -t pi3-frontend .

# Executar
docker run -p 3000:80 pi3-frontend
```

A imagem usa **build multi-stage**: Node para compilar e Nginx para servir os arquivos estáticos.

---

## Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `VITE_API_URL` | Não | `http://localhost:8080` | URL base do backend FastAPI |

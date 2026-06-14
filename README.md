# AquaSite

## Como rodar com banco de dados simples (Express + SQLite)

Passos (Windows/PowerShell):

1. Instale dependências na raiz (server) e no front:

```
npm install
npm --prefix aquasite-react install
```

2. Inicie o backend e o frontend juntos:

```
npm run dev
```

Isso vai iniciar:
- API em `http://localhost:4000` (Express + SQLite)
- Frontend Vite em `http://localhost:5173` com proxy para `/api`

3. Fluxo no site:
- Crie/entre com um usuário na tela de login (salva em `localStorage`)
- Na página `Home`, os posts agora vêm do banco (SQLite). Publicar, curtir e comentar chamam a API.

Estrutura do backend (simples):
- `server/index.js`: cria `aquasite.db` (SQLite), tabelas `posts` e `comments`, e rotas:
  - `GET /api/posts`
  - `POST /api/posts` (body: `{ user, content, image? }`)
  - `POST /api/posts/:id/like`
  - `POST /api/posts/:id/comments` (body: `{ user, text }`)

Observações:
- O banco (`aquasite.db`) é criado automaticamente com alguns posts iniciais.
- As imagens dos seeds usam caminhos já existentes em `public/img`.



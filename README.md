# GranaXP — Sua grana. Seu jogo. Seu próximo nível.

Organizador financeiro gratuito e gamificado (XP, níveis, metas, simulador e guia de investimentos).

## Estrutura (arquivos soltos na raiz, exceto `api/index.ts`)
Todos os arquivos ficam na raiz do repositório. A única pasta é `api/`, com o arquivo `index.ts`
(a Vercel exige essa pasta para o servidor).

## Variáveis de ambiente (Vercel → Settings → Environment Variables)
- `ADMIN_PASSWORD`: senha do painel admin (engrenagem no rodapé)
- `SESSION_SECRET`: frase longa qualquer
- `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`: banco gratuito do upstash.com (aba REST API)

## Rodar no computador
```
npm install
npm run dev
```
Abre em http://localhost:3000. Sem as variáveis do Upstash, os dados ficam no arquivo `data/granaxp.json`.

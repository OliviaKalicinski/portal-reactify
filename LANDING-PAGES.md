# Índice de LPs · portal-reactify (caverna.comidadedragao.com.br)

> Mapa de todas as páginas do portal pra não nos perdermos.
> Checkout de todas as LPs: **`seguro.comidadedragao.com.br`** (Yampi) — formato `/r/{token}?promocode={cupom}`.
> UTM capturada em first-touch e repassada (`src/lib/utm.ts`).

## 🛒 LPs de venda / campanha (com checkout Yampi)

| Rota | Arquivo | Objetivo | Cupom | Token(s) Yampi | Status |
|------|---------|----------|-------|----------------|--------|
| `/original` | `Original.tsx` | Produto Original 90g (tráfego pago) | BORALA (10%) | TQT4HOZK7X | ✅ Ativa |
| `/suplemento` | `Suplemento.tsx` | Suplemento Integral (cães) | BORALA (10%) | BII063ST2H | ✅ Ativa |
| `/matilde` | `Matilde.tsx` | Campanha influência (Matilde) → Original | BORALA (10%) | TQT4HOZK7X | ✅ Ativa |
| `/planeta-dragao` | `PlanetaDragao.tsx` | **Campanha Semana do Meio Ambiente (5–12 jun)** — kits cão/gato + jogo "Draga Limpa a Cidade" | PLANETA | TQT4HOZK7X · KQXZ5J7LWK (cães) · N9DLSJ6M4J (gatos) | ⏳ **Sazonal** — tirar do ar após 12/jun |
| `/ciencia` | `Ciencia.tsx` | 10 motivos científicos (material p/ clientes) | — | leva à loja | ✅ Ativa |
| `/alergia` | `Alergia.tsx` | **Campanha ALERGIA** → Kit Cachorro (Original + Suplemento) | ALIVIO (10%) | KQXZ5J7LWK | ✅ Ativa |

## 📣 Captação / institucional (sem checkout direto)

| Rota | Arquivo | Objetivo |
|------|---------|----------|
| `/quero-ser-dragao` | `QueroSerDragao.tsx` | "Quero ser Dragão" — entrar na matilha |
| `/veterinarios` | `Veterinarios.tsx` | Captação de vet parceiro (lead) |
| `/parceiros` | `Parceiros.tsx` | Parceiros / B2B |
| `/produtos` | `Produtos.tsx` | Catálogo de produtos |
| `/lojas` | `Lojas.tsx` | Onde encontrar (lojas físicas) |
| `/biblioteca` | `Biblioteca.tsx` | Biblioteca científica |
| `/imprensa` | `Imprensa.tsx` | Imprensa & cobertura |
| `/quizzes` | `Quizzes.tsx` | Quizzes |

## ⚙️ Sistema

| Rota | Arquivo | Obs |
|------|---------|-----|
| `/` | `Portal.tsx` | Home / hub (raiz) |
| `/portal` | — | redireciona pra `/` |
| `/obrigado` | `Obrigado.tsx` | pós-checkout (noindex) |
| `/onboarding` | `Onboarding.tsx` | Manual do Criador (noindex) |
| `*` | `NotFound.tsx` | 404 |

## 🔑 Tokens Yampi (referência)

| Token | Produto |
|-------|---------|
| `TQT4HOZK7X` | Original 90g |
| `BII063ST2H` | Suplemento Integral |
| `KQXZ5J7LWK` | Kit Cães (Original + Suplemento) |
| `N9DLSJ6M4J` | Kit Gatos (Original + Suplemento) |

## 🧹 Como tirar uma campanha do ar
No `src/App.tsx`, comente **o lazy import** e **a rota** da página (ela continua no código pra reativar depois). Ex.: `/planeta-dragao` após 12/jun.

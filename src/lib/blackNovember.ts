/* ──────────────────────────────────────────────────────────────
   A campanha da Black em um lugar só.

   POR QUE ISTO EXISTE (Olivia, 30/10/2026): *"tudo que a gente fez para Black Friday
   tem que estar engatilhado para quando eu falar assim, ativa. Mas eu ainda não tenho
   o dia certo para nada. Então isso é importante você saber, para a gente fazer os
   ajustes necessários para não começar uma parte segunda e o resto ficar para trás."*

   Antes disto, a data da campanha estava escrita à mão em 23 trechos de 4 arquivos, e
   o começo não existia em lugar nenhum no código: as páginas só sabiam quando PARAR.
   Resultado: elas já respondiam a quem tivesse o endereço, e mudar a data da campanha
   era caçar 23 trechos e torcer para não esquecer um.

   AGORA: mexa só no INICIO e no FIM abaixo. Os textos, as faixas, as prévias de link e
   a porta de entrada das três páginas leem daqui.

   🔴 ATIVAR A CAMPANHA = trocar o INICIO para a data que ela disser, e publicar.
      Antes do INICIO, as três páginas levam para a loja, como já faziam depois do FIM.

   ⚠️ O QUE ESTE ARQUIVO NÃO ALCANÇA, e continua sendo clique de gente:
      - a regra de brinde na Yampi (8402), que tem data própria no painel;
      - o preço do gato e do Kit Completo, na Shopify e na Yampi;
      - o banner, o pop-up e a página de kits da loja (tema Shopify);
      - anúncios, e-mail, WhatsApp e Instagram.
      A lista inteira mora em `PROJETOS/Lançamentos & Campanhas/Black November - lista
      de produção.md`.
   ────────────────────────────────────────────────────────────── */

/* 🔴 A DATA DE LARGADA: segunda 09/11, escolhida pela Olivia em 30/10 ("coloca a outra
   segunda"). Antes era 03/11, o alvo do planejamento, que ela adiou porque a campanha
   começa quando ela disser e 03/11 chegaria sozinho.
   ⚠️ ESTA DATA TEM UM PAR FORA DO CÓDIGO: a regra de brinde 8402 na Yampi
   (Marketing → Brindes), que também foi para 09/11 no mesmo dia. Mudou aqui, muda lá,
   senão o presente e a página discordam. */
export const INICIO = Date.parse("2026-11-09T00:00:00-03:00");

/* O FIM já existia no App.tsx e veio para cá sem mudar: 30/11 vira 01/12 à meia-noite
   e meia, para a página não sumir enquanto alguém ainda compra na virada. */
export const FIM = Date.parse("2026-12-01T00:30:00-03:00");

/* As três páginas já ficam visíveis antes do INICIO, de propósito, para a Olivia e a
   Bianca verem. Troque para false e a porta fecha: antes do INICIO a rota leva à loja. */
export const ABRIR_ANTES_DO_INICIO = true;

export function campanhaNoAr(agora = Date.now()) {
  if (agora >= FIM) return false;
  return ABRIR_ANTES_DO_INICIO || agora >= INICIO;
}

const dois = (n: number) => String(n).padStart(2, "0");
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/* O FIM é 01/12 00h30, mas o último dia que a pessoa tem para comprar é 30/11.
   Por isso o texto usa o dia anterior, e não a data técnica do desligamento. */
const dataInicio = new Date(INICIO);
const dataFim = new Date(FIM - 60 * 60 * 1000);

/* "03/11" e "30/11" */
export const INICIO_CURTO = `${dois(dataInicio.getDate())}/${dois(dataInicio.getMonth() + 1)}`;
export const FIM_CURTO = `${dois(dataFim.getDate())}/${dois(dataFim.getMonth() + 1)}`;
/* "30 de novembro" */
export const FIM_POR_EXTENSO = `${dataFim.getDate()} de ${MESES[dataFim.getMonth()]}`;
/* "de 03 a 30 de novembro" */
export const JANELA_POR_EXTENSO = `de ${dois(dataInicio.getDate())} a ${FIM_POR_EXTENSO}`;
/* "03 a 30 de novembro", sem o "de" na frente, para quando a frase já tem um */
export const JANELA_CURTA = `${dois(dataInicio.getDate())} a ${FIM_POR_EXTENSO}`;

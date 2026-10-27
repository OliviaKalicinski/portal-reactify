import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { DRAGOES } from "@/data/dragoes";
import "./QueroSerDragao.css";
import "./Matilha.css";
import "./PainelCreator.css";
import "./Fofo.css";

/* Painel do creator. Entra com e-mail e senha (R648, 14/10/2026): o creator NÃO é usuário do dash; a conta dele mora
   numa tabela própria e entrar devolve um "passe" que só abre as portas do painel. O link pessoal (o segredo depois do
   "#") virou CONVITE: abre a tela de criar a senha e serve uma vez. Um script no index.html tira o convite do endereço
   e guarda na aba antes de a medição carregar. A chave abaixo é a pública. */
const DASH = "https://rbjvwdsfpalyypimfrkf.supabase.co/rest/v1/rpc/";
/* Vídeos de referência (creator_painel_referencias): os vídeos de creator que venceram como anúncio. A lista vem do
   dash e muda sozinha. */
const DASH_CHAVE_PUBLICA = "sb_publishable_M9kG9XFt-z4SRrciu2G8iQ_F1_FeNro";
const CONVITE = "cd_painel_creator";   // o mesmo nome que o index.html usa
const PASSE = "cd_painel_passe";        // fica no navegador até sair ou vencer (30 dias)
const INFLOWZ = "https://app.inflowz.io";

const ler = (onde: Storage | undefined, chave: string) => { try { return onde?.getItem(chave) ?? null; } catch { return null; } };
const gravar = (onde: Storage | undefined, chave: string, valor: string) => { try { onde?.setItem(chave, valor); } catch { /* sem armazenamento */ } };
const apagar = (onde: Storage | undefined, chave: string) => { try { onde?.removeItem(chave); } catch { /* nada a apagar */ } };
const sessao = () => { try { return window.sessionStorage; } catch { return undefined; } };
const local = () => { try { return window.localStorage; } catch { return undefined; } };
const HEX64 = /^[0-9a-f]{64}$/;

const chamar = (nome: string, corpo: Record<string, string>) =>
  fetch(DASH + nome, {
    method: "POST",
    headers: { apikey: DASH_CHAVE_PUBLICA, "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))));

type Video = {
  url: string; publicado_em: string; views: number | null; e_video: boolean; conta_para_a_faixa: boolean;
  util: "sim" | "nao" | "em_avaliacao"; util_texto: string | null; anuncio: string | null; anuncio_texto: string | null;
};
type Extrato = {
  cupom: string; faixa: string; comissao_mes_seguinte: string; valor_comissao: number; linha_vendas: string;
  linha_conteudo: string; gate_venda: string; gate_video: string; original: string; regua_de_origem: string;
  o_que_mais_te_move: string; linha_frete: string; valor_total: number;
};
type Painel = {
  ok: true;
  creator: { primeiro_nome: string | null; instagram: string | null };
  cupons: string[]; legado: boolean;
  /* últimos 6 meses, o corrente incluído; mês sem venda vem zerado (R649). Comissão e taxa desde a R650: mesma conta da
     Inflowz, taxa × total do pedido com frete */
  vendas_por_mes?: { mes: string; vendas: number; pedidos: number; comissao?: number; taxa?: number }[];
  /* foto, nome e dragão do pet, da resposta dele ao quiz "Que dragão mora na sua casa?" (nulo se não fez) */
  pet: { foto_url: string; nome: string | null; dragao: string | null } | null;
  mes_atual: { mes: string; vendas: number; pedidos: number; videos_uteis_no_mes: number; videos_uteis_no_trimestre: number };
  ultimo_fechamento: { mes: string; oficial: boolean; linhas: Extrato[] } | null;
  videos: Video[]; atualizado_em: string; link_vence_em: string;
};

type Referencia = { url: string; creator: string | null; no_ar: boolean };
/* assunto da semana (R658): sai da mensagem semanal aos creators, depois do sim da Olivia */
type Tema = { semana_inicio: string; titulo: string; o_que_fazer: string; ideias: string[]; imagem_url: string | null;
  clima?: string; material_url?: string | null;
  /* R669: botões de link (loja, landing page) e foto de referência com o prompt para o creator adaptar */
  links?: { rotulo: string; url: string }[]; foto_url?: string | null; prompt?: string | null };
/* climas que a página conhece (R659); outro valor cai no padrão */
const CLIMAS: Record<string, { janela: string; selo: string }> = {
  halloween:      { janela: "HALLOWEEN.EXE",       selo: "Halloween" },
  "black-friday": { janela: "BLACK-FRIDAY.EXE",    selo: "Black Friday" },
  natal:          { janela: "NATAL-DO-DRAGAO.EXE", selo: "Natal" },
  "dia-dos-pets": { janela: "DIA-DOS-PETS.EXE",    selo: "Dia dos pets" },
};

const MES_CURTO = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const reaisCurto = (v: number) => `R$ ${Math.round(Number(v || 0)).toLocaleString("pt-BR")}`;

/* Gráfico de barras das vendas por mês: uma barra por mês, valor escrito em cima, mês embaixo.
   O mês corrente fica destacado e marcado "até agora". */
/* Bianca: R$ em todas as barras, linhas de grade, "sem registro" (comissão nula) diferente de R$ 0, ano no rótulo
   quando a série atravessa a virada do ano, mês escolhido no seletor com contorno, e o resumo em duas partes. */
type MesSerie = { mes: string; comissao?: number | null };
const GraficoVendas = ({ meses, escolhido, aoEscolher, atualizadoEm }: { meses: MesSerie[]; escolhido: number; aoEscolher: (i: number) => void; atualizadoEm: string }) => {
  const maior = Math.max(...meses.map((x) => Number(x.comissao) || 0), 1);
  const total = meses.reduce((s, x) => s + (Number(x.comissao) || 0), 0);
  const variosAnos = new Set(meses.map((x) => x.mes.slice(0, 4))).size > 1;
  const rotulo = (iso: string) => `${MES_CURTO[Number(iso.slice(5, 7)) - 1]}${variosAnos ? `/${iso.slice(2, 4)}` : ""}`;
  const quando = new Date(atualizadoEm);
  return (
    <figure className="pc-grafico" aria-label={`Sua comissão nos últimos ${meses.length} meses: ${meses.map((x) => `${MESES[Number(x.mes.slice(5, 7)) - 1]} ${x.comissao == null ? "sem registro" : reais(Number(x.comissao))}`).join(", ")}`}>
      <div className="pc-barras">
        {meses.map((x, i) => {
          const semRegistro = x.comissao == null;
          const v = Number(x.comissao) || 0;
          const atual = i === meses.length - 1;
          return (
            <button type="button" aria-hidden="true" tabIndex={-1} onClick={() => aoEscolher(i)}
              className={`pc-barra${atual ? " atual" : ""}${i === escolhido ? " escolhido" : ""}${semRegistro ? " sem-registro" : ""}`} key={x.mes}>
              <span className="pc-barra-valor">{semRegistro ? "sem registro" : reaisCurto(v)}</span>
              <span className="pc-barra-coluna">{semRegistro ? <i className="vazio" /> : <i style={{ height: `${Math.max(v > 0 ? 4 : 1.5, (v / maior) * 100)}%` }} />}</span>
              <span className="pc-barra-mes">{rotulo(x.mes)}</span>
            </button>
          );
        })}
      </div>
      <figcaption className="pc-resumo">
        <span><strong>{reais(total)}</strong> de comissão nos últimos {meses.length} meses</span>
        <span>Atualizado em {quando.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às {quando.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
      </figcaption>
    </figure>
  );
};

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const mesPorExtenso = (iso: string) => MESES[Number(iso.slice(5, 7)) - 1] ?? "";
const dataCurta = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const reais = (v: number) => `R$ ${Number(v || 0).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

/* Os mínimos da Prata são os da régua (os mesmos que o extrato do fechamento usa). */
const PRATA_VIDEOS = 3;
const PRATA_VENDA = 50;

const Win = ({ name, children, inverted, mac, className }: { name: string; children: ReactNode; inverted?: boolean; mac?: boolean; className?: string }) => (
  <section className={`qsd8-win${inverted ? " inverted" : ""}${className ? " " + className : ""}`}>
    <div className="qsd8-titlebar">
      {mac && <span className="qsd8-mac-dots" aria-hidden="true"><i /><i /></span>}
      <span className="qsd8-tb-name">{name}</span>
      <span className="qsd8-tb-stripes" aria-hidden="true" />
      <span className="qsd8-tb-x" aria-hidden="true">×</span>
    </div>
    <div className="qsd8-win-body">{children}</div>
  </section>
);

function conviteDoEndereco(): string | null {
  const doEndereco = window.location.hash.replace(/^#/, "");
  if (HEX64.test(doEndereco)) {
    (window as unknown as { __cdConvite?: string }).__cdConvite = doEndereco;   // vale mesmo se a aba não guardar
    gravar(sessao(), CONVITE, doEndereco);
    window.history.replaceState(null, "", window.location.pathname);
    return doEndereco;
  }
  const guardado = ler(sessao(), CONVITE) ?? (window as unknown as { __cdConvite?: string }).__cdConvite ?? null;
  return guardado && HEX64.test(guardado) ? guardado : null;
}

const ERRO_ENTRAR: Record<string, string> = {
  senha: "E-mail ou senha não conferem.",
};
const ERRO_SENHA: Record<string, string> = {
  convite: "Este link já foi usado ou venceu. Escreva para somos@letsfly.com.br e a gente manda um novo.",
  senha_curta: "A senha precisa de pelo menos 8 caracteres.",
  sem_email: "Seu cadastro está sem e-mail. Avise no grupo da Matilha.",
  email_em_uso: "Este e-mail já tem conta. Entre com ele, ou peça ajuda no grupo da Matilha.",
};

const ANUNCIO_ROTULO: Record<string, string> = {
  testado: "já rodou como anúncio", aprovado: "selecionado", aprovado_com_edicao: "selecionado, com edição",
  selecionado: "selecionado para campanha", exotico: "guardado para campanha", a_triar: "ainda não avaliado",
  em_duvida: "em análise", bloqueado: "não conseguimos baixar", eliminado: "não selecionado", descartado_na_selecao: "não selecionado",
};

/* Bianca: as linhas do fechamento, iguais às da janela antiga (faixa, comissão, metas, original, régua, frete, incentivo) */
const FechLinhas = ({ l }: { l: Extrato }) => (
  <ul className="mat-faixas-notas pc-fech-linhas">
    <li>Faixa: <strong>{l.faixa}</strong>{l.cupom ? <> · cupom {l.cupom}</> : null}</li>
    <li>Comissão do mês seguinte: <strong>{l.comissao_mes_seguinte}</strong></li>
    <li>{l.gate_venda}</li>
    <li>{l.gate_video}</li>
    <li>{l.original}</li>
    {l.regua_de_origem && l.regua_de_origem !== "Não se aplica" && <li>{l.regua_de_origem}</li>}
    {l.linha_frete && <li>{l.linha_frete}</li>}
    <li><strong>{l.o_que_mais_te_move}</strong></li>
  </ul>
);
/* Bianca: menu de links úteis no canto de baixo, à direita. Os links são os mesmos que a /matilha já dá ao creator. */
const LINKS_UTEIS = [
  { rotulo: "Templates do Canva", url: "https://www.canva.com/design/DAG6dSqYXRQ/sP8AFE4kewSeztzNm7hbPg/edit", icone: "star8" },
  /* Manual do Criador fora até o link voltar: a pasta 1kDnH3… do Drive dá 404 (Bianca, 26/10) */
  { rotulo: "Material de marketing", url: "https://drive.google.com/drive/u/0/folders/1DiTxfcg8ybCkv-1zhwaiThR8pfnijCpJ", icone: "gift" },
  { rotulo: "Minha conta na Inflowz", url: INFLOWZ, icone: "crown" },
  { rotulo: "Como funciona a Matilha", url: "/matilha", icone: "paw" },
  { rotulo: "Falar com a gente no WhatsApp", url: "https://wa.me/552139500576", icone: "love" },
];
const MenuLinks = () => {
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => { if (caixa.current && !caixa.current.contains(e.target as Node)) setAberto(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setAberto(false); };
    document.addEventListener("mousedown", fora); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", fora); document.removeEventListener("keydown", esc); };
  }, [aberto]);
  return (
    <div className="pc-menu" ref={caixa}>
      {aberto && (
        <nav className="pc-menu-caixa" id="pc-menu-links" aria-label="Links úteis">
          <p className="pc-menu-titulo">LINKS-UTEIS.EXE</p>
          <ul>
            {LINKS_UTEIS.map((l) => (
              <li key={l.url}>
                <a href={l.url} {...(l.url.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
                  <img src={`/assets/pixel-icons/${l.icone}.png`} alt="" />{l.rotulo}{!l.url.startsWith("/") && <span aria-hidden="true">↗</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <button type="button" className="pc-menu-botao" aria-expanded={aberto} aria-controls="pc-menu-links" onClick={() => setAberto((x) => !x)}>
        <img src="/assets/pixel-icons/dragon.png" alt="" />
        <span className="sr-only">{aberto ? "Fechar links úteis" : "Abrir links úteis"}</span>
      </button>
    </div>
  );
};

const PainelCreator = () => {
  const [estado, setEstado] = useState<"carregando" | "entrar" | "criar_senha" | "erro" | "pronto">("carregando");
  const [d, setD] = useState<Painel | null>(null);
  const [refs, setRefs] = useState<Referencia[]>([]);
  const [tema, setTema] = useState<Tema | null>(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [mesSel, setMesSel] = useState<number | null>(null);   // Bianca: mês escolhido no seletor (nulo = o atual)
  const [problema, setProblema] = useState<string | null>(null);   // erro do formulário
  const [aviso, setAviso] = useState<string | null>(null);         // recado no topo do painel
  const vivo = useRef(true);

  const carregar = (passe: string) => {
    setEstado("carregando");
    chamar("creator_painel_dados", { p_token: passe })
      .then((j) => {
        if (!vivo.current) return;
        if (j && j.ok === true) {
          setD(j as Painel); setEstado("pronto");
          /* a lista de referência é um extra: se não vier, o painel abre igual, só sem esse bloco */
          chamar("creator_painel_referencias", { p_token: passe })
            .then((k) => { if (vivo.current && k && k.ok === true && Array.isArray(k.videos)) setRefs(k.videos as Referencia[]); })
            .catch(() => { /* sem lista de referência */ });
          chamar("creator_painel_tema", { p_token: passe })
            .then((k) => { if (vivo.current && k && k.ok === true && k.tema) setTema(k.tema as Tema); })
            .catch(() => { /* sem assunto da semana */ });
        } else {
          apagar(local(), PASSE); setD(null);
          setProblema("Sua entrada venceu. Entre de novo."); setEstado("entrar");
        }
      })
      .catch(() => vivo.current && setEstado("erro"));
  };

  useEffect(() => {
    vivo.current = true;
    const abrir = () => {
      setProblema(null);
      if (conviteDoEndereco()) { setEstado("criar_senha"); return; }
      const passe = ler(local(), PASSE);
      if (passe && HEX64.test(passe)) carregar(passe); else setEstado("entrar");
    };
    abrir();
    /* outro convite aberto na mesma aba só troca o que vem depois do "#": a página não recarrega sozinha */
    const aoTrocar = () => { if (HEX64.test(window.location.hash.replace(/^#/, ""))) abrir(); };
    window.addEventListener("hashchange", aoTrocar);
    return () => { vivo.current = false; window.removeEventListener("hashchange", aoTrocar); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entrar = (e: FormEvent) => {
    e.preventDefault();
    if (ocupado) return;
    setOcupado(true); setProblema(null);
    chamar("creator_painel_entrar", { p_email: email, p_senha: senha })
      .then((j) => {
        if (j && j.ok === true && HEX64.test(j.passe)) { gravar(local(), PASSE, j.passe); setSenha(""); carregar(j.passe); }
        else if (j && j.motivo === "travado") setProblema(`Muitas tentativas erradas. Tente de novo em ${j.minutos ?? 15} minutos.`);
        else if (j && j.motivo === "ocupado") setProblema("Muita gente entrando agora. Tente de novo em um minuto.");
        else setProblema(ERRO_ENTRAR[j?.motivo] ?? ERRO_ENTRAR.senha);
      })
      .catch(() => setProblema("Não deu para entrar agora. Tente de novo em alguns minutos."))
      .finally(() => setOcupado(false));
  };

  const criarSenha = (e: FormEvent) => {
    e.preventDefault();
    if (ocupado) return;
    if (senha.length < 8) { setProblema(ERRO_SENHA.senha_curta); return; }
    if (senha !== senha2) { setProblema("As duas senhas não são iguais."); return; }
    const convite = conviteDoEndereco();
    if (!convite) { setProblema(ERRO_SENHA.convite); return; }
    setOcupado(true); setProblema(null);
    chamar("creator_painel_criar_senha", { p_convite: convite, p_senha: senha })
      .then((j) => {
        if (j && j.ok === true && HEX64.test(j.passe)) {
          apagar(sessao(), CONVITE); (window as unknown as { __cdConvite?: string }).__cdConvite = undefined; gravar(local(), PASSE, j.passe);
          setSenha(""); setSenha2("");
          setAviso(`Senha criada. Da próxima vez, entre com ${j.email} e a sua senha.`);
          carregar(j.passe);
        } else if (j?.motivo === "convite") {
          /* link já usado ou vencido: quem já criou a senha só precisa entrar */
          apagar(sessao(), CONVITE); (window as unknown as { __cdConvite?: string }).__cdConvite = undefined; setSenha(""); setSenha2("");
          setProblema("Este link já foi usado ou venceu. Se você já criou a sua senha, é só entrar abaixo.");
          setEstado("entrar");
        } else {
          setProblema(ERRO_SENHA[j?.motivo] ?? ERRO_SENHA.convite);
        }
      })
      .catch(() => setProblema("Não deu para criar a senha agora. Tente de novo em alguns minutos."))
      .finally(() => setOcupado(false));
  };

  const sair = () => {
    const passe = ler(local(), PASSE);
    if (passe) chamar("creator_painel_sair", { p_passe: passe }).catch(() => { /* sai do mesmo jeito */ });
    apagar(local(), PASSE);
    setD(null); setRefs([]); setTema(null); setAviso(null); setProblema(null); setEstado("entrar");
  };

  const m = d?.mes_atual;
  const faltaVideos = m ? Math.max(0, PRATA_VIDEOS - Number(m.videos_uteis_no_trimestre)) : 0;
  const faltaVenda = m ? Math.max(0, PRATA_VENDA - Number(m.vendas)) : 0;
  /* comissão do mês corrente = último mês da série (R650); sem a série, o card some em vez de mostrar venda */
  const ultimoMes = d?.vendas_por_mes && d.vendas_por_mes.length > 0 ? d.vendas_por_mes[d.vendas_por_mes.length - 1] : null;
  const temComissao = !!ultimoMes && ultimoMes.comissao != null;
  const comissaoMes = temComissao ? Number(ultimoMes!.comissao) : null;
  const taxaMes = temComissao && ultimoMes!.taxa != null ? Number(ultimoMes!.taxa) : null;
  const fech = d?.ultimo_fechamento && d.ultimo_fechamento.oficial ? d.ultimo_fechamento : null;
  const dragao = d?.pet?.dragao ? DRAGOES.find((x) => x.id === d.pet!.dragao)?.nome ?? null : null;

  return (
    /* visual "fofo" (aprovado pela Olivia em 14/10/2026): pastel, cantos redondos, mesmo espírito de janelinha */
    <div className="qsd8 fofo pc-fofo pc-mt-c">
      <PageMeta title="Meu painel · Matilha do Dragão" description="Painel do creator da Matilha do Dragão." noindex />
      <img className="qsd8-bg" src="/assets/bg-clouds.jpg" alt="" aria-hidden="true" />
      <div className="qsd8-wrap">
        {estado !== "pronto" && (
          <Win name="MEU-PAINEL.EXE" mac className="qsd8-hero-win">
            <DragonLogo className="qsd8-hero-logo pc-logo-entrar" />
            {estado === "carregando" && <p className="qsd8-sub">Abrindo o seu painel…</p>}

            {estado === "entrar" && (
              <form className="pc-form" onSubmit={entrar}>
                <h1 className="qsd8-title pc-titulo">Painel da <span>Matilha</span></h1>
                <label>E-mail<input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                <label>Senha<input type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} /></label>
                {problema && <p className="pc-problema" role="alert">{problema}</p>}
                <div className="qsd8-btnrow"><button type="submit" className="qsd8-btn" disabled={ocupado}>{ocupado ? "Entrando…" : "Entrar"}</button></div>
                <p className="pc-linha pc-fraco">Primeira vez? Abra o link que a gente te mandou para criar a sua senha.</p>
                <p className="pc-linha pc-fraco">Esqueceu a senha? Escreva para <a href="mailto:somos@letsfly.com.br?subject=Link%20novo%20do%20painel%20da%20Matilha">somos@letsfly.com.br</a> e a gente manda um link novo.</p>
              </form>
            )}

            {estado === "criar_senha" && (
              <form className="pc-form" onSubmit={criarSenha}>
                <h1 className="qsd8-title pc-titulo">Crie a sua <span>senha</span></h1>
                <p className="pc-linha">Com ela você entra no seu painel sempre que quiser, usando o e-mail do seu cadastro na Matilha.</p>
                <label>Senha (pelo menos 8 caracteres)<input type="password" autoComplete="new-password" required minLength={8} value={senha} onChange={(e) => setSenha(e.target.value)} /></label>
                <label>Repita a senha<input type="password" autoComplete="new-password" required minLength={8} value={senha2} onChange={(e) => setSenha2(e.target.value)} /></label>
                {problema && <p className="pc-problema" role="alert">{problema}</p>}
                <div className="qsd8-btnrow"><button type="submit" className="qsd8-btn" disabled={ocupado}>{ocupado ? "Criando…" : "Criar senha e entrar"}</button></div>
                <p className="pc-linha pc-fraco">
                  Já criou a sua senha?{" "}
                  <button type="button" className="pc-link" onClick={() => { apagar(sessao(), CONVITE); (window as unknown as { __cdConvite?: string }).__cdConvite = undefined; setSenha(""); setSenha2(""); setProblema(null); setEstado("entrar"); }}>Entrar</button>
                </p>
              </form>
            )}

            {estado === "erro" && (
              <>
                <h1 className="qsd8-title pc-titulo">Não deu para <span>abrir</span></h1>
                <p className="qsd8-sub">Tente de novo em alguns minutos.</p>
              </>
            )}
            <div className="qsd8-btnrow"><Link to="/matilha" className="qsd8-btn ghost">Como funciona a Matilha</Link></div>
          </Win>
        )}

        {estado === "pronto" && d && m && (
          <>
            {/* Bianca: logo P&B de adesivo (o da página do Rango) fora da janela, acima dela, à esquerda */}
            <img className="pc-logo-fora pc-logo-img pc-logo-adesivo" src="/assets/images/rango/logo-adesivo-pb.webp" alt="Comida de Dragão" />
            <Win name="MEU-PAINEL.EXE" mac className="qsd8-hero-win pc-hero">
              {d.cupons.length > 0 && (
                <p className="pc-cupom-selo pc-selo-a"><span>seu cupom</span> <strong>{d.cupons.join(" e ")}</strong></p>
              )}
              <div className="pc-topo">
                {d.pet && (
                  <div className="pc-pet">
                    <img src={d.pet.foto_url} alt={d.pet.nome ? `Foto de ${d.pet.nome}` : "Foto do seu pet"} loading="eager" />
                  </div>
                )}
                <div>
                  <h1 className="qsd8-title pc-titulo">
                    Oi, <span>{d.creator.primeiro_nome ?? "creator"}</span>
                    {d.pet?.nome && <> e <span>{d.pet.nome}</span></>}
                  </h1>
                  {/* Bianca: o cupom sai desta linha e vira selo no canto de cima; @ e dragão com divisória igual */}
                  <p className="pc-linha pc-ident">
                    {d.creator.instagram && <span>@{d.creator.instagram}</span>}
                    {d.cupons.length === 0 && <span>sem cupom no nosso cadastro</span>}
                    {dragao && <span>{dragao}</span>}
                  </p>
                  {/* Bianca: links logo abaixo do @ e do cupom, ao lado da foto */}
                  <div className="pc-acoes">
                    <a href={INFLOWZ} target="_blank" rel="noopener noreferrer">Minha conta na Inflowz ↗</a>
                    <button type="button" onClick={sair}>Sair</button>
                  </div>
                </div>
              </div>
              {aviso && <p className="pc-aviso pc-linha">{aviso}</p>}
              {!d.pet && (
                <p className="pc-linha pc-fraco">
                  Quer a foto do seu pet aqui? <Link to="/qual-dragao">Faça o quiz do dragão</Link>.
                </p>
              )}
              {d.cupons.length === 0 && (
                <p className="qsd8-note">Sem cupom, não dá para ligar suas vendas e seus vídeos a você. Crie o seu no Inflowz e avise no grupo.</p>
              )}
            </Win>

            {tema && (
              <Win name={CLIMAS[tema.clima ?? ""]?.janela ?? "ESTA-SEMANA.TXT"} className={`pc-tema pc-clima-${CLIMAS[tema.clima ?? ""] ? tema.clima : "padrao"}`}>
                <div className="qsd8-eyebrow">// semana de {dataCurta(tema.semana_inicio)}{CLIMAS[tema.clima ?? ""] && <> · {CLIMAS[tema.clima ?? ""].selo}</>}</div>
                {/* fechado por padrão: só o tema; toque abre o que fazer, as ideias e o material (Olivia, 14/10) */}
                <details className="pc-tema-caixa">
                  <summary>
                    <span className="pc-tema-rotulo">Assunto da semana</span>
                    <span className="pc-tema-titulo">{tema.titulo}</span>
                    <span className="pc-tema-abrir" aria-hidden="true">ver o que fazer ▾</span>
                    <span className="pc-tema-fechar" aria-hidden="true">recolher ▴</span>
                  </summary>
                  <div className="pc-tema-corpo">
                    {tema.imagem_url && <img className="pc-tema-img" src={tema.imagem_url} alt="" loading="lazy" />}
                    <p className="qsd8-sub">{tema.o_que_fazer}</p>
                    {tema.ideias && tema.ideias.length > 0 && (
                      <>
                        <p className="pc-linha"><strong>Ideias de vídeo</strong></p>
                        <ul className="pc-regra pc-tema-ideias">
                          {tema.ideias.map((x, i) => <li key={i}>{x}</li>)}
                        </ul>
                      </>
                    )}
                    {((tema.links && tema.links.length > 0) || tema.material_url) && (
                      <div className="qsd8-btnrow pc-tema-links">
                        {(tema.links ?? []).map((l) => (
                          <a key={l.url} className="qsd8-btn ghost" href={l.url} target="_blank" rel="noopener noreferrer">{l.rotulo} ↗</a>
                        ))}
                        {tema.material_url && (
                          <a className="qsd8-btn" href={tema.material_url} target="_blank" rel="noopener noreferrer">Material de divulgação ↗</a>
                        )}
                      </div>
                    )}
                    {(tema.foto_url || tema.prompt) && (
                      <div className="pc-tema-foto">
                        <p className="pc-linha"><strong>Foto da semana</strong> · use o prompt e troque pelo seu pet</p>
                        {tema.foto_url && <img src={tema.foto_url} alt="Foto de referência da semana" loading="lazy" />}
                        {tema.prompt && (
                          <>
                            <pre className="pc-tema-prompt">{tema.prompt}</pre>
                            <button type="button" className="qsd8-btn ghost pc-tema-copiar"
                              onClick={(e) => { const b = e.currentTarget; navigator.clipboard?.writeText(tema.prompt ?? "").then(() => { b.textContent = "Prompt copiado ✓"; }); }}>
                              Copiar o prompt
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    {/* recolher também no fim: quem leu até embaixo não precisa voltar ao título */}
                    <button type="button" className="pc-tema-recolher"
                      onClick={(e) => { const d = e.currentTarget.closest("details"); if (d) { d.open = false; d.scrollIntoView({ block: "nearest" }); } }}>
                      recolher ▴
                    </button>
                  </div>
                </details>
              </Win>
            )}

            {fech && (
              <details className="pc-fech pc-fech-antes">
                <summary>
                  <span className="pc-fech-quando">// fechamento do mês anterior</span>
                  <span>Você fechou {mesPorExtenso(fech.mes)} na faixa <strong>{fech.linhas.map((l) => l.faixa).join(" e ")}</strong></span>
                </summary>
                {fech.linhas.map((l) => <FechLinhas l={l} key={l.cupom} />)}
              </details>
            )}

            <Win name={`${mesPorExtenso(m.mes).toUpperCase()}-ATE-AGORA.SYS`} inverted>
              {/* Bianca: seletor de mês ao lado do título. Passeia pelos 6 meses da série; vídeos só existem no mês atual */}
              {(() => {
                const serie = d.vendas_por_mes ?? [];
                const ult = serie.length - 1;
                const i = mesSel ?? ult;
                const sel = serie[i];
                const ehAtual = !sel || i === ult;
                const ant = i > 0 ? serie[i - 1] : null;
                const valor = ehAtual ? comissaoMes : sel.comissao ?? null;
                const base = ant?.comissao;
                const varia = valor != null && base != null && Number(base) > 0 ? Math.round(((Number(valor) - Number(base)) / Number(base)) * 100) : null;
                const mesIso = sel?.mes ?? m.mes;
                return (
                  <>
                    {/* Bianca: saiu o "// outubro, até agora" — o título e o seletor de mês já dizem isso */}
                    <div className="pc-mes-topo">
                      <h2 className="qsd8-h2">Seu <span>mês</span></h2>
                      {serie.length > 1 && (
                        <div className="pc-seletor" role="group" aria-label="Escolher o mês">
                          <button type="button" onClick={() => setMesSel(Math.max(0, i - 1))} disabled={i <= 0} aria-label="Mês anterior">‹</button>
                          <span aria-live="polite">{mesPorExtenso(mesIso)} {mesIso.slice(0, 4)}</span>
                          <button type="button" onClick={() => setMesSel(Math.min(ult, i + 1))} disabled={i >= ult} aria-label="Próximo mês">›</button>
                        </div>
                      )}
                    </div>
                    <div className="pc-numeros">
                      <div className="pc-card-comissao">
                        <strong>{valor == null ? "sem registro" : reais(Number(valor))}</strong>
                        <span>de comissão {ehAtual ? "até agora" : `em ${mesPorExtenso(mesIso)}`}</span>
                        {varia != null && ant && (
                          <em className={`pc-varia ${varia > 0 ? "sobe" : varia < 0 ? "desce" : "igual"}`}>
                            {varia > 0 ? "▲" : varia < 0 ? "▼" : "="} {Math.abs(varia)}% em relação a {mesPorExtenso(ant.mes)}
                          </em>
                        )}
                      </div>
                      <div><strong>{ehAtual ? m.pedidos : sel.pedidos}</strong><span>{Number(ehAtual ? m.pedidos : sel.pedidos) === 1 ? "pedido com o seu cupom" : "pedidos com o seu cupom"}</span></div>
                      <div><strong>{ehAtual ? m.videos_uteis_no_mes : "–"}</strong><span>{ehAtual ? "vídeos que contaram para a sua faixa neste mês" : "vídeos que contaram: só aparece no mês atual"}</span></div>
                      <div><strong>{ehAtual ? m.videos_uteis_no_trimestre : "–"}</strong><span>{ehAtual ? "vídeos que contaram, somando os últimos 3 meses" : "soma dos 3 meses: só aparece no mês atual"}</span></div>
                    </div>
                    {temComissao && <GraficoVendas meses={serie} escolhido={i} aoEscolher={setMesSel} atualizadoEm={d.atualizado_em} />}
                  </>
                );
              })()}
              {taxaMes != null && (
                <p className="pc-taxa pc-info"><span aria-hidden="true">ⓘ</span> A sua comissão é {String(Math.round(taxaMes * 1000) / 10).replace(".", ",")}% do valor de cada pedido feito com o seu cupom.</p>
              )}
              {/* Bianca: faixa atual + progresso da Prata num bloco só, agrupado por assunto (antes era uma lista de frases).
                  O título do progresso depende da faixa atual: quem já está na Prata não tem a Prata como "próxima". */}
              {(() => {
                const faixaAtual = fech?.linhas[0]?.faixa ?? null;
                const tituloMeta = faixaAtual === "Prata" ? "Para continuar na Prata"
                  : faixaAtual === "Ouro" ? "Mínimo da Prata"
                  : "Próxima faixa: Prata";
                const videos = Number(m.videos_uteis_no_trimestre);
                const vendas = Number(m.vendas);
                const pct = (v: number, meta: number) => `${Math.min(100, Math.round((v / meta) * 100))}%`;
                return (
                  <section className="pc-progresso" aria-label="Sua faixa e o que falta">
                    <div className="pc-prog-atual">
                      <p className="pc-prog-rotulo">Sua faixa atual</p>
                      <p className="pc-prog-faixa">{faixaAtual ?? "—"}</p>
                      {taxaMes != null && <p className="pc-prog-pct">{String(Math.round(taxaMes * 1000) / 10).replace(".", ",")}%<span> de comissão</span></p>}
                      {/* legado (piso_30): 30% sempre; a faixa muda o que se pede e os envios, não a comissão (Olivia, 08/10) */}
                      <p className="pc-prog-nota">{d.legado
                        ? "Os seus 30% não mudam com a faixa. Ela muda o que a gente pede e os envios."
                        : "A faixa muda a sua comissão, o que a gente pede e os envios."}</p>
                    </div>
                    <div className="pc-prog-meta">
                      <p className="pc-prog-rotulo">{tituloMeta}</p>
                      <div className="pc-prog-linha">
                        <p><strong>Vídeos úteis</strong><span>{videos} de {PRATA_VIDEOS} vídeos</span></p>
                        <div className="pc-prog-barra" role="progressbar" aria-valuemin={0} aria-valuemax={PRATA_VIDEOS} aria-valuenow={videos}><i style={{ width: pct(videos, PRATA_VIDEOS) }} /></div>
                        <p className="pc-prog-status">{faltaVideos > 0
                          ? `Falta${faltaVideos === 1 ? "" : "m"} ${faltaVideos} ${faltaVideos === 1 ? "vídeo útil" : "vídeos úteis"} ${faixaAtual === "Prata" ? "para continuar na Prata" : "para alcançar a próxima faixa"}.`
                          : "Meta de vídeos batida ✓"}</p>
                      </div>
                      <div className="pc-prog-linha">
                        <p><strong>Meta de vendas</strong><span>{reais(vendas)} de {reais(PRATA_VENDA)}</span></p>
                        <div className="pc-prog-barra" role="progressbar" aria-valuemin={0} aria-valuemax={PRATA_VENDA} aria-valuenow={vendas}><i style={{ width: pct(vendas, PRATA_VENDA) }} /></div>
                        <p className="pc-prog-status">{faltaVenda > 0 ? `Faltam ${reais(faltaVenda)} em vendas neste mês.` : "Meta de vendas batida ✓"}</p>
                      </div>
                      <p className="pc-prog-rodape">Sua nova faixa será definida no início do próximo mês.</p>
                    </div>
                  </section>
                );
              })()}
            </Win>

            <Win name="MEUS-VIDEOS.MOV">
              <div className="qsd8-eyebrow">// últimos 6 meses</div>
              <h2 className="qsd8-h2">Seus <span>vídeos</span></h2>
              {d.videos.length === 0 && <p className="qsd8-sub">Ainda não achamos post seu com a @comidadedragao marcada. Marque a marca, ou poste em collab, e ele aparece aqui.</p>}
              <div className="pc-videos">
                {d.videos.map((v) => (
                  <article className="pc-video" key={v.url}>
                    <header>
                      <span className="pc-data">{dataCurta(v.publicado_em)}</span>
                      <a href={v.url} target="_blank" rel="noopener noreferrer">abrir o post ↗</a>
                      {!v.e_video && <span className="pc-selo neutro">foto ou carrossel</span>}
                    </header>
                    <p>
                      <span className={`pc-selo ${v.util === "sim" ? "sim" : v.util === "nao" ? "nao" : "neutro"}`}>
                        {v.util === "sim" ? "vídeo útil" : v.util === "nao" ? "não contou" : "em avaliação"}
                      </span>{" "}
                      {v.util === "em_avaliacao" ? "Ainda não avaliamos este post." : v.util === "sim" ? (v.conta_para_a_faixa ? "Conta para a sua faixa." : "") : v.util_texto}
                    </p>
                    {v.util === "sim" && !v.conta_para_a_faixa && (
                      <p className="pc-aviso">Ainda não entra na sua faixa: este post não está ligado ao seu cupom. Avise no grupo.</p>
                    )}
                    {v.anuncio && (
                      <p>
                        <span className="pc-selo neutro">anúncio: {ANUNCIO_ROTULO[v.anuncio] ?? v.anuncio.replace(/_/g, " ")}</span>{" "}
                        {v.anuncio_texto}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </Win>

            <Win name="VIDEO-UTIL.TXT" inverted>
              <h2 className="qsd8-h2">O que é <span>vídeo útil</span></h2>
              <p className="qsd8-sub" style={{ color: "var(--paper)" }}>É o vídeo que conta para a sua faixa. Ele precisa de 5 coisas:</p>
              <ol className="pc-regra">
                <li><strong>Marcar a @comidadedragao</strong>, no post ou em collab.</li>
                <li><strong>Ser sobre a Comida de Dragão.</strong> Aparecer só de passagem não conta.</li>
                <li><strong>Mostrar o produto de verdade:</strong> seu pet comendo, ou você falando com o pacote na mão.</li>
                <li><strong>Dar para ver:</strong> imagem nítida e o nome do pacote à vista.</li>
                <li><strong>Ficar de fora:</strong> criança em cena, imagem feita por IA, voz fingindo ser o pet e falar mal do produto.</li>
              </ol>
              <p className="qsd8-note" style={{ color: "var(--paper)" }}>Virar anúncio é outra escolha: entre os vídeos, a gente testa os que têm mais chance de vender.</p>
            </Win>

            {refs.length > 0 && (
              <Win name="REFERENCIAS.MOV">
                <h2 className="qsd8-h2">Vídeos que <span>vendem</span></h2>
                <p className="qsd8-sub">Vídeos de creators da Matilha que mais venderam como anúncio. Abra e repare em como cada um começa e no que mostra.</p>
                <ul className="pc-refs">
                  {refs.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">{r.creator ? `@${r.creator}` : "abrir o vídeo"} ↗</a>
                      {r.no_ar && <span className="pc-selo sim">no ar agora</span>}
                      {r.creator && d.creator.instagram && r.creator.toLowerCase() === d.creator.instagram.toLowerCase() && <span className="pc-selo neutro">é seu</span>}
                    </li>
                  ))}
                </ul>
              </Win>
            )}

            <Win name="COMO-FUNCIONA.TXT" inverted>
              <h2 className="qsd8-h2">Como funciona <span>a faixa</span></h2>
              <p className="qsd8-sub" style={{ color: "var(--paper)" }}>As três faixas e o que cada uma pede estão na página da Matilha.</p>
              <div className="qsd8-btnrow"><Link to="/matilha" className="qsd8-btn">Ver as faixas →</Link></div>
              <p className="qsd8-note" style={{ color: "var(--paper)" }}>Números de {new Date(d.atualizado_em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}.</p>
            </Win>
            <MenuLinks />
          </>
        )}
      </div>
    </div>
  );
};

export default PainelCreator;

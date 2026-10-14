import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { DRAGOES } from "@/data/dragoes";
import "./QueroSerDragao.css";
import "./Matilha.css";
import "./PainelCreator.css";

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

const MES_CURTO = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const reaisCurto = (v: number) => `R$ ${Math.round(Number(v || 0)).toLocaleString("pt-BR")}`;

/* Gráfico de barras das vendas por mês: uma barra por mês, valor escrito em cima, mês embaixo.
   O mês corrente fica destacado e marcado "até agora". */
const GraficoVendas = ({ meses }: { meses: { mes: string; comissao?: number }[] }) => {
  const maior = Math.max(...meses.map((x) => Number(x.comissao) || 0), 1);
  const total = meses.reduce((s, x) => s + (Number(x.comissao) || 0), 0);
  return (
    <figure className="pc-grafico" aria-label={`Sua comissão nos últimos ${meses.length} meses: ${meses.map((x) => `${MESES[Number(x.mes.slice(5, 7)) - 1]} ${reais(Number(x.comissao))}`).join(", ")}`}>
      <div className="pc-barras" aria-hidden="true">
        {meses.map((x, i) => {
          const v = Number(x.comissao) || 0;
          const atual = i === meses.length - 1;
          return (
            <div className={`pc-barra${atual ? " atual" : ""}`} key={x.mes}>
              <span className="pc-barra-valor">{v > 0 ? reaisCurto(v) : "–"}</span>
              <span className="pc-barra-coluna"><i style={{ height: `${Math.max(v > 0 ? 4 : 0, (v / maior) * 100)}%` }} /></span>
              <span className="pc-barra-mes">{MES_CURTO[Number(x.mes.slice(5, 7)) - 1]}</span>
            </div>
          );
        })}
      </div>
      <figcaption>{reais(total)} de comissão nos últimos {meses.length} meses. O mês em destaque vai até hoje.</figcaption>
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

const PainelCreator = () => {
  const [estado, setEstado] = useState<"carregando" | "entrar" | "criar_senha" | "erro" | "pronto">("carregando");
  const [d, setD] = useState<Painel | null>(null);
  const [refs, setRefs] = useState<Referencia[]>([]);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [ocupado, setOcupado] = useState(false);
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
    setD(null); setRefs([]); setAviso(null); setProblema(null); setEstado("entrar");
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
    <div className="qsd8 cf-amber">
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
            <Win name="MEU-PAINEL.EXE" mac className="qsd8-hero-win pc-hero">
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
                  <p className="pc-linha">
                    {d.creator.instagram && <>@{d.creator.instagram} · </>}
                    {d.cupons.length > 0 ? <>cupom <strong>{d.cupons.join(" e ")}</strong></> : <>sem cupom no nosso cadastro</>}
                    {dragao && <> · {dragao}</>}
                  </p>
                </div>
              </div>
              {aviso && <p className="pc-aviso pc-linha">{aviso}</p>}
              <div className="pc-acoes">
                <a href={INFLOWZ} target="_blank" rel="noopener noreferrer">Minha conta na Inflowz ↗</a>
                <button type="button" onClick={sair}>Sair</button>
              </div>
              {!d.pet && (
                <p className="pc-linha pc-fraco">
                  Quer a foto do seu pet aqui? <Link to="/qual-dragao">Faça o quiz do dragão</Link>.
                </p>
              )}
              {d.cupons.length === 0 && (
                <p className="qsd8-note">Sem cupom, não dá para ligar suas vendas e seus vídeos a você. Crie o seu no Inflowz e avise no grupo.</p>
              )}
            </Win>

            <Win name={`${mesPorExtenso(m.mes).toUpperCase()}-ATE-AGORA.SYS`} inverted>
              <div className="qsd8-eyebrow" style={{ color: "var(--lime)" }}>// {mesPorExtenso(m.mes)}, até agora</div>
              <h2 className="qsd8-h2">Seu <span>mês</span></h2>
              <div className="pc-numeros">
                <div><strong>{reais(Number(comissaoMes ?? 0))}</strong><span>de comissão até agora</span></div>
                <div><strong>{m.pedidos}</strong><span>{Number(m.pedidos) === 1 ? "pedido" : "pedidos"}</span></div>
                <div><strong>{m.videos_uteis_no_mes}</strong><span>{Number(m.videos_uteis_no_mes) === 1 ? "vídeo útil no mês" : "vídeos úteis no mês"}</span></div>
                <div><strong>{m.videos_uteis_no_trimestre}</strong><span>{Number(m.videos_uteis_no_trimestre) === 1 ? "vídeo útil em 3 meses" : "vídeos úteis em 3 meses"}</span></div>
              </div>
              {temComissao && <GraficoVendas meses={d.vendas_por_mes!} />}
              {taxaMes != null && <p className="pc-taxa">A sua comissão é {String(Math.round(taxaMes * 1000) / 10).replace(".", ",")}% do valor de cada pedido feito com o seu cupom.</p>}
              <ul className="mat-faixas-notas pc-falta">
                {faltaVideos > 0
                  ? <li>Para a Prata {faltaVideos === 1 ? "falta" : "faltam"} <strong>{faltaVideos} {faltaVideos === 1 ? "vídeo útil" : "vídeos úteis"}</strong>. Ela pede {PRATA_VIDEOS} em 3 meses.</li>
                  : <li>Vídeos: você já tem os <strong>{PRATA_VIDEOS} em 3 meses</strong> que a Prata pede.</li>}
                {faltaVenda > 0
                  ? <li>Para a Prata faltam <strong>{reais(faltaVenda)}</strong> em vendas neste mês. Ela pede {reais(PRATA_VENDA)}.</li>
                  : <li>Vendas: você já passou dos <strong>{reais(PRATA_VENDA)}</strong> no mês que a Prata pede.</li>}
                <li>A sua faixa do mês sai no começo do mês seguinte.</li>
              </ul>
            </Win>

            {fech && fech.linhas.map((l) => (
              <Win name={`FECHAMENTO-DE-${mesPorExtenso(fech.mes).toUpperCase()}.TXT`} key={l.cupom}>
                <div className="qsd8-eyebrow">// fechamento de {mesPorExtenso(fech.mes)}</div>
                <h2 className="qsd8-h2">Faixa <span>{l.faixa}</span></h2>
                <ul className="mat-faixas-notas">
                  <li>Comissão do mês seguinte: <strong>{l.comissao_mes_seguinte}</strong></li>
                  <li>{l.gate_venda}</li>
                  <li>{l.gate_video}</li>
                  <li>{l.original}</li>
                  {l.regua_de_origem && l.regua_de_origem !== "Não se aplica" && <li>{l.regua_de_origem}</li>}
                  {l.linha_frete && <li>{l.linha_frete}</li>}
                  <li><strong>{l.o_que_mais_te_move}</strong></li>
                </ul>
              </Win>
            ))}

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
          </>
        )}
      </div>
    </div>
  );
};

export default PainelCreator;

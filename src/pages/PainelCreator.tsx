import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import { DRAGOES } from "@/data/dragoes";
import "./QueroSerDragao.css";
import "./Matilha.css";
import "./PainelCreator.css";

/* Painel do creator: a página chama UMA função do dash (creator_painel_dados), que só devolve os dados de quem é o
   dono do link. O segredo chega no fim do endereço, depois do "#": essa parte não vai para o servidor. Um script no
   index.html tira o segredo do endereço e guarda na aba antes de a medição carregar. A chave abaixo é a pública. */
const DASH = "https://rbjvwdsfpalyypimfrkf.supabase.co/rest/v1/rpc/";
const DASH_RPC = DASH + "creator_painel_dados";
/* Vídeos de referência: os vídeos de creator que venceram como anúncio. A lista vem do dash e muda sozinha. */
const DASH_RPC_REFERENCIAS = DASH + "creator_painel_referencias";
const DASH_CHAVE_PUBLICA = "sb_publishable_M9kG9XFt-z4SRrciu2G8iQ_F1_FeNro";
const GUARDADO = "cd_painel_creator";

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
  /* foto, nome e dragão do pet, da resposta dele ao quiz "Que dragão mora na sua casa?" (nulo se não fez) */
  pet: { foto_url: string; nome: string | null; dragao: string | null } | null;
  mes_atual: { mes: string; vendas: number; pedidos: number; videos_uteis_no_mes: number; videos_uteis_no_trimestre: number };
  ultimo_fechamento: { mes: string; oficial: boolean; linhas: Extrato[] } | null;
  videos: Video[]; atualizado_em: string; link_vence_em: string;
};

type Referencia = { url: string; creator: string | null; no_ar: boolean };

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

function segredoDoLink(): string | null {
  const doEndereco = window.location.hash.replace(/^#/, "");
  if (/^[0-9a-f]{64}$/.test(doEndereco)) {
    try { sessionStorage.setItem(GUARDADO, doEndereco); } catch { /* aba sem armazenamento: segue só com o que veio */ }
    window.history.replaceState(null, "", window.location.pathname);
    return doEndereco;
  }
  try {
    const guardado = sessionStorage.getItem(GUARDADO);
    return guardado && /^[0-9a-f]{64}$/.test(guardado) ? guardado : null;
  } catch { return null; }
}

const ANUNCIO_ROTULO: Record<string, string> = {
  testado: "já rodou como anúncio", aprovado: "selecionado", aprovado_com_edicao: "selecionado, com edição",
  selecionado: "selecionado para campanha", exotico: "guardado para campanha", a_triar: "ainda não avaliado",
  em_duvida: "em análise", bloqueado: "não conseguimos baixar", eliminado: "não selecionado", descartado_na_selecao: "não selecionado",
};

const PainelCreator = () => {
  const [estado, setEstado] = useState<"carregando" | "sem_link" | "invalido" | "erro" | "pronto">("carregando");
  const [d, setD] = useState<Painel | null>(null);
  const [refs, setRefs] = useState<Referencia[]>([]);

  useEffect(() => {
    let vivo = true;
    const abrir = () => {
      const segredo = segredoDoLink();
      if (!segredo) { setEstado("sem_link"); return; }
      setEstado("carregando");
      fetch(DASH_RPC, {
        method: "POST",
        headers: { apikey: DASH_CHAVE_PUBLICA, "Content-Type": "application/json" },
        body: JSON.stringify({ p_token: segredo }),
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((j) => {
          if (!vivo) return;
          if (j && j.ok === true) {
            setD(j as Painel); setEstado("pronto");
            /* a lista de referência é um extra: se não vier, o painel abre igual, só sem esse bloco */
            fetch(DASH_RPC_REFERENCIAS, {
              method: "POST",
              headers: { apikey: DASH_CHAVE_PUBLICA, "Content-Type": "application/json" },
              body: JSON.stringify({ p_token: segredo }),
            })
              .then((r) => (r.ok ? r.json() : null))
              .then((k) => { if (vivo && k && k.ok === true && Array.isArray(k.videos)) setRefs(k.videos as Referencia[]); })
              .catch(() => { /* sem lista de referência */ });
          }
          else { try { sessionStorage.removeItem(GUARDADO); } catch { /* nada a limpar */ } setD(null); setEstado("invalido"); }
        })
        .catch(() => vivo && setEstado("erro"));
    };
    abrir();
    /* Outro link aberto na mesma aba só troca o que vem depois do "#": a página não recarrega sozinha. */
    const aoTrocar = () => { if (/^#[0-9a-f]{64}$/.test(window.location.hash)) abrir(); };
    window.addEventListener("hashchange", aoTrocar);
    return () => { vivo = false; window.removeEventListener("hashchange", aoTrocar); };
  }, []);

  const m = d?.mes_atual;
  const faltaVideos = m ? Math.max(0, PRATA_VIDEOS - Number(m.videos_uteis_no_trimestre)) : 0;
  const faltaVenda = m ? Math.max(0, PRATA_VENDA - Number(m.vendas)) : 0;
  const fech = d?.ultimo_fechamento && d.ultimo_fechamento.oficial ? d.ultimo_fechamento : null;
  const dragao = d?.pet?.dragao ? DRAGOES.find((x) => x.id === d.pet!.dragao)?.nome ?? null : null;

  return (
    <div className="qsd8 cf-amber">
      <PageMeta title="Meu painel · Matilha do Dragão" description="Painel do creator da Matilha do Dragão." noindex />
      <img className="qsd8-bg" src="/assets/bg-clouds.jpg" alt="" aria-hidden="true" />
      <div className="qsd8-wrap">
        {estado !== "pronto" && (
          <Win name="MEU-PAINEL.EXE" mac className="qsd8-hero-win">
            <DragonLogo className="qsd8-hero-logo" />
            {estado === "carregando" && <p className="qsd8-sub">Abrindo o seu painel…</p>}
            {estado === "sem_link" && (
              <>
                <h1 className="qsd8-title">Painel da <span>Matilha</span></h1>
                <p className="qsd8-sub">Esta página só abre pelo seu link pessoal. Use o link que a gente te mandou.</p>
              </>
            )}
            {estado === "invalido" && (
              <>
                <h1 className="qsd8-title">Este link <span>venceu</span></h1>
                <p className="qsd8-sub">Peça um link novo no grupo da Matilha.</p>
              </>
            )}
            {estado === "erro" && (
              <>
                <h1 className="qsd8-title">Não deu para <span>abrir</span></h1>
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
              <p className="pc-linha pc-fraco">Só quem tem este link vê esta página.</p>
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
                <div><strong>{reais(Number(m.vendas))}</strong><span>em vendas com o seu cupom</span></div>
                <div><strong>{m.pedidos}</strong><span>{Number(m.pedidos) === 1 ? "pedido" : "pedidos"}</span></div>
                <div><strong>{m.videos_uteis_no_mes}</strong><span>{Number(m.videos_uteis_no_mes) === 1 ? "vídeo útil no mês" : "vídeos úteis no mês"}</span></div>
                <div><strong>{m.videos_uteis_no_trimestre}</strong><span>{Number(m.videos_uteis_no_trimestre) === 1 ? "vídeo útil em 3 meses" : "vídeos úteis em 3 meses"}</span></div>
              </div>
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

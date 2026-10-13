import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import DragonLogo from "@/components/DragonLogo";
import PageMeta from "@/components/PageMeta";
import "./QueroSerDragao.css";
import "./Matilha.css";
import "./PainelCreator.css";

/* Painel do creator: a página chama UMA função do dash (creator_painel_dados), que só devolve os dados de quem é o
   dono do link. O segredo chega no fim do endereço, depois do "#": essa parte não vai para o servidor. Um script no
   index.html tira o segredo do endereço e guarda na aba antes de a medição carregar. A chave abaixo é a pública. */
const DASH_RPC = "https://rbjvwdsfpalyypimfrkf.supabase.co/rest/v1/rpc/creator_painel_dados";
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
  mes_atual: { mes: string; vendas: number; pedidos: number; videos_uteis_no_mes: number; videos_uteis_no_trimestre: number };
  ultimo_fechamento: { mes: string; oficial: boolean; linhas: Extrato[] } | null;
  videos: Video[]; atualizado_em: string; link_vence_em: string;
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

  useEffect(() => {
    const segredo = segredoDoLink();
    if (!segredo) { setEstado("sem_link"); return; }
    let vivo = true;
    fetch(DASH_RPC, {
      method: "POST",
      headers: { apikey: DASH_CHAVE_PUBLICA, "Content-Type": "application/json" },
      body: JSON.stringify({ p_token: segredo }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        if (!vivo) return;
        if (j && j.ok === true) { setD(j as Painel); setEstado("pronto"); }
        else { try { sessionStorage.removeItem(GUARDADO); } catch { /* nada a limpar */ } setEstado("invalido"); }
      })
      .catch(() => vivo && setEstado("erro"));
    return () => { vivo = false; };
  }, []);

  const m = d?.mes_atual;
  const faltaVideos = m ? Math.max(0, PRATA_VIDEOS - Number(m.videos_uteis_no_trimestre)) : 0;
  const faltaVenda = m ? Math.max(0, PRATA_VENDA - Number(m.vendas)) : 0;
  const fech = d?.ultimo_fechamento && d.ultimo_fechamento.oficial ? d.ultimo_fechamento : null;

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
                <p className="qsd8-sub">Esta página abre pelo link pessoal que a gente manda para cada creator. Abra pelo link que você recebeu.</p>
              </>
            )}
            {estado === "invalido" && (
              <>
                <h1 className="qsd8-title">Este link <span>venceu</span></h1>
                <p className="qsd8-sub">O link do painel tem prazo. Peça um novo para a gente no grupo da Matilha.</p>
              </>
            )}
            {estado === "erro" && (
              <>
                <h1 className="qsd8-title">Não deu para <span>abrir</span></h1>
                <p className="qsd8-sub">O painel não respondeu agora. Tente de novo em alguns minutos.</p>
              </>
            )}
            <div className="qsd8-btnrow"><Link to="/matilha" className="qsd8-btn ghost">Como funciona a Matilha</Link></div>
          </Win>
        )}

        {estado === "pronto" && d && m && (
          <>
            <Win name="MEU-PAINEL.EXE" mac className="qsd8-hero-win">
              <DragonLogo className="qsd8-hero-logo" />
              <div className="qsd8-eyebrow">// só você vê esta página</div>
              <h1 className="qsd8-title">Oi, <span>{d.creator.primeiro_nome ?? "creator"}</span></h1>
              <p className="qsd8-sub">
                {d.creator.instagram && <>@{d.creator.instagram} · </>}
                {d.cupons.length > 0 ? <>cupom <strong>{d.cupons.join(" e ")}</strong></> : <>ainda sem cupom no nosso cadastro</>}
              </p>
              {d.cupons.length === 0 && (
                <p className="qsd8-note">Sem cupom, a gente não consegue ligar suas vendas e seus vídeos a você. Crie o seu no Inflowz e avise no grupo.</p>
              )}
            </Win>

            <Win name={`${mesPorExtenso(m.mes).toUpperCase()}-ATE-AGORA.SYS`} inverted>
              <div className="qsd8-eyebrow" style={{ color: "var(--lime)" }}>// {mesPorExtenso(m.mes)}, até agora</div>
              <h2 className="qsd8-h2">Seu <span>mês</span></h2>
              <div className="pc-numeros">
                <div><strong>{reais(Number(m.vendas))}</strong><span>em vendas com o seu cupom</span></div>
                <div><strong>{m.pedidos}</strong><span>{Number(m.pedidos) === 1 ? "pedido" : "pedidos"}</span></div>
                <div><strong>{m.videos_uteis_no_mes}</strong><span>{Number(m.videos_uteis_no_mes) === 1 ? "vídeo útil no mês" : "vídeos úteis no mês"}</span></div>
                <div><strong>{m.videos_uteis_no_trimestre}</strong><span>nos últimos 3 meses</span></div>
              </div>
              <ul className="mat-faixas-notas pc-falta">
                {faltaVideos > 0
                  ? <li>Para o mínimo da Prata {faltaVideos === 1 ? "falta" : "faltam"} <strong>{faltaVideos} {faltaVideos === 1 ? "vídeo útil" : "vídeos úteis"}</strong> nos últimos 3 meses (são {PRATA_VIDEOS}).</li>
                  : <li>Você já tem os <strong>{PRATA_VIDEOS} vídeos úteis</strong> em 3 meses que a Prata pede.</li>}
                {faltaVenda > 0
                  ? <li>Em venda, {faltaVenda === PRATA_VENDA ? "faltam" : "faltam"} <strong>{reais(faltaVenda)}</strong> no mês para os {reais(PRATA_VENDA)} da Prata.</li>
                  : <li>Você já passou dos <strong>{reais(PRATA_VENDA)}</strong> de venda no mês que a Prata pede.</li>}
                <li>A faixa do mês sai no fechamento, no começo do mês seguinte.</li>
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
              {d.videos.length === 0 && <p className="qsd8-sub">Ainda não achamos post seu marcando a @comidadedragao. Marque a marca ou poste em colab para ele aparecer aqui.</p>}
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
                      {v.util === "em_avaliacao" ? "A gente ainda não avaliou este post." : v.util_texto}
                    </p>
                    {v.util === "sim" && !v.conta_para_a_faixa && (
                      <p className="pc-aviso">Este post chegou sem o seu cupom, então ainda não entra na conta da sua faixa. Avise a gente no grupo.</p>
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

            <Win name="COMO-FUNCIONA.TXT" inverted>
              <h2 className="qsd8-h2">Como funciona <span>a faixa</span></h2>
              <p className="qsd8-sub" style={{ color: "var(--paper)" }}>As três faixas, o que cada uma pede e como é o envio do produto estão na página da Matilha.</p>
              <div className="qsd8-btnrow"><Link to="/matilha" className="qsd8-btn">Ver as faixas →</Link></div>
              <p className="qsd8-note" style={{ color: "var(--paper)" }}>Números atualizados em {new Date(d.atualizado_em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}.</p>
            </Win>
          </>
        )}
      </div>
    </div>
  );
};

export default PainelCreator;

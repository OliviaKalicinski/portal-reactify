import { useEffect, useState } from "react";
import { submitLpLead } from "@/lib/lpLeads";
import { formatPhoneBR, isValidPhoneBR } from "@/lib/phone";
import "./LeadPopup.css";

/* ──────────────────────────────────────────────────────────────
   POPUP DE CAPTURA DE LEAD — nome + WhatsApp, em todas as LPs.

   Clonado do popup que rodou na /mordida (commit 5278bfa, removido no
   5246c1e quando a LP virou venda) — mesma estrutura, mesma disciplina de
   erro. O que mudou: destino único (dash-lets-fly, tabela `lp_leads`) e o
   gatilho, que deixou de ser tempo fixo.

   POR QUE NÃO É "5s FIXO" (decidido com a Olivia, 28/07):
   as LPs de dor prendem 4 a 13 segundos de tempo engajado no GA4. Um popup
   aos 5s cobre a oferta antes da pessoa entender a página — justo onde a
   ATENÇÃO já é o gargalo medido. Então o gatilho é o primeiro que acontecer:
     · 50% de scroll  → sinal de interesse, independe da velocidade de leitura
     · 15s            → pra quem lê devagar sem rolar
     · exit-intent    → cursor saindo pela borda de cima (só desktop)
   com piso de 5s: nunca aparece na largada.
   Na /mordida (28s) e /conheca (45s) o gatilho de tempo dispara antes do
   scroll, então o comportamento fica perto do popup original.

   FREQUÊNCIA: uma vez a cada 30 dias por pessoa; quem já deixou o telefone
   não vê mais (localStorage). Fechar no ✕ ou no "agora não" também conta.

   OFERTA: novidade em primeira mão, direto do dragão. Sem cupom — decisão da
   Olivia em 28/07: a fábrica de cupons já custa 13,9% do faturamento bruto e
   um cupom aqui competiria com o dos influenciadores. A lista da Mordida
   provou que a moeda não-monetária captura (84 inscritos, cupom nenhum).
   A copy fala simples e não menciona "Caverna": quem está numa LP de dor não
   sabe o que é a Caverna, e explicar isso ali custa mais atenção do que vale.
   ────────────────────────────────────────────────────────────── */

/* Cachorro no notebook — o MESMO gif do card do quiz na Caverna (Portal.tsx,
   GIFS.quiz), que é o card "o dragão quer te conhecer". Reusa o asset que já
   representa esse convite no portal, em vez de trazer uma cena nova.
   Loop: gif do Giphy repete infinito por padrão — é o mesmo comportamento que
   ele já tem no card do Portal. */
const DOG_PC_GIF =
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJxNHpkYTNjYmI2cTlpOTV4ZTQxZG5ia3VpMnpvamNuZjBzdWEwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1kkxWqT5nvLXupUTwK/giphy.gif";

const DISMISS_KEY = "cdd_leadpopup_dismissed_at";
const DONE_KEY = "cdd_leadpopup_done";
const DISMISS_DAYS = 30;
const FLOOR_MS = 5000; // piso: nunca antes disso
const TIME_MS = 15000; // gatilho por tempo
const SCROLL_RATIO = 0.5; // gatilho por scroll

type Props = {
  /** slug da LP — vira `popup_<slug>` na coluna origem. Ex.: "alergia" */
  slug: string;
  /** título do popup. Default serve pra qualquer LP. */
  title?: string;
  /** subtítulo — o que a pessoa ganha. */
  subtitle?: string;
  /** gif do topo. Default: o cachorro no notebook, mesmo asset do card do
   *  quiz na Caverna. Trocar só se a LP pedir outra cena. */
  gif?: string;
  /** Seletor do bloco que precisa SAIR da tela antes do popup poder abrir.
   *  Ex.: ".grb-hero". Quando passado, o gatilho de tempo é desligado e o
   *  popup só abre depois que a pessoa rolou além desse bloco.
   *  Pedido da Olivia em 28/07 pra /grub: em página longa, `50% de scroll`
   *  quase nunca dispara primeiro (50% de 8.400px é fundo demais), então na
   *  prática quem abria era o timer de 15s — no meio da leitura, já que as
   *  LPs de dor prendem 21 a 33s. "Passou do hero" é o sinal de interesse
   *  que ela pediu, e não depende do tamanho da página. */
  aposSeletor?: string;
};

const jaResolvido = (): boolean => {
  try {
    if (localStorage.getItem(DONE_KEY)) return true;
    const at = localStorage.getItem(DISMISS_KEY);
    if (!at) return false;
    return Date.now() - Number(at) < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false; // storage indisponível (aba privada) — mostra, não quebra
  }
};

const marcar = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* sem storage, segue sem quebrar */
  }
};

const LeadPopup = ({
  slug,
  title = "Fica sabendo primeiro",
  subtitle = "Deixa teu nome e WhatsApp: o dragão te avisa de produto novo, promoção e conteúdo antes de todo mundo.",
  gif = DOG_PC_GIF,
  aposSeletor,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const valid = name.trim().length >= 2 && isValidPhoneBR(phone);

  // ── gatilho: scroll 50% · 15s · exit-intent — o que vier primeiro, com piso de 5s
  //    Com `aposSeletor`: só depois que o bloco indicado sai da tela, e SEM timer.
  useEffect(() => {
    if (jaResolvido()) return;

    let armed = false; // piso de 5s cumprido
    let fired = false;

    let limpar = () => {};

    const abrir = () => {
      if (fired || !armed) return;
      fired = true;
      setOpen(true);
      limpar();
    };

    const onScroll = () => {
      if (aposSeletor) {
        // passou do bloco? (o rodapé dele já saiu por cima da dobra)
        const alvo = document.querySelector(aposSeletor);
        if (alvo && alvo.getBoundingClientRect().bottom <= 0) abrir();
        return;
      }
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      if (total > 0 && h.scrollTop / total >= SCROLL_RATIO) abrir();
    };

    const onLeave = (e: MouseEvent) => {
      // só conta saída pela borda de cima (barra de endereço / fechar aba)
      if (e.clientY <= 0) abrir();
    };

    const floor = setTimeout(() => {
      armed = true;
      onScroll(); // quem já rolou durante os 5s abre agora
    }, FLOOR_MS);
    // com gatilho por bloco não existe timer: quem não rolou, não viu a oferta
    const timer = aposSeletor ? undefined : setTimeout(abrir, TIME_MS);

    limpar = () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
      if (timer) clearTimeout(timer);
      clearTimeout(floor);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onLeave);

    return limpar;
  }, []);

  // trava o scroll do fundo enquanto o popup está aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const fechar = () => {
    setOpen(false);
    if (status !== "done") marcar(DISMISS_KEY, String(Date.now()));
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || status === "sending") return;
    setStatus("sending");
    await submitLpLead({ name, phone, slug });
    marcar(DONE_KEY, "1"); // não pergunta de novo, mesmo se o insert falhar
    setStatus("done"); // sucesso pra pessoa; erro fica no console
  };

  if (!open) return null;

  return (
    <div
      className="ldp-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={fechar}
    >
      <div className="ldp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ldp-close" onClick={fechar} aria-label="Fechar">
          ✕
        </button>

        <div className="ldp-palco">
          <img className="ldp-gif" src={gif} alt="" loading="lazy" decoding="async" />
        </div>

        {status === "done" ? (
          <div className="ldp-body ldp-done">
            <strong className="ldp-done-mark">Pronto!</strong>
            <span className="ldp-done-sub">
              Teu contato tá salvo. O dragão te chama quando tiver novidade.
            </span>
            {/* fecha e devolve a pessoa pra página. Antes levava pra /biblioteca,
                o que tirava do funil quem estava lendo uma LP de produto. */}
            <button className="ldp-btn" onClick={() => setOpen(false)}>
              Continuar lendo
            </button>
          </div>
        ) : (
          <div className="ldp-body">
            <h3 className="ldp-title">{title}</h3>
            <p className="ldp-sub">{subtitle}</p>
            <form className="ldp-form" onSubmit={enviar} noValidate>
              <input
                className="ldp-input"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                aria-label="Seu nome"
              />
              <input
                className="ldp-input"
                type="tel"
                inputMode="numeric"
                placeholder="Seu WhatsApp"
                value={phone}
                onChange={(e) => setPhone(formatPhoneBR(e.target.value))}
                autoComplete="tel"
                aria-label="Seu WhatsApp"
              />
              <button className="ldp-btn" type="submit" disabled={!valid || status === "sending"}>
                {status === "sending" ? "Enviando…" : "Quero entrar"}
              </button>
            </form>
            <button className="ldp-skip" onClick={fechar}>
              agora não
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadPopup;

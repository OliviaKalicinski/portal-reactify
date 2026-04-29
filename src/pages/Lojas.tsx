import { useState } from "react";
import { Link } from "react-router-dom";
import PageMeta from "@/components/PageMeta";
import DragonLogo from "@/components/DragonLogo";
import "./Lojas.css";

interface Loja {
  id: number;
  nome: string;
  tipo: "fisica" | "online" | "eventos";
  cidade?: string;
  estado?: string;
  endereco?: string;
  telefone?: string;
  mapsQuery?: string;
  whatsapp?: string;
}

const LOJAS: Loja[] = [
  // ── RJ ──
  { id: 1,  nome: "DocG",           tipo: "fisica",   cidade: "Rio de Janeiro", estado: "RJ", endereco: "Rua Farme de Amoedo, 116 — Ipanema", telefone: "(21) 97163-1113",  mapsQuery: "Rua+Farme+de+Amoedo+116+Ipanema+Rio+de+Janeiro+RJ" },
  { id: 2,  nome: "Bela Pet",       tipo: "fisica",   cidade: "Rio de Janeiro", estado: "RJ", endereco: "Rua Gomes Carneiro, 71 — Ipanema",     telefone: "(21) 2267-4893",  mapsQuery: "Rua+Gomes+Carneiro+71+Ipanema+Rio+de+Janeiro+RJ" },
  { id: 4,  nome: "Animal.com",     tipo: "fisica",   cidade: "Rio de Janeiro", estado: "RJ", endereco: "Av. Nossa Senhora de Copacabana, 400",  telefone: "(21) 2256-6666",  mapsQuery: "Av+Nossa+Senhora+de+Copacabana+400+Rio+de+Janeiro+RJ" },
  { id: 5,  nome: "Fofichos",       tipo: "fisica",   cidade: "Rio de Janeiro", estado: "RJ", endereco: "Av. Bartolomeu Mitre, 630 — Leblon",    telefone: "(21) 2540-7102",  mapsQuery: "Av+Bartolomeu+Mitre+630+Leblon+Rio+de+Janeiro+RJ" },
  { id: 7,  nome: "Pet do Brad",    tipo: "fisica",   cidade: "Rio de Janeiro", estado: "RJ", endereco: "Av. das Américas, 2111 — Barra da Tijuca", mapsQuery: "Av+das+Americas+2111+Barra+da+Tijuca+Rio+de+Janeiro+RJ" },
  { id: 15, nome: "Pet Fun",        tipo: "fisica",   cidade: "Rio de Janeiro", estado: "RJ", endereco: "Av. Embaixador Abelardo Bueno, 1300 — Barra da Tijuca", mapsQuery: "Av+Embaixador+Abelardo+Bueno+1300+Barra+da+Tijuca+Rio+de+Janeiro+RJ" },
  { id: 16, nome: "Bio Gestos",     tipo: "fisica",   cidade: "Rio de Janeiro", estado: "RJ", endereco: "Rua Conde Afonso Celso, 99 — Jardim Botânico", telefone: "(21) 99349-5534", whatsapp: "5521993495534", mapsQuery: "Rua+Conde+Afonso+Celso+99+Jardim+Botanico+Rio+de+Janeiro+RJ" },
  { id: 17, nome: "Bicho Puro",     tipo: "fisica",   cidade: "Seropédica",     estado: "RJ", endereco: "Rua Euclides Pereira, 1375 — Fazenda Caxias", telefone: "(21) 2681-4101", mapsQuery: "Rua+Euclides+Pereira+1375+Seropedica+RJ" },
  // ── SP ──
  { id: 3,  nome: "Organic4",       tipo: "fisica",   cidade: "São Paulo",      estado: "SP", endereco: "Rua Conde de Porto Alegre, 1665 — Campo Belo", mapsQuery: "Rua+Conde+de+Porto+Alegre+1665+Campo+Belo+Sao+Paulo+SP" },
  { id: 6,  nome: "Pet Collab",     tipo: "fisica",   cidade: "São Paulo",      estado: "SP", endereco: "R. Dr. Miranda de Azevedo, 911 — Vila Anglo Brasileira", mapsQuery: "R+Dr+Miranda+de+Azevedo+911+Vila+Anglo+Brasileira+Sao+Paulo+SP" },
  { id: 10, nome: "Terra Rica",     tipo: "fisica",   cidade: "Ribeirão Preto", estado: "SP", endereco: "Av. Portugal, 1512 — Jardim São Luiz",  mapsQuery: "Av+Portugal+1512+Jardim+Sao+Luiz+Ribeirao+Preto+SP" },
  { id: 11, nome: "Loja da Ollie",  tipo: "fisica",   cidade: "Mairiporã",      estado: "SP", endereco: "R. Padre Celestino André Trevisan, 621", mapsQuery: "R+Padre+Celestino+Andre+Trevisan+621+Mairipora+SP" },
  { id: 13, nome: "Clube AUAU",     tipo: "fisica",   cidade: "Santos",         estado: "SP", endereco: "Av. Conselheiro Nébias, 516 — Paquetá", telefone: "(13) 99163-5431", whatsapp: "5513991635431", mapsQuery: "Av+Conselheiro+Nebias+516+Santos+SP" },
  // ── PR ──
  { id: 14, nome: "Petzito",        tipo: "fisica",   cidade: "Curitiba",       estado: "PR", endereco: "R. Prof. Ulisses Vieira, 538 — Vila Izabel", telefone: "(41) 2112-3539", mapsQuery: "R+Prof+Ulisses+Vieira+538+Vila+Izabel+Curitiba+PR" },
  { id: 18, nome: "JoliPets",       tipo: "eventos",  cidade: "Curitiba",       estado: "PR", telefone: "(41) 92001-8366", whatsapp: "5541920018366" },
  // ── MT ──
  { id: 12, nome: "Mel Pet",        tipo: "fisica",   cidade: "Cuiabá",         estado: "MT", endereco: "Av. Oito de Abril, 88 — Popular", telefone: "(65) 99820-8322", whatsapp: "5565998208322", mapsQuery: "Av+Oito+de+Abril+88+Cuiaba+MT" },
  // ── MG ──
  { id: 21, nome: "Pet Box Store",  tipo: "fisica",   cidade: "Belo Horizonte", estado: "MG", endereco: "Rua Santa Monica, 160 — Betânia", mapsQuery: "Rua+Santa+Monica+160+Betania+Belo+Horizonte+MG" },
  { id: 20, nome: "Hotelzinho da Ana", tipo: "fisica", cidade: "Montes Claros", estado: "MG", telefone: "(38) 99124-2845", whatsapp: "5538991242845" },
  // ── RS ──
  { id: 19, nome: "Quintal Pet",    tipo: "fisica",   cidade: "Porto Alegre",   estado: "RS", endereco: "R. Giordano Bruno, 82 — Rio Branco", mapsQuery: "R+Giordano+Bruno+82+Porto+Alegre+RS" },
  // ── MS ──
  { id: 22, nome: "Nature Vet",     tipo: "online",   cidade: "Campo Grande",   estado: "MS", telefone: "(67) 99271-4029", whatsapp: "5567992714029" },
  // ── Online ──
  { id: 23, nome: "Pipoer Pet",     tipo: "online" },
  { id: 24, nome: "Cachorrindo",    tipo: "online" },
  { id: 25, nome: "Natural Pet",    tipo: "online" },
  { id: 26, nome: "Fandog",         tipo: "online" },
  { id: 27, nome: "Goodlife",       tipo: "online" },
];

const ESTADOS = ["Todos", "RJ", "SP", "PR", "MG", "MT", "RS", "MS", "Online"];

const estadoFromFilter = (f: string, l: Loja) => {
  if (f === "Todos") return true;
  if (f === "Online") return l.tipo === "online";
  return l.estado === f;
};

export default function Lojas() {
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  const lojasFiltradas = LOJAS.filter(l => {
    const matchEstado = estadoFromFilter(filtro, l);
    const matchBusca = busca.trim() === "" || l.nome.toLowerCase().includes(busca.toLowerCase()) || (l.cidade ?? "").toLowerCase().includes(busca.toLowerCase());
    return matchEstado && matchBusca;
  });

  const fisicas = lojasFiltradas.filter(l => l.tipo === "fisica").length;
  const online  = lojasFiltradas.filter(l => l.tipo === "online" || l.tipo === "eventos").length;

  return (
    <div className="lojas-page">
      <PageMeta
        title="Onde Encontrar — Comida de Dragão"
        description="+30 lojas parceiras em SP, RJ e todo o Brasil. Encontre Comida de Dragão perto de você."
        image="/assets/images/canal-dragao-cover.png"
      />

      {/* HEADER */}
      <header className="lojas-header">
        <Link to="/portal" className="lojas-back">← Portal</Link>
        <DragonLogo className="lojas-logo" />
      </header>

      {/* HERO */}
      <section className="lojas-hero">
        <div className="lojas-hero-eyebrow">// onde encontrar</div>
        <h1 className="lojas-hero-title">
          +30 lojas<br /><span className="lojas-hero-accent">parceiras</span>
        </h1>
        <p className="lojas-hero-sub">
          Comida de Dragão em pet shops, lojas naturais e online — pelo Brasil todo.
        </p>
      </section>

      {/* FILTROS */}
      <div className="lojas-filters-wrap">
        <div className="lojas-search-wrap">
          <input
            type="text"
            className="lojas-search"
            placeholder="buscar loja ou cidade..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <div className="lojas-filter-chips">
          {ESTADOS.map(e => (
            <button
              key={e}
              type="button"
              className={`lojas-chip${filtro === e ? " active" : ""}`}
              onClick={() => setFiltro(e)}
            >
              {e}
            </button>
          ))}
        </div>
        <div className="lojas-count">
          <span>{fisicas} físicas</span>
          {online > 0 && <span>{online} online</span>}
        </div>
      </div>

      {/* GRID */}
      <div className="lojas-grid">
        {lojasFiltradas.map(loja => (
          <div key={loja.id} className={`loja-card loja-card-${loja.tipo}`}>
            {/* TAG tipo */}
            <div className="loja-tag-row">
              {loja.tipo === "fisica"  && <span className="loja-tag loja-tag-fisica">Física</span>}
              {loja.tipo === "online"  && <span className="loja-tag loja-tag-online">Online</span>}
              {loja.tipo === "eventos" && <span className="loja-tag loja-tag-eventos">Eventos</span>}
              {loja.estado && <span className="loja-estado">{loja.estado}{loja.cidade ? ` · ${loja.cidade}` : ""}</span>}
            </div>

            <div className="loja-nome">{loja.nome}</div>

            {loja.endereco && (
              <div className="loja-endereco">📍 {loja.endereco}</div>
            )}

            {loja.telefone && (
              <div className="loja-telefone">📞 {loja.telefone}</div>
            )}

            {/* AÇÕES */}
            <div className="loja-actions">
              {loja.mapsQuery && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${loja.mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="loja-btn loja-btn-maps"
                >
                  Abrir no Maps →
                </a>
              )}
              {loja.whatsapp && (
                <a
                  href={`https://wa.me/${loja.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="loja-btn loja-btn-wa"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}

        {lojasFiltradas.length === 0 && (
          <div className="lojas-empty">
            Nenhuma loja encontrada para esse filtro.
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="lojas-footer">
        <p>Quer cadastrar sua loja? <a href="mailto:somos@letsfly.com.br">somos@letsfly.com.br</a></p>
        <Link to="/portal" className="lojas-back-bottom">← Voltar ao Portal</Link>
      </footer>
    </div>
  );
}

import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

/* Code-splitting por rota — cada página vira um chunk separado.
   Ganho crítico em LPs de tráfego pago: o usuário só baixa
   o JS daquela LP, não o do portal inteiro. */
const Portal = lazy(() => import("./pages/Portal.tsx"));
const Biblioteca = lazy(() => import("./pages/Biblioteca.tsx"));
const Imprensa = lazy(() => import("./pages/Imprensa.tsx"));
const Quizzes = lazy(() => import("./pages/Quizzes.tsx"));
const Parceiros = lazy(() => import("./pages/Parceiros.tsx"));
const Produtos = lazy(() => import("./pages/Produtos.tsx"));
const Lojas = lazy(() => import("./pages/Lojas.tsx"));
const Matilde = lazy(() => import("./pages/Matilde.tsx"));
const QueroSerDragao = lazy(() => import("./pages/QueroSerDragao.tsx"));
const Matilha = lazy(() => import("./pages/Matilha.tsx"));
const Conheca = lazy(() => import("./pages/Conheca.tsx"));
const Curiosidade = lazy(() => import("./pages/Curiosidade.tsx"));
const OqueFalam = lazy(() => import("./pages/OqueFalam.tsx"));
const Veterinarios = lazy(() => import("./pages/Veterinarios.tsx"));
const Original = lazy(() => import("./pages/Original.tsx"));
const Suplemento = lazy(() => import("./pages/Suplemento.tsx"));
const Obrigado = lazy(() => import("./pages/Obrigado.tsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const Ciencia = lazy(() => import("./pages/Ciencia.tsx"));
const Alergia = lazy(() => import("./pages/Alergia.tsx"));
const Mordida = lazy(() => import("./pages/Mordida.tsx"));
const Idoso = lazy(() => import("./pages/Idoso.tsx"));
const GatoCoceira = lazy(() => import("./pages/GatoCoceira.tsx"));
/* LPs do Google Ads — clones das de dor, com desconto proprio e sem peca do Meta.
   Prefixo /g/ pra separar o trafego de busca no GA4 num filtro so. */
const AlergiaGoogle = lazy(() => import("./pages/AlergiaGoogle.tsx"));
const IdosoGoogle = lazy(() => import("./pages/IdosoGoogle.tsx"));
const GatoCoceiraGoogle = lazy(() => import("./pages/GatoCoceiraGoogle.tsx"));
const Grub = lazy(() => import("./pages/Grub.tsx"));
const Impacto = lazy(() => import("./pages/Impacto.tsx"));
// FORA DO AR (campanha sazonal Semana M.A. 5–12 jun) — descomentar pra reativar:
// const PlanetaDragao = lazy(() => import("./pages/PlanetaDragao.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0A0A0A" }} />}>
            <Routes>
              <Route path="/" element={<Portal />} />
              <Route path="/portal" element={<Navigate to="/" replace />} />
              <Route path="/biblioteca" element={<Biblioteca />} />
              <Route path="/imprensa" element={<Imprensa />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/parceiros" element={<Parceiros />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/lojas" element={<Lojas />} />
              <Route path="/matilde" element={<Matilde />} />
              <Route path="/quero-ser-dragao" element={<QueroSerDragao />} />
              {/* Onboarding de criadores "Bem-vindo à Matilha" — página oculta, só via link direto (igual /original) */}
              <Route path="/matilha" element={<Matilha />} />
              <Route path="/conheca" element={<Conheca />} />
              {/* LP PRÉ-LANÇAMENTO · Drop Mordida V2 — captura de lead (lista de espera), público frio */}
              <Route path="/mordida" element={<Mordida />} />
              {/* LP campanha CURIOSIDADE (larva) — Kit Original */}
              <Route path="/curiosidade" element={<Curiosidade />} />
              {/* LP prova social — mural de reviews reais + CTA suave pro Kit */}
              <Route path="/oquefalam" element={<OqueFalam />} />
              <Route path="/veterinarios" element={<Veterinarios />} />
              {/* LPs de produto — tráfego pago, fora do portal */}
              <Route path="/original" element={<Original />} />
              <Route path="/suplemento" element={<Suplemento />} />
              {/* Página de obrigado pós-checkout Yampi */}
              <Route path="/obrigado" element={<Obrigado />} />
              {/* Manual do Criador · Casa de Lives — link direto, fora do portal */}
              <Route path="/onboarding" element={<Onboarding />} />
              {/* LP 10 motivos científicos — material pra enviar a clientes */}
              <Route path="/ciencia" element={<Ciencia />} />
              {/* CAMPANHA SAZONAL · Semana do Meio Ambiente (5–12 jun). Tirar do ar apos 12/jun: comentar esta rota + o lazy import do PlanetaDragao. Ver LANDING-PAGES.md */}
              {/* FORA DO AR — reativar: descomentar esta rota + o lazy import acima
              <Route path="/planeta-dragao" element={<PlanetaDragao />} /> */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              {/* LP campanha ALERGIA — Kit Cachorro */}
              <Route path="/alergia" element={<Alergia />} />
              {/* LP campanha CÃO IDOSO — Kit Cachorro */}
              <Route path="/idoso" element={<Idoso />} />
              {/* LP campanha GATO QUE SE COÇA — Kit para Gatos */}
              <Route path="/gato-coceira" element={<GatoCoceira />} />
              <Route path="/g/alergia" element={<AlergiaGoogle />} />
              <Route path="/g/idoso" element={<IdosoGoogle />} />
              <Route path="/g/gato-coceira" element={<GatoCoceiraGoogle />} />
              {/* LP campanha RÉPTEIS & ANFÍBIOS — Grub */}
              <Route path="/grub" element={<Grub />} />
              {/* Página IMPACTO — estática em public/impacto/, exibida via iframe */}
              <Route path="/impacto" element={<Impacto />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

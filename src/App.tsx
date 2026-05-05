import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

/* Code-splitting por rota — cada página vira um chunk separado.
   Ganho crítico em LPs de tráfego pago: o usuário só baixa
   o JS daquela LP, não o do portal inteiro. */
const Index = lazy(() => import("./pages/Index.tsx"));
const Portal = lazy(() => import("./pages/Portal.tsx"));
const Biblioteca = lazy(() => import("./pages/Biblioteca.tsx"));
const Imprensa = lazy(() => import("./pages/Imprensa.tsx"));
const Quizzes = lazy(() => import("./pages/Quizzes.tsx"));
const Parceiros = lazy(() => import("./pages/Parceiros.tsx"));
const Produtos = lazy(() => import("./pages/Produtos.tsx"));
const Lojas = lazy(() => import("./pages/Lojas.tsx"));
const Matilde = lazy(() => import("./pages/Matilde.tsx"));
const QueroSerDragao = lazy(() => import("./pages/QueroSerDragao.tsx"));
const Original = lazy(() => import("./pages/Original.tsx"));
const Obrigado = lazy(() => import("./pages/Obrigado.tsx"));
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
              <Route path="/" element={<Index />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="/biblioteca" element={<Biblioteca />} />
              <Route path="/imprensa" element={<Imprensa />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/parceiros" element={<Parceiros />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/lojas" element={<Lojas />} />
              <Route path="/matilde" element={<Matilde />} />
              <Route path="/quero-ser-dragao" element={<QueroSerDragao />} />
              {/* LPs de produto — tráfego pago, fora do portal */}
              <Route path="/original" element={<Original />} />
              {/* Página de obrigado pós-checkout Yampi */}
              <Route path="/obrigado" element={<Obrigado />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

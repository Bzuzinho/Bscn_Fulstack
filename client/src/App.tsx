import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import { useLocation } from "wouter";
import Dashboard from "@/pages/Dashboard";
import Pessoas from "@/pages/Pessoas";
import PessoaDetalhes from "@/pages/PessoaDetalhes";
import Atividades from "@/pages/Atividades";
import Financeiro from "@/pages/Financeiro";
import Inventario from "@/pages/Inventario";
import Comunicacao from "@/pages/Comunicacao";
import Relatorios from "@/pages/Relatorios";
import Configuracoes from "@/pages/Configuracoes";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  const [location] = useLocation();

  // If the app is still loading auth or the user is not authenticated,
  // show the landing page. Allow a dedicated client-side login page at
  // `/login` to be shown even when unauthenticated so the user can submit
  // credentials.
  if (isLoading || !isAuthenticated) {
    if (location === "/login") {
      return (
        <>
          <Login />
          <Toaster />
        </>
      );
    }

    return (
      <>
        <Landing />
        <Toaster />
      </>
    );
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/pessoas/:id" component={PessoaDetalhes} />
              <Route path="/pessoas" component={Pessoas} />
              <Route path="/atividades" component={Atividades} />
              <Route path="/financeiro" component={Financeiro} />
              <Route path="/inventario" component={Inventario} />
              <Route path="/comunicacao" component={Comunicacao} />
              <Route path="/relatorios" component={Relatorios} />
              <Route path="/configuracoes" component={Configuracoes} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

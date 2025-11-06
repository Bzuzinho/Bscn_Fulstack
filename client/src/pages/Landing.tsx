import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity, TrendingUp } from "lucide-react";
import logoPath from "@assets/BSCN_Logo_1759963867913.png";

export default function Landing() {
  const handleLogin = () => {
    // navigate to a client-side login page where the user can enter credentials
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-background">
        <div className="absolute inset-0 bg-[url('/placeholder-pool.jpg')] bg-cover bg-center opacity-5" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="flex justify-center mb-8">
            <img 
              src={logoPath} 
              alt="Benedita Sport Club" 
              className="h-32 w-32 object-contain"
              data-testid="img-club-logo"
            />
          </div>
          
          <h1 className="text-5xl font-bold mb-6" data-testid="text-hero-title">
            Benedita Sport Club
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Sistema de Gestão Integrado para o clube. Gerir atletas, atividades, finanças e muito mais, tudo num só lugar.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleLogin}
            className="px-8 py-6 text-lg"
            data-testid="button-login"
          >
            Entrar no Sistema
          </Button>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-feature-people">
                    Gestão de Pessoas
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Organize atletas, treinadores e encarregados de educação
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-feature-activities">
                    Atividades
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Agende treinos, provas, estágios e reuniões
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-feature-reports">
                    Relatórios
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Acompanhe o desempenho e gere relatórios detalhados
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t py-6">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p data-testid="text-footer">© {new Date().getFullYear()} Benedita Sport Club. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

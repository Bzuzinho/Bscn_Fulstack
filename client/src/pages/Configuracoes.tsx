import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerir definições do sistema</p>
        </div>
        <Button data-testid="button-save-settings">
          <Save className="h-4 w-4 mr-2" />
          Guardar Alterações
        </Button>
      </div>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral" data-testid="tab-general">Geral</TabsTrigger>
          <TabsTrigger value="clube" data-testid="tab-club">Clube</TabsTrigger>
          <TabsTrigger value="financeiro" data-testid="tab-financial">Financeiro</TabsTrigger>
          <TabsTrigger value="notificacoes" data-testid="tab-notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Definições Gerais</CardTitle>
              <CardDescription>Configure as preferências básicas do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Input id="timezone" value="Europe/Lisbon" data-testid="input-timezone" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Input id="language" value="Português" data-testid="input-language" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Modo Escuro Automático</Label>
                  <p className="text-sm text-muted-foreground">Ativar modo escuro automaticamente</p>
                </div>
                <Switch id="dark-mode" data-testid="switch-dark-mode" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clube" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Clube</CardTitle>
              <CardDescription>Dados da associação e clube</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="club-name">Nome do Clube</Label>
                <Input id="club-name" placeholder="Nome do Clube de Natação" data-testid="input-club-name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="club-nif">NIF</Label>
                <Input id="club-nif" placeholder="Número de Identificação Fiscal" data-testid="input-club-nif" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="club-address">Morada</Label>
                <Input id="club-address" placeholder="Morada do clube" data-testid="input-club-address" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="club-phone">Telefone</Label>
                <Input id="club-phone" placeholder="+351 ..." data-testid="input-club-phone" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="club-email">Email</Label>
                <Input id="club-email" type="email" placeholder="contacto@clube.pt" data-testid="input-club-email" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Financeiras</CardTitle>
              <CardDescription>Definições de pagamentos e mensalidades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda</Label>
                <Input id="currency" value="EUR (€)" data-testid="input-currency" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-fee">Mensalidade Padrão</Label>
                <Input id="monthly-fee" type="number" placeholder="45.00" data-testid="input-monthly-fee" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-reminders">Lembretes Automáticos</Label>
                  <p className="text-sm text-muted-foreground">Enviar lembretes de quotas em atraso</p>
                </div>
                <Switch id="auto-reminders" defaultChecked data-testid="switch-auto-reminders" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>Gerir notificações por email e SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações por email</p>
                </div>
                <Switch id="email-notifications" defaultChecked data-testid="switch-email-notifications" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="payment-notifications">Alertas de Pagamentos</Label>
                  <p className="text-sm text-muted-foreground">Notificar sobre novos pagamentos</p>
                </div>
                <Switch id="payment-notifications" defaultChecked data-testid="switch-payment-notifications" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="activity-notifications">Alertas de Atividades</Label>
                  <p className="text-sm text-muted-foreground">Notificar sobre novas atividades</p>
                </div>
                <Switch id="activity-notifications" defaultChecked data-testid="switch-activity-notifications" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

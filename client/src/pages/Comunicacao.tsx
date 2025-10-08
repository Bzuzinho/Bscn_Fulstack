import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Send, Mail, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const emailHistory = [
  {
    id: 1,
    subject: "Convocatória - Campeonato Regional",
    recipients: "18 atletas",
    date: new Date(2025, 9, 10),
    status: "sent",
  },
  {
    id: 2,
    subject: "Aviso de Quotas em Atraso",
    recipients: "3 sócios",
    date: new Date(2025, 9, 8),
    status: "sent",
  },
  {
    id: 3,
    subject: "Informação sobre Estágio de Verão",
    recipients: "Todos os sócios",
    date: new Date(2025, 9, 5),
    status: "sent",
  },
];

export default function Comunicacao() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comunicação</h1>
          <p className="text-muted-foreground mt-1">Enviar emails e notificações</p>
        </div>
      </div>

      <Tabs defaultValue="novo" className="space-y-4">
        <TabsList>
          <TabsTrigger value="novo" data-testid="tab-new">Novo Email</TabsTrigger>
          <TabsTrigger value="historico" data-testid="tab-history">Histórico</TabsTrigger>
          <TabsTrigger value="modelos" data-testid="tab-templates">Modelos</TabsTrigger>
        </TabsList>

        <TabsContent value="novo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compor Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipients">Destinatários</Label>
                <Select>
                  <SelectTrigger id="recipients" data-testid="select-recipients">
                    <SelectValue placeholder="Selecionar grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os sócios</SelectItem>
                    <SelectItem value="athletes">Apenas atletas</SelectItem>
                    <SelectItem value="coaches">Apenas treinadores</SelectItem>
                    <SelectItem value="guardians">Apenas encarregados</SelectItem>
                    <SelectItem value="juvenis">Escalão Juvenis</SelectItem>
                    <SelectItem value="seniores">Escalão Seniores</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  placeholder="Assunto do email"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  data-testid="input-subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Escreva a sua mensagem aqui..."
                  rows={10}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  data-testid="textarea-message"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" data-testid="button-save-draft">
                  Guardar Rascunho
                </Button>
                <Button data-testid="button-send-email">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <div className="space-y-4">
            {emailHistory.map((email) => (
              <Card key={email.id} className="hover-elevate" data-testid={`email-${email.id}`}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                  <div className="flex-1">
                    <CardTitle className="text-base">{email.subject}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {email.recipients}
                      </span>
                      <span>{email.date.toLocaleDateString("pt-PT")}</span>
                    </div>
                  </div>
                  <Badge className="bg-chart-2 text-white">Enviado</Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="modelos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover-elevate" data-testid="template-1">
              <CardHeader>
                <CardTitle className="text-base">Convocatória para Evento</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Modelo para convocar atletas para eventos e competições
                </p>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" data-testid="button-use-template-1">
                  Usar Modelo
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="template-2">
              <CardHeader>
                <CardTitle className="text-base">Aviso de Quotas</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Modelo para avisar sobre quotas pendentes ou atrasadas
                </p>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" data-testid="button-use-template-2">
                  Usar Modelo
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="template-3">
              <CardHeader>
                <CardTitle className="text-base">Informação Geral</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Modelo para enviar informações gerais aos sócios
                </p>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" data-testid="button-use-template-3">
                  Usar Modelo
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

# Análise de Migração - Sistema Gestão Natação

## 📊 Resumo Executivo

O documento PDF especifica uma estrutura de base de dados **significativamente mais complexa** do que a atual. Esta migração requer:

1. ✅ **Expansão da tabela `users`** com ~30 campos adicionais
2. ✅ **Sistema RBAC completo** (roles, permissions)
3. ✅ **8 novos módulos** de funcionalidade
4. ⚠️ **Decisão crítica sobre arquitetura**: Consolidar ou manter separação pessoas/users

---

## 🔍 Comparação Detalhada

### **NÚCLEO - Tabela `users`**

**✅ Campos já existentes:**
- id, email, firstName, lastName, profileImageUrl, createdAt, updatedAt

**❌ Campos em falta (do PDF + Lógica de Negócio):**
```
numero_socio, estado, name, tipo_mensalidade_id(FK→mensalidades), 
email_verified_at, password, remember_token, role, nif, cartao_cidadao, 
contacto, data_nascimento, sexo, morada, codigo_postal, localidade, 
empresa, escola, estado_civil, ocupacao, nacionalidade, numero_irmaos, 
menor, estado_utilizador, encarregado_id(FK→users), escalao_id(FK→escaloes), 
profile_photo_path, observacoes_config
```

**⚠️ NOTA**: Campo `tipo_mensalidade_id` é crítico para faturação automática

**⚠️ PROBLEMA ARQUITETURAL:**
- **Atual**: Tabela `pessoas` separada da `users`
- **PDF**: Tudo consolidado em `users`
- **Impacto**: Migração complexa, possível perda de dados se mal executada

---

### **RBAC - Sistema de Permissões**

**Status**: ❌ **NÃO IMPLEMENTADO**

**Necessário criar:**
- `roles` (id, name, guard_name)
- `permissions` (id, name, guard_name)
- `role_has_permissions` (ligação N:N)
- `model_has_roles` (ligação polimórfica)
- `model_has_permissions` (ligação polimórfica)

**⚠️ Tabelas Legacy a Consolidar:**
- `tipo_users`, `tipo_user_user`, `tipo_membros` - O PDF sugere consolidar estas tabelas históricas no sistema RBAC. Decisão necessária sobre migração ou deprecação.

---

### **MÓDULOS - Estado Atual vs PDF**

| Módulo | Status Atual | Requerido pelo PDF | Complexidade |
|--------|--------------|-------------------|--------------|
| **Gestão Pessoas** | ✅ Básico | ⚠️ Expandir (consolidar em users) | 🔴 Alta |
| **RGPD** | ❌ Inexistente | ✅ dados_configuracao | 🟡 Média |
| **Escalões** | ✅ Básico | ⚠️ Adicionar user_escaloes (N:N) | 🟢 Baixa |
| **Encarregados** | ✅ Básico | ⚠️ Migrar para encarregado_user | 🟡 Média |
| **Dados Desportivos** | ❌ Inexistente | ✅ dados_desportivos, saude_atletas | 🟡 Média |
| **Treinos/Presenças** | ✅ Básico | ⚠️ Adicionar resultados | 🟢 Baixa |
| **Eventos** | ✅ Como "atividades" | ⚠️ Refinar (eventos, convocatorias, tipos) | 🟡 Média |
| **Financeiro** | ✅ Básico | ⚠️ Expandir massivamente (ver detalhes abaixo) | 🔴 Alta |
| **Patrocínios** | ❌ Inexistente | ✅ Gestão completa contratos | 🟡 Média |
| **Vendas/Stocks** | ❌ Inexistente | ✅ produtos, movimentos, vendas | 🟡 Média |
| **Marketing** | ❌ Inexistente | ✅ notícias, campanhas, CRM | 🟡 Média |
| **Página Web** | ❌ Inexistente | ✅ páginas, calendário público | 🟢 Baixa |

---

## 📑 Módulos Existentes - Detalhamento Completo

### **1. RGPD - Dados Pessoais & Configuração**

**Status**: ❌ **NÃO IMPLEMENTADO**

**Estrutura Requerida:**
- `dados_configuracao` (id, user_id FK, consentimento, data_consentimento, ficheiro_consentimento, declaracao_transporte, data_transporte, ficheiro_transporte, afiliacao, data_afiliacao, ficheiro_afiliacao, timestamps)

**Funcionalidades**: Gestão de consentimentos RGPD, documentos de transporte, afiliações

---

### **2. Escalões - Refinamento (Integração com Centros de Custo)**

**Status**: ⚠️ **PARCIALMENTE IMPLEMENTADO**

**Estrutura Atual:**
- ✅ `escaloes` (id, nome UNIQUE, descricao, timestamps)

**Estrutura em Falta:**
- ❌ `user_escaloes` (id, user_id FK, escalao_id FK, timestamps) - ligação N:N histórica
- ⚠️ Campo direto `users.escalao_id` para estado atual
- ❌ `escaloes.centro_custo_id` (FK → centros_custo) - ligação automática ao centro de custo

**⚠️ LÓGICA DE NEGÓCIO ESCALÕES:**
- **Criação Automática de Centro de Custo**: Ao criar escalão, sistema cria automaticamente centro de custo correspondente
- **Sincronização**: Alterações no nome do escalão atualizam automaticamente o centro de custo
- **Cálculo de Atletas**: Sistema conta automaticamente nº de atletas por escalão para cálculo de proporções

**Funcionalidades**: Histórico de mudanças de escalão, estado atual do atleta, gestão financeira por escalão

---

### **3. Encarregados de Educação - Refinamento**

**Status**: ⚠️ **PRECISA AJUSTE**

**Estrutura Requerida:**
- `encarregado_user` (id, user_id FK atleta, encarregado_id FK user, timestamps)
- ⚠️ Campo direto `users.encarregado_id` para referência rápida

**Nota**: Atual usa tabela `pessoas` separada; PDF consolida em `users`

---

### **4. Dados Desportivos (Saúde, Ficha Atleta)**

**Status**: ❌ **NÃO IMPLEMENTADO**

**Estrutura Requerida:**
- `dados_desportivos` (id, user_id FK, altura, peso, batimento, observacoes, patologias, medicamentos, numero_federacao, pmb, data_inscricao, atestado_medico, data_atestado, informacoes_medicas, arquivo_am_path, timestamps)
- `saude_atletas` (legacy/suprível) (id, user_id FK, patologias, medicamentos, timestamps)

**Funcionalidades**: Ficha médica, dados antropométricos, atestados, federação

---

### **5. Treinos & Presenças & Resultados - Refinamento**

**Status**: ⚠️ **PARCIALMENTE IMPLEMENTADO - REQUER MIGRAÇÃO**

**Estrutura Atual (Legacy):**
- ⚠️ `presencas` (id, atividade_id FK, pessoa_id FK, presente, timestamps) - **ESTRUTURA ANTIGA**

**Estrutura Requerida pelo PDF:**
- `treinos` (id, user_id FK, numero, data, sessao, timestamps)
- `presencas` (id, user_id FK, data, numero_treino, presenca, timestamps) - **NOVA ESTRUTURA**
- `resultados` (id, user_id FK, epoca, data, escalao, competicao, local, piscina, prova, tempo, timestamps)

**⚠️ ATENÇÃO MIGRAÇÃO:**
- Tabela `presencas` deve mudar de `atividade_id`/`pessoa_id` para `user_id`/`numero_treino`
- Campo `presente` (boolean) → `presenca` (pode ser enum/string se necessário)
- Requer migração de dados existentes

**Funcionalidades**: Registo individual de treinos por atleta, presenças, resultados de competições

---

### **6. Eventos & Convocatórias - Refinamento**

**Status**: ⚠️ **PARCIALMENTE IMPLEMENTADO** (como `atividades`)

**Estrutura Atual:**
- ✅ `atividades` básica

**Estrutura Completa Requerida:**
- `eventos` (id, titulo, descricao, transporte, data_inicio, data_fim, local, tipo_evento_id FK, visibilidade [privado|restrito|publico], transporte_disponivel, local_partida, hora_partida, observacoes, convocatoria_path, regulamento_path, convocatoria_id FK, tem_transporte, transporte_descricao, regulamento_id, timestamps)
- `eventos_tipos` (id, nome, cor, icon, timestamps)
- `evento_escalao` (id, evento_id FK, escalao_id FK, timestamps)
- `eventos_users` (id, evento_id FK, user_id FK, convocado, presenca_confirmada, justificacao, timestamps)
- `convocatorias` (id, titulo, data, ficheiro_path, timestamps)

**Funcionalidades**: Gestão completa de eventos, convocatórias, confirmações de presença

---

## 💰 Módulo Financeiro - Detalhamento Completo

**Status Atual**: Apenas `mensalidades` básica implementada

**Estrutura Completa Requerida pelo PDF:**

### **1. Mensalidades & Dados Financeiros**
- ✅ `mensalidades` (id, designacao, valor) - **JÁ EXISTE mas simplificada**
- ❌ `dados_financeiros` (id, user_id, estado_pagamento, numero_recibo, referencia_pagamento, mensalidade_id)

### **2. Faturação (com Geração Automática)**
- ❌ `faturas` (id, user_id, data_fatura, mes YYYY-MM UNIQUE, data_emissao, valor, estado_pagamento, numero_recibo, referencia_pagamento, gerada_automaticamente, epoca)
- ❌ `fatura_itens` (id, fatura_id, descricao, valor_unitario, quantidade, imposto_percentual, total_linha, dados_financeiros_id)
- ❌ `catalogo_fatura_itens` (id, descricao, valor_unitario, imposto_percentual) - itens pré-definidos

**⚠️ LÓGICA DE FATURAÇÃO AUTOMÁTICA:**

**Opção 1 - Geração Mensal:**
- Sistema gera faturas automaticamente no início de cada mês
- Baseado no tipo de mensalidade definido no perfil do utilizador/atleta
- Valor e itens copiados do perfil de mensalidade do atleta

**Opção 2 - Geração Total na Inscrição (RECOMENDADA):**
- Ao registar atleta, sistema gera TODAS as faturas desde o mês de registo até Julho (fim época)
- Faturas ficam com estado "futuro" ou "pendente"
- Quando o mês chega, fatura muda automaticamente para "em dívida" se não paga
- Vantagens: 
  - Visibilidade total do ano letivo
  - Facilita planeamento financeiro
  - Permite pagamentos antecipados
  - Gestão de descontos anuais

**Campos Adicionais Necessários:**
- `users.tipo_mensalidade_id` (FK → mensalidades) - define mensalidade do atleta
- `faturas.mes_referencia` (YYYY-MM) - mês a que se refere a fatura
- `faturas.estado` (futuro|pendente|em_divida|paga|cancelada)
- `faturas.data_vencimento` - quando deve ser paga
- `faturas.gerada_automaticamente` (boolean) - distinguir de faturas manuais

### **3. Contabilidade Analítica (Centros de Custo)**
- ❌ `centros_custo` (id, nome, tipo [escalao|departamento|clube_generico], referencia_externa, escalao_id FK opcional, ativo, percentagem_distribuicao)
- ❌ `lancamentos_financeiros` (id, data, descricao, tipo [receita|despesa], valor, metodo_pagamento, documento_ref, user_id, centro_custo_id, fatura_id)

**⚠️ LÓGICA DE NEGÓCIO CENTROS DE CUSTO:**
- **Escalões como Centros de Custo**: Cada escalão é automaticamente um centro de custo
- **Mensalidades Afetadas**: Mensalidades de atletas ficam afetas ao centro de custo do seu escalão
- **Centro de Custo Genérico**: Clube tem centro de custo genérico que dilui despesas/lucros pelos outros centros proporcionalmente ao nº de atletas
- **Departamentos**: Desportivo, Administrativo, Financeiro são também centros de custo
- **Distribuição Automática**: Sistema calcula proporções baseado em nº de atletas por escalão

### **4. Conciliação Bancária**
- ❌ `extratos_bancarios` (id, conta, data_movimento, descricao, valor, saldo, referencia, ficheiro_id, conciliado, lancamento_id)
- ❌ `mapa_conciliacao` (id, extrato_id, lancamento_id, status [sugerido|confirmado|rejeitado], regra_usada)

**Complexidade**: 🔴 **ALTA** - 8 tabelas interligadas com lógica contabilística

---

## 📋 Novos Módulos - Detalhamento Completo

### **1. Patrocínios**

**Status**: ❌ **NÃO IMPLEMENTADO**

**Estrutura Requerida:**
- `patrocinadores` (id, nome, nif, email, telefone, morada, site, notas, timestamps)
- `patrocinios` (id, patrocinador_id, titulo, tipo [anual|pontual], data_inicio, data_fim, valor_total, contrapartidas, estado [ativo|suspenso|terminado], contrato_path, timestamps)
- `patrocinio_parcelas` (id, patrocinio_id, data_vencimento, valor, pago, data_pagamento, referencia_pagamento, fatura_id, timestamps)
- `patrocinio_metricas` (id, patrocinio_id, impressoes, cliques, exposicoes_eventos, mencoes_social, observacoes, periodo YYYY-MM, timestamps)

**Funcionalidades**: Gestão de contratos, parcelas de pagamento, tracking de ROI

---

### **2. Vendas & Stocks (Merchandising)**

**Status**: ❌ **NÃO IMPLEMENTADO**

**Estrutura Requerida:**
- `produtos` (id, sku, nome, descricao, preco, taxa_iva, ativo, stock_atual, stock_minimo, imagens JSON, timestamps)
- `movimentos_stock` (id, produto_id, tipo [entrada|saida|ajuste], quantidade, motivo, documento_ref, user_id, timestamps)
- `vendas` (id, data, cliente_nome, cliente_nif, total_bruto, total_iva, total_liquido, metodo_pagamento, fatura_id, user_id, timestamps)
- `venda_itens` (id, venda_id, produto_id, descricao, quantidade, preco_unitario, taxa_iva, total_linha, timestamps)

**Funcionalidades**: Gestão de produtos do clube, controlo de stock, vendas e faturação

---

### **3. Marketing/Comunicação**

**Status**: ❌ **NÃO IMPLEMENTADO**

**Estrutura Requerida:**
- `noticias` (id, titulo, slug, resumo, corpo_html, imagem_capa, destaque, publicado_em, autor_id, estado [rascunho|publicado], timestamps)
- `campanhas` (id, nome, objetivo, publico_alvo, canal [email|social|site], data_inicio, data_fim, budget, estado, timestamps)
- `campanha_logs` (id, campanha_id, data, canal, mensagem, alcance, cliques, conversoes, custo, timestamps)
- `crm_interacoes` (id, user_id, tipo [email|telefone|reuniao|outro], assunto, descricao, proximo_passo_data, resultado, timestamps)

**Funcionalidades**: Notícias/comunicados, campanhas marketing, CRM para seguimento

---

### **4. Página Web (Site Público do Clube)**

**Status**: ❌ **NÃO IMPLEMENTADO**

**Estrutura Requerida:**
- `paginas` (id, titulo, slug, corpo_html, visibilidade [publico|membros], publicado_em, autor_id, estado, timestamps)
- `patrocinadores_site` (id, nome, logo_path, url, ordem, ativo, timestamps) - *ou usar tabela patrocinadores com flags*
- `calendario_publico` - *pode expor de eventos com flag visibilidade=publico*

**Funcionalidades**: CMS para site público, gestão de conteúdos, calendário de eventos

---

## 💡 Lógica de Negócio Crítica - Resumo

### **Sistema de Centros de Custo Integrado**

**Estrutura:**
1. **Escalões = Centros de Custo**
   - Cada escalão cria automaticamente um centro de custo
   - Mensalidades dos atletas afetadas ao centro de custo do escalão
   - Permite análise financeira por escalão

2. **Departamentos = Centros de Custo**
   - Desportivo, Administrativo, Financeiro
   - Recebem despesas específicas do departamento

3. **Centro de Custo Genérico (Clube)**
   - Despesas não específicas (água, luz, seguros, etc.)
   - Distribuídas proporcionalmente por nº de atletas em cada escalão
   - Cálculo automático das proporções

**Fluxo de Trabalho:**
```
1. Criar Escalão → Sistema cria Centro de Custo automaticamente
2. Atleta inscreve-se no Escalão → Mensalidade afeta ao Centro de Custo do Escalão
3. Despesa genérica lançada → Sistema distribui proporcionalmente pelos escalões
4. Relatórios mostram: Receitas vs Despesas por Escalão/Departamento
```

**Cálculos Automáticos:**
- Proporção por escalão = (Nº atletas escalão / Total atletas) × 100%
- Despesa distribuída = Valor total × Proporção do escalão
- Resultado por escalão = Receitas escalão - (Despesas escalão + Despesas distribuídas)

---

### **Faturação Automática**

**Sistema Recomendado: Geração Total no Registo**

**Fluxo:**
1. **No Registo do Atleta:**
   - Sistema lê `users.tipo_mensalidade_id`
   - Gera faturas mensais desde mês atual até Julho
   - Cada fatura fica com estado "futuro"

2. **Transição Mensal Automática (Cronjob):**
   - Dia 1 de cada mês: sistema verifica faturas
   - Faturas do mês atual mudam para "em_divida" se não pagas
   - Envia notificações automáticas

3. **Pagamentos:**
   - Pode pagar adiantado (desconto possível)
   - Pode pagar mês a mês
   - Sistema atualiza automaticamente centro de custo

**Vantagens:**
- ✅ Visibilidade financeira total do ano
- ✅ Planeamento de tesouraria
- ✅ Permite descontos anuais
- ✅ Histórico completo desde início

---

## 🔧 Infraestrutura (Sistema Laravel)

**Status**: ⚠️ **ANÁLISE NECESSÁRIA**

**Tabelas Mencionadas no PDF:**
- `cache`, `cache_locks` - Sistema de cache Laravel
- `jobs`, `job_batches` - Filas de processamento assíncrono
- `sessions` - ✅ **JÁ EXISTE** (Replit Auth)
- `failed_jobs` - Registo de jobs falhados
- `migrations` - Controlo de versões de BD (Laravel Migrations)
- `password_reset_tokens` - Reset de passwords

**Decisão Necessária:**
- **Opção A**: Ignorar (sistema usa Replit Auth, não Laravel)
- **Opção B**: Implementar equivalentes se necessário (jobs para async processing)
- **Opção C**: Criar se houver requisito específico de funcionalidade

**Nota**: Sistema atual usa Replit Auth (OIDC), não Laravel Auth tradicional. Muitas destas tabelas podem não ser necessárias.

---

## 🚨 Decisões Críticas Necessárias

### **1. Arquitetura Pessoas vs Users**

**Opção A: Consolidar tudo em `users` (seguir PDF)**
- ✅ Alinhado com especificação
- ✅ Simplifica queries
- ❌ Migração complexa
- ❌ Possível perda de dados atuais

**Opção B: Manter `pessoas` separado e sincronizar**
- ✅ Preserva dados existentes
- ✅ Menor risco
- ❌ Complexidade de manutenção
- ❌ Não segue PDF

**Opção C: Migração gradual híbrida**
- ✅ Minimiza risco
- ✅ Permite testes incrementais
- ❌ Período de transição longo

### **2. Sistema de Autenticação**

**Atual**: Replit Auth (OIDC) - sem passwords
**PDF**: Sugere password, remember_token (Laravel-style)

**Decisão**: Manter Replit Auth ou adicionar autenticação local?

### **3. Tabelas Legacy de Tipificação**

**Existentes no sistema antigo (Laravel):**
- `tipo_users`
- `tipo_user_user`
- `tipo_membros`

**PDF sugere**: Consolidar no RBAC (roles/permissions)

**Opções:**
- **A)** Migrar tipos para roles e depreciar tabelas legacy
- **B)** Manter paralelamente (duplicação de lógica)
- **C)** Ignorar se não houver dados históricos

---

## 📋 Plano de Migração Sugerido

### **Fase 1 - Preparação (Sem perda de dados)**
1. ✅ Backup de dados existentes
2. ✅ Criar campos adicionais em `users` (nulláveis)
3. ✅ Implementar RBAC básico
4. ✅ Adicionar tabela `dados_configuracao` (RGPD)

### **Fase 2 - Refinamento Módulos Existentes + Lógica de Negócio**
5. ✅ Expandir Escalões (user_escaloes N:N) + Integração Centros de Custo
   - Criação automática de centro de custo ao criar escalão
   - Sincronização automática
6. ✅ Adicionar Dados Desportivos (dados_desportivos, saude_atletas)
7. ✅ Adicionar Resultados a Treinos
8. ✅ Refinar Eventos (eventos_tipos, evento_escalao, eventos_users, convocatorias)
9. ✅ Expandir Financeiro (8 tabelas + Lógica Complexa):
   - dados_financeiros
   - faturas + fatura_itens + catalogo_fatura_itens
   - centros_custo (escalões, departamentos, genérico)
   - lancamentos_financeiros (com distribuição automática)
   - extratos_bancarios + mapa_conciliacao
   - **Lógica de Faturação Automática** (geração no registo, transições mensais)
   - **Lógica de Centros de Custo** (distribuição proporcional, cálculos automáticos)

### **Fase 3 - Novos Módulos**
10. ✅ Patrocínios (contratos, parcelas, métricas)
11. ✅ Vendas & Stocks
12. ✅ Marketing/Comunicação
13. ✅ Página Web pública

### **Fase 4 - Consolidação (Opcional)**
14. ⚠️ Migrar dados de `pessoas` para `users`
15. ⚠️ Depreciar tabela `pessoas`

---

## ⏱️ Estimativa de Esforço (Atualizada com Lógica de Negócio)

| Fase | Tarefas | Tempo Estimado | Risco | Complexidade |
|------|---------|----------------|-------|--------------|
| Fase 1 | 4 tarefas | ~2-3h | 🟢 Baixo | Setup base |
| Fase 2 | 5 tarefas + Lógica | ~6-9h | 🔴 Alto | Centros custo + Faturação automática |
| Fase 3 | 4 tarefas | ~5-7h | 🟡 Médio | Novos módulos |
| Fase 4 | 2 tarefas | ~2-4h | 🔴 Alto | Consolidação final |
| **TOTAL** | **15 tarefas** | **~15-23h** | - | - |

**⚠️ Nota**: Fase 2 é crítica e complexa devido a:
- Criação automática de centros de custo ao criar escalões
- Distribuição proporcional de despesas genéricas
- Faturação automática (geração em massa + transições mensais)
- Cálculos financeiros complexos

---

## 🎯 Recomendação

**Abordagem Recomendada: Migração Incremental Segura**

1. **Expandir `users` gradualmente** mantendo `pessoas` temporariamente
2. **Implementar novos módulos** seguindo exatamente o PDF
3. **Sincronizar dados** entre pessoas/users durante transição
4. **Consolidar apenas depois** de tudo validado

**Próximos Passos Imediatos:**
1. ✅ Confirmar abordagem de migração
2. ✅ Expandir tabela `users` com campos do PDF
3. ✅ Implementar RBAC
4. ✅ Proceder fase a fase

---

## ❓ Perguntas para o Utilizador

1. **Consolidar pessoas em users agora ou manter separado?**
   - Opção A: Migrar tudo para users (seguir PDF exatamente)
   - Opção B: Manter pessoas + sincronizar com users
   - Opção C: Migração gradual híbrida

2. **Manter Replit Auth ou adicionar autenticação local?**
   - PDF menciona password/remember_token (Laravel)
   - Atual usa Replit Auth (OIDC, sem passwords)

3. **Tabelas legacy (tipo_users, tipo_user_user, tipo_membros)?**
   - Migrar para RBAC e depreciar
   - Ignorar (assumir não há dados históricos)

4. **Sistema de Faturação Automática?**
   - Opção 1: Geração mensal (no início de cada mês)
   - Opção 2: Geração total no registo (recomendada - melhor visibilidade)

5. **Centros de Custo - Departamentos Fixos?**
   - Confirmar: Desportivo, Administrativo, Financeiro
   - Ou: Permitir criar departamentos personalizados

6. **Prioridade dos novos módulos?**
   - Todos de uma vez (15-25h trabalho com lógica de negócio)
   - Faseado (escolher prioridades)

7. **Dados de teste existentes podem ser perdidos?**
   - Sim: migração mais rápida
   - Não: requer backup e migração cuidadosa

---

## 📝 Notas Técnicas

- ⚠️ **IDs**: Manter tipos existentes (serial/varchar) para evitar quebra de dados
- ⚠️ **Relações**: Todas as FKs devem ser nulláveis durante transição
- ⚠️ **Timestamps**: Adicionar created_at/updated_at onde em falta
- ⚠️ **RGPD**: dados_configuracao é crítico para compliance legal

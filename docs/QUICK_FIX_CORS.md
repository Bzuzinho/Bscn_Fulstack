# Correção Rápida - CORS para Upload de Imagens

## Problema
Não consegue fazer upload de imagens de perfil? Vê este erro?
```
@uppy/aws-s3: Could not read the ETag header
```

## Solução Rápida

### Opção 1: Google Cloud Storage (Replit)

1. **Abra o terminal e execute**:
```bash
# Substitua SEU-BUCKET pelo nome do seu bucket
gsutil cors set docs/cors-config-gcs.json gs://SEU-BUCKET
```

2. **Verifique se funcionou**:
```bash
gsutil cors get gs://SEU-BUCKET
```

### Opção 2: Amazon S3

1. **Via AWS Console**:
   - Aceda a https://console.aws.amazon.com/s3/
   - Clique no seu bucket
   - Vá para **Permissions** → **CORS configuration**
   - Cole o conteúdo de `docs/cors-config-s3.json`
   - Clique em **Save**

2. **Via AWS CLI**:
```bash
# Substitua SEU-BUCKET pelo nome do seu bucket
aws s3api put-bucket-cors --bucket SEU-BUCKET --cors-configuration file://docs/cors-config-s3.json
```

### Opção 3: Replit Object Storage

1. Abra a ferramenta "Object Storage" no painel lateral
2. Selecione o seu bucket
3. Clique em "Settings" ou "Configure"
4. Adicione as seguintes regras CORS:
   - **Allowed Origins**: `*` (ou o seu domínio específico)
   - **Allowed Methods**: GET, HEAD, PUT, POST, DELETE
   - **Exposed Headers**: ETag, Content-Type, Content-Length
   - **Max Age**: 3600

## Verificação

1. Aguarde 1-2 minutos para a configuração propagar
2. Aceda à aplicação e tente fazer upload de uma imagem
3. Se ainda não funcionar:
   - Limpe o cache do navegador (Ctrl+Shift+Del)
   - Faça hard refresh (Ctrl+Shift+R)
   - Verifique o console do navegador (F12) para erros

## Teste Automático

Execute o script de teste para verificar a configuração:

```bash
# Substitua pela URL do seu bucket
./scripts/test-cors.sh https://storage.googleapis.com/SEU-BUCKET/test
```

## Ainda Não Funciona?

Verifique:
1. **Variáveis de ambiente** no ficheiro `.env`:
   ```
   PRIVATE_OBJECT_DIR=/seu-bucket/private
   PUBLIC_OBJECT_SEARCH_PATHS=/seu-bucket/public
   ```

2. **Permissões do bucket**: O bucket permite uploads?

3. **Nome do bucket**: Está correto nas variáveis de ambiente?

4. **Console do navegador**: Que erro específico aparece?

## Documentação Completa

Para mais detalhes, veja:
- [docs/S3_CORS_SETUP.md](S3_CORS_SETUP.md) - Guia completo
- [cors-config-gcs.json](cors-config-gcs.json) - Template GCS
- [cors-config-s3.json](cors-config-s3.json) - Template S3

## Nota de Segurança

⚠️ **IMPORTANTE**: Os templates usam `"*"` para origens permitidas, o que é adequado para desenvolvimento mas **NÃO para produção**.

Para produção, substitua `"*"` pelo domínio específico:
```json
"origin": ["https://seu-dominio.com"]
```

## Ajuda

Se ainda tiver problemas:
1. Abra um issue no GitHub com:
   - Mensagem de erro completa
   - Provider de storage (GCS/S3/Replit)
   - Output do script test-cors.sh
   - Screenshot do erro no console do navegador

2. Contacte o suporte do provider de storage (GCS/AWS/Replit)

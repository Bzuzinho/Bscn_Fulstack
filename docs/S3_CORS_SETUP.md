# Configuração de CORS para Object Storage (S3/GCS)

## Problema

Ao tentar fazer upload de imagens de perfil, pode aparecer o seguinte erro:
```
@uppy/aws-s3: Could not read the ETag header. This likely means CORS is not configured correctly on the S3 Bucket.
```

Este erro ocorre quando o bucket de armazenamento (S3 ou Google Cloud Storage) não está configurado corretamente para permitir que o navegador acesse os headers de resposta necessários.

## Solução

### Para Google Cloud Storage (GCS)

1. **Criar um ficheiro de configuração CORS** chamado `cors-config.json`:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "responseHeader": [
      "Content-Type",
      "Content-Length",
      "ETag",
      "x-goog-acl",
      "x-goog-meta-*"
    ],
    "maxAgeSeconds": 3600
  }
]
```

**Nota de Segurança**: Para produção, substitua `"*"` pela origem específica da sua aplicação:
```json
"origin": ["https://seu-dominio.com", "https://www.seu-dominio.com"]
```

2. **Aplicar a configuração ao bucket** usando o `gsutil`:

```bash
gsutil cors set cors-config.json gs://NOME_DO_SEU_BUCKET
```

3. **Verificar a configuração**:

```bash
gsutil cors get gs://NOME_DO_SEU_BUCKET
```

### Para Amazon S3

1. **Via AWS Console**:
   - Aceda ao bucket no AWS S3 Console
   - Vá para a aba "Permissions"
   - Clique em "CORS configuration"
   - Cole a seguinte configuração:

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD",
      "PUT",
      "POST",
      "DELETE"
    ],
    "AllowedOrigins": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "Content-Type",
      "Content-Length",
      "x-amz-meta-*"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

2. **Via AWS CLI**:

Crie um ficheiro `cors-config.json`:
```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag", "Content-Type", "Content-Length", "x-amz-meta-*"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

Aplique ao bucket:
```bash
aws s3api put-bucket-cors --bucket NOME_DO_SEU_BUCKET --cors-configuration file://cors-config.json
```

### Para ambiente Replit

Se estiver a usar o Object Storage do Replit:

1. Aceda à ferramenta "Object Storage" no painel lateral do Replit
2. Selecione o seu bucket
3. Clique em "Settings" ou "Configure"
4. Adicione as regras CORS conforme indicado acima

## Verificação

Depois de aplicar a configuração CORS, teste o upload de uma imagem de perfil:

1. Faça login na aplicação
2. Aceda à página de detalhes de um utilizador
3. Clique em "Carregar Foto"
4. Selecione uma imagem
5. O upload deve completar com sucesso

## Headers Importantes

- **ETag**: Header retornado pelo S3/GCS que contém o hash do objeto carregado. Essencial para verificar a integridade do upload.
- **Content-Type**: Tipo MIME do ficheiro
- **Content-Length**: Tamanho do ficheiro em bytes

## Troubleshooting

### Erro persiste após configurar CORS
- Aguarde alguns minutos para a configuração propagar
- Limpe o cache do navegador (Ctrl+Shift+Del)
- Verifique que configurou o bucket correto
- Confirme que as variáveis de ambiente estão corretas:
  - `PRIVATE_OBJECT_DIR`
  - `PUBLIC_OBJECT_SEARCH_PATHS`

### Upload funciona localmente mas não em produção
- Verifique que a origem está configurada corretamente no CORS
- Para produção, use domínios específicos em vez de `"*"`
- Confirme que o certificado SSL está válido

### Erro "Network Error" ou "CORS policy"
- Confirme que o bucket existe e está acessível
- Verifique as permissões de escrita no bucket
- Teste com o AWS/GCS CLI se consegue fazer upload manualmente

## Referências

- [Google Cloud Storage - CORS Configuration](https://cloud.google.com/storage/docs/configuring-cors)
- [AWS S3 - CORS Configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)
- [Uppy AWS S3 Documentation](https://uppy.io/docs/aws-s3/#setting-up-your-s3-bucket)

## Variáveis de Ambiente Necessárias

Certifique-se de que estas variáveis estão definidas no ficheiro `.env`:

```bash
# Diretório privado para uploads
PRIVATE_OBJECT_DIR=/seu-bucket/private

# Caminhos públicos para pesquisa de objetos (separados por vírgula)
PUBLIC_OBJECT_SEARCH_PATHS=/seu-bucket/public,/seu-bucket/images
```

## Notas de Segurança

1. **Nunca** use `"*"` como origem em produção
2. Configure origens específicas para cada ambiente
3. Considere usar políticas de bucket para controlar acesso
4. Implemente validação de tipo de ficheiro no backend
5. Limite o tamanho máximo de uploads (atualmente 10MB)

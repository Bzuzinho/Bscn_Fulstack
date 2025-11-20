# Armazenamento de Imagens Diretamente na Base de Dados

## Visão Geral

Este sistema armazena imagens de perfil (e outros ficheiros) **diretamente na base de dados** como strings base64, eliminando a necessidade de configuração de buckets S3/GCS e problemas de CORS.

## Como Funciona

### 1. Upload do Cliente

```typescript
// O utilizador seleciona um ficheiro
<input type="file" onChange={handleFileSelect} />

// O ficheiro é convertido para base64
const reader = new FileReader();
reader.readAsDataURL(file);
// Resultado: "data:image/png;base64,iVBORw0KGgo..."

// Enviado para o servidor como JSON
fetch('/api/profile-images/upload', {
  method: 'POST',
  body: JSON.stringify({ imageData: base64String, userId: 123 })
});
```

### 2. Processamento no Servidor

```typescript
// Validação
- Verifica formato data URI (data:image/png;base64,...)
- Valida tipo de ficheiro (images, PDF, Word, Excel)
- Verifica permissões (admin, próprio utilizador, ou encarregado)
- Valida tamanho (limite 5MB)

// Armazenamento
await storage.updateUser(userId, { 
  profileImageUrl: base64String 
});
```

### 3. Exibição no Cliente

```tsx
// HTML img tag aceita base64 diretamente
<img src={user.profileImageUrl} alt="Profile" />

// React Avatar component
<AvatarImage src={user.profileImageUrl} />
```

## Endpoints API

### POST `/api/profile-images/upload`

Faz upload de uma imagem/documento para a base de dados.

**Request Body:**
```json
{
  "imageData": "data:image/png;base64,iVBORw0KGgo...",
  "userId": 123
}
```

**Response Success (200):**
```json
{
  "success": true,
  "profileImageUrl": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Response Error (400):**
```json
{
  "error": "Invalid file format. Must be base64 data URI"
}
```

**Response Error (403):**
```json
{
  "error": "Forbidden"
}
```

## Tipos de Ficheiro Suportados

### Imagens
- PNG (image/png)
- JPEG (image/jpeg)
- GIF (image/gif)
- WebP (image/webp)
- SVG (image/svg+xml)

### Documentos
- PDF (application/pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)

## Segurança

### Validações Implementadas

1. **Autenticação**: Utilizador deve estar autenticado
2. **Autorização**: Apenas admin, o próprio utilizador, ou encarregado podem fazer upload
3. **Tipo de Ficheiro**: Whitelist de tipos permitidos
4. **Tamanho**: Máximo 5MB por defeito
5. **Formato**: Deve ser data URI válido (data:tipo/subtipo;base64,dados)

### Exemplo de Validação

```typescript
// Servidor valida permissões
if (targetUserId !== sessionUserId) {
  const existingUser = await storage.getUser(targetUserId);
  const isAdmin = user.role === "admin";
  const isEncarregado = sessionUserId === existingUser.encarregadoId;
  
  if (!isAdmin && !isEncarregado) {
    return res.status(403).json({ error: "Forbidden" });
  }
}

// Servidor valida formato
if (!imageData.startsWith('data:')) {
  return res.status(400).json({ error: "Invalid format" });
}

// Servidor valida tipo
const allowedTypes = ['image/', 'application/pdf'];
if (!allowedTypes.some(type => imageData.includes(type))) {
  return res.status(400).json({ error: "File type not allowed" });
}
```

### Recomendações Adicionais de Segurança

⚠️ **Rate Limiting** (Recomendado para produção): Adicione rate limiting ao endpoint de upload para prevenir abuso:

```typescript
import rateLimit from 'express-rate-limit';

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 uploads por IP
  message: 'Too many uploads from this IP, please try again later.'
});

app.post("/api/profile-images/upload", uploadLimiter, isAuthenticated, ...);
```

⚠️ **CSRF Protection** (Recomendado para produção): Implemente proteção CSRF:

```typescript
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });
app.post("/api/profile-images/upload", csrfProtection, isAuthenticated, ...);
```

💡 **Content Security Policy**: Configure CSP headers para permitir data URIs:

```typescript
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "img-src 'self' data: https:;"
  );
  next();
});
```

## Vantagens

### ✅ Simplicidade
- Sem configuração de buckets externos
- Sem chaves de API ou credenciais
- Sem problemas de CORS

### ✅ Segurança
- Validação server-side antes de armazenar
- Controlo de permissões integrado
- Sem URLs públicos expostos

### ✅ Performance
- Imagens carregadas com os dados do utilizador
- Sem requests adicionais para buscar imagens
- Cache do navegador funciona normalmente

### ✅ Portabilidade
- Dados ficam na mesma base de dados
- Backups incluem automaticamente as imagens
- Migração simplificada

## Desvantagens e Considerações

### ⚠️ Tamanho da Base de Dados

Base64 aumenta o tamanho em ~33%:
- Ficheiro original: 100KB
- Base64: ~133KB

**Mitigação:**
- Limitar tamanho de upload (5MB)
- Comprimir imagens no cliente antes de converter
- Considerar CDN para sites com muitos utilizadores

### ⚠️ Performance com Muitas Imagens

Queries de utilizadores incluem dados base64 grandes.

**Mitigação:**
- Selecionar apenas `id`, `firstName`, `lastName` em listagens
- Carregar `profileImageUrl` apenas quando necessário
- Usar paginação

### 💡 Otimização Futura

Se o volume crescer muito, considerar:
1. Tabela separada para imagens (`user_images`)
2. Compressão de imagens no cliente
3. Conversão para WebP (formato mais eficiente)
4. CDN para servir imagens estáticas

## Exemplo de Uso

### Upload de Imagem de Perfil

```typescript
import { ObjectUploader } from "@/components/ObjectUploader";

function ProfileImageUpload({ userId }: { userId: number }) {
  const handleGetUploadParameters = async () => {
    return {
      method: "POST" as const,
      url: "/api/profile-images/upload",
    };
  };

  const handleUploadComplete = (result) => {
    if (result.successful?.length > 0) {
      console.log("Upload successful!");
      // Refresh user data to show new image
      queryClient.invalidateQueries(["/api/pessoas", userId]);
    }
  };

  return (
    <ObjectUploader
      maxNumberOfFiles={1}
      maxFileSize={5242880} // 5MB
      onGetUploadParameters={handleGetUploadParameters}
      onComplete={handleUploadComplete}
      userId={userId}
    >
      Carregar Foto
    </ObjectUploader>
  );
}
```

### Exibir Imagem

```typescript
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function UserAvatar({ user }: { user: User }) {
  return (
    <Avatar>
      <AvatarImage 
        src={user.profileImageUrl ?? undefined} 
        alt={`${user.firstName} ${user.lastName}`} 
      />
      <AvatarFallback>
        {user.firstName?.[0]}{user.lastName?.[0]}
      </AvatarFallback>
    </Avatar>
  );
}
```

## Compressão de Imagens (Opcional)

Para reduzir o tamanho, pode comprimir imagens antes de converter para base64:

```typescript
async function compressImage(file: File, maxWidth = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    img.onload = () => {
      // Calcular dimensões mantendo aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Desenhar imagem redimensionada
      ctx.drawImage(img, 0, 0, width, height);
      
      // Converter para base64 com compressão
      resolve(canvas.toDataURL('image/jpeg', 0.8)); // 80% qualidade
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Uso
const base64 = await compressImage(file, 800);
```

## Migração de Storage Externo

Se tiver imagens em S3/GCS e quiser migrar:

```typescript
async function migrateExternalToDatabase(userId: string) {
  const user = await storage.getUser(userId);
  
  if (user.profileImageUrl?.startsWith('http')) {
    // Buscar imagem externa
    const response = await fetch(user.profileImageUrl);
    const blob = await response.blob();
    
    // Converter para base64
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    
    // Atualizar na base de dados
    await storage.updateUser(userId, { profileImageUrl: base64 });
    
    console.log(`Migrated user ${userId}`);
  }
}
```

## Troubleshooting

### Erro: "File too large"
**Solução**: Reduzir tamanho da imagem ou aumentar limite no servidor

### Erro: "File type not allowed"
**Solução**: Verificar que o ficheiro é um tipo permitido (imagem, PDF, etc.)

### Imagem não aparece
**Solução**: 
1. Verificar que `profileImageUrl` contém string base64
2. Verificar que começa com `data:image/`
3. Verificar console do navegador para erros

### Base de dados muito grande
**Solução**:
1. Implementar compressão de imagens
2. Reduzir limite de tamanho
3. Considerar migrar para storage externo

## Monitorização

### Verificar Tamanho das Imagens

```sql
-- PostgreSQL
SELECT 
  id,
  first_name,
  last_name,
  LENGTH(profile_image_url) as image_size_bytes,
  LENGTH(profile_image_url) / 1024 as image_size_kb
FROM users
WHERE profile_image_url IS NOT NULL
ORDER BY LENGTH(profile_image_url) DESC
LIMIT 10;
```

### Estatísticas

```sql
-- Total de utilizadores com imagem
SELECT COUNT(*) as users_with_images
FROM users
WHERE profile_image_url IS NOT NULL 
  AND profile_image_url LIKE 'data:image/%';

-- Tamanho médio das imagens
SELECT 
  AVG(LENGTH(profile_image_url)) / 1024 as avg_size_kb,
  MAX(LENGTH(profile_image_url)) / 1024 as max_size_kb,
  MIN(LENGTH(profile_image_url)) / 1024 as min_size_kb
FROM users
WHERE profile_image_url LIKE 'data:image/%';
```

## Referências

- [Data URLs (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
- [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Base64 Encoding](https://en.wikipedia.org/wiki/Base64)

// Client-side mapping helpers between server and client shapes
// Updated to work with users table schema (Drizzle returns camelCase properties)
export function mapPessoaServerToClient(p: any) {
  if (!p) return p;
  return {
    ...p,
    id: p.id,
    // Users table (Drizzle camelCase) vs legacy pessoas table (snake_case from raw queries)
    firstName: p.firstName ?? p.first_name ?? "",
    lastName: p.lastName ?? p.last_name ?? "",
    // Support legacy nome field for backwards compatibility
    nome: p.nome ?? ((p.firstName || p.first_name) && (p.lastName || p.last_name) 
      ? `${p.firstName ?? p.first_name} ${p.lastName ?? p.last_name}` 
      : ""),
    numeroSocio: p.numeroSocio ?? p.numero_socio ?? null,
    nif: p.nif ?? null,
    cartaoCidadao: p.cartaoCidadao ?? p.cartao_cidadao ?? null,
    email: p.email ?? null,
    emailSecundario: p.emailSecundario ?? p.email_secundario ?? null,
    contacto: p.contacto ?? p.telemovel ?? null,
    dataNascimento: p.dataNascimento ?? p.data_nascimento ?? null,
    sexo: p.sexo ?? null,
    morada: p.morada ?? null,
    codigoPostal: p.codigoPostal ?? p.codigo_postal ?? p.cp ?? null,
    localidade: p.localidade ?? null,
    empresa: p.empresa ?? null,
    escola: p.escola ?? null,
    estadoCivil: p.estadoCivil ?? p.estado_civil ?? null,
    ocupacao: p.ocupacao ?? null,
    nacionalidade: p.nacionalidade ?? null,
    numeroIrmaos: p.numeroIrmaos ?? p.numero_irmaos ?? 0,
    menor: p.menor ?? false,
    encarregadoId: p.encarregadoId ?? p.encarregado_id ?? null,
    escalaoId: p.escalaoId ?? p.escalao_id ?? null,
    estadoUtilizador: p.estadoUtilizador ?? p.estado_utilizador ?? null,
    profileImageUrl: p.profileImageUrl ?? p.profile_image_url ?? null,
    cartaoFederacao: p.cartaoFederacao ?? p.cartao_federacao ?? null,
    arquivoInscricao: p.arquivoInscricao ?? p.arquivo_inscricao ?? null,
  };
}

export function mapPessoaClientToServer(data: any) {
  if (!data) return data;
  // Map to users table schema - Drizzle expects camelCase property names
  return {
    firstName: data.firstName ?? data.first_name ?? null,
    lastName: data.lastName ?? data.last_name ?? null,
    email: data.email ?? null,
    emailSecundario: data.emailSecundario ?? data.email_secundario ?? null,
    contacto: data.contacto ?? data.telemovel ?? null,
    dataNascimento: data.dataNascimento ?? data.data_nascimento ?? null,
    nif: data.nif ?? null,
    morada: data.morada ?? null,
    codigoPostal: data.codigoPostal ?? data.codigo_postal ?? data.cp ?? null,
    localidade: data.localidade ?? null,
    sexo: data.sexo ?? null,
    numeroSocio: data.numeroSocio ?? data.numero_socio ?? null,
    cartaoCidadao: data.cartaoCidadao ?? data.cartao_cidadao ?? null,
    empresa: data.empresa ?? null,
    escola: data.escola ?? null,
    estadoCivil: data.estadoCivil ?? data.estado_civil ?? null,
    ocupacao: data.ocupacao ?? null,
    nacionalidade: data.nacionalidade ?? null,
    numeroIrmaos: data.numeroIrmaos ?? data.numero_irmaos ?? null,
    menor: data.menor ?? null,
    encarregadoId: data.encarregadoId ?? data.encarregado_id ?? data.encarregado ?? null,
    escalaoId: data.escalaoId ?? data.escalao_id ?? null,
    estadoUtilizador: data.estadoUtilizador ?? data.estado_utilizador ?? null,
    cartaoFederacao: data.cartaoFederacao ?? data.cartao_federacao ?? null,
    arquivoInscricao: data.arquivoInscricao ?? data.arquivo_inscricao ?? null,
  };
}

export default {
  mapPessoaServerToClient,
  mapPessoaClientToServer,
};

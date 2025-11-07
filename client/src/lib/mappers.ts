// Client-side mapping helpers between server (snake_case) and client (camelCase/UI) shapes
export function mapPessoaServerToClient(p: any) {
  if (!p) return p;
  return {
    ...p,
    id: p.id,
    name: p.nome ?? p.name ?? "",
    numeroSocio: p.numero_socio ?? p.numeroSocio ?? null,
    nif: p.nif ?? null,
    cartaoCidadao: p.cartao_cidadao ?? p.cartaoCidadao ?? null,
    email: p.email ?? null,
  emailSecundario: p.email_secundario ?? p.emailSecundario ?? null,
    contacto: p.contacto ?? p.telemovel ?? null,
    dataNascimento: p.data_nascimento ?? p.dataNascimento ?? null,
    sexo: p.sexo ?? null,
    morada: p.morada ?? null,
    codigoPostal: p.cp ?? p.codigo_postal ?? null,
    localidade: p.localidade ?? null,
    empresa: p.empresa ?? null,
    escola: p.escola ?? null,
    estadoCivil: p.estado_civil ?? p.estadoCivil ?? null,
    ocupacao: p.ocupacao ?? null,
    nacionalidade: p.nacionalidade ?? null,
    numeroIrmaos: p.numero_irmaos ?? p.numeroIrmaos ?? 0,
    menor: p.menor ?? false,
    encarregadoId: p.encarregado_id ?? p.encarregadoId ?? null,
    escalaoId: p.escalao_id ?? p.escalaoId ?? null,
    estadoUtilizador: p.estado_utilizador ?? p.estadoUtilizador ?? null,
    profileImageUrl: p.profile_image_url ?? p.profileImageUrl ?? null,
      cartaoFederacao: p.cartao_federacao ?? p.cartaoFederacao ?? null,
      arquivoInscricao: p.arquivo_inscricao ?? p.arquivoInscricao ?? null,
  };
}

export function mapPessoaClientToServer(data: any) {
  if (!data) return data;
  return {
    nome: data.name ?? data.nome,
    email: data.email ?? null,
  email_secundario: data.emailSecundario ?? data.email_secundario ?? null,
    telemovel: data.contacto ?? data.telemovel ?? null,
    data_nascimento: data.dataNascimento ?? data.data_nascimento ?? null,
    nif: data.nif ?? null,
    morada: data.morada ?? null,
    codigo_postal: data.codigoPostal ?? data.cp ?? null,
    localidade: data.localidade ?? null,
    sexo: data.sexo ?? null,
    numero_socio: data.numeroSocio ?? null,
    cartao_cidadao: data.cartaoCidadao ?? null,
    empresa: data.empresa ?? null,
    escola: data.escola ?? null,
    estado_civil: data.estadoCivil ?? null,
    ocupacao: data.ocupacao ?? null,
    nacionalidade: data.nacionalidade ?? null,
    numero_irmaos: data.numeroIrmaos ?? null,
    menor: data.menor ?? null,
    encarregado_id: data.encarregadoId ?? data.encarregado ?? null,
    escalao_id: data.escalaoId ?? null,
    estado_utilizador: data.estadoUtilizador ?? null,
      cartao_federacao: data.cartaoFederacao ?? data.cartao_federacao ?? null,
      arquivo_inscricao: data.arquivoInscricao ?? data.arquivo_inscricao ?? null,
  };
}

export default {
  mapPessoaServerToClient,
  mapPessoaClientToServer,
};

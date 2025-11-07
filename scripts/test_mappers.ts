import assert from 'assert';
import { mapPessoaServerToClient, mapPessoaClientToServer } from '../client/src/lib/mappers';

function run() {
  const serverObj = {
    id: 10,
    nome: 'João Silva',
    telemovel: '912345678',
    data_nascimento: '2005-06-15',
    cp: '1234-567',
    encarregado_id: 2,
    profile_image_url: 'https://example.com/photo.jpg',
  } as any;

  const client = mapPessoaServerToClient(serverObj);
  assert.equal(client.id, 10);
  assert.equal(client.name, 'João Silva');
  assert.equal(client.contacto, '912345678');
  assert.equal(client.dataNascimento, '2005-06-15');
  assert.equal(client.codigoPostal, '1234-567');
  assert.equal(client.encarregadoId, 2);
  assert.equal(client.profileImageUrl, 'https://example.com/photo.jpg');

  const back = mapPessoaClientToServer(client as any);
  assert.equal(back.nome, 'João Silva');
  assert.equal(back.telemovel, '912345678');
  assert.equal(back.data_nascimento, '2005-06-15');
  assert.equal(back.codigo_postal, '1234-567');
  assert.equal(back.encarregado_id, 2);

  console.log('mappers: OK');
}

run();

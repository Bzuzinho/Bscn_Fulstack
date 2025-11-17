const { Client } = require('pg');
const fs = require('fs');
(async()=>{
  try{
    const env = fs.existsSync('.env') ? fs.readFileSync('.env','utf8') : '';
    const line = (env.split(/\n/).find(l=>l.startsWith('DATABASE_URL='))||'');
    const DATABASE_URL = line.replace(/^DATABASE_URL=/,'').trim();
    if(!DATABASE_URL){ console.error('DATABASE_URL missing'); process.exit(2); }
    const client = new Client({ connectionString: DATABASE_URL });
    await client.connect();
    const query = `SELECT 'users.email_secundario' as col, EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='email_secundario') as exists UNION ALL SELECT 'users.tipo_membro_id', EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='tipo_membro_id') UNION ALL SELECT 'users.conta_corrente', EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='conta_corrente') UNION ALL SELECT 'dados_desportivos.cartao_federacao', EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='dados_desportivos' AND column_name='cartao_federacao') UNION ALL SELECT 'dados_desportivos.arquivo_inscricao', EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='dados_desportivos' AND column_name='arquivo_inscricao') UNION ALL SELECT 'dados_configuracao.rgpd_assinado', EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='dados_configuracao' AND column_name='rgpd_assinado');`;
    const res = await client.query(query);
    console.log(res.rows);
    await client.end();
  }catch(e){ console.error(e); process.exit(1); }
})();

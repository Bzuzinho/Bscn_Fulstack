# Endpoints (derivado de rotas)
## [GET|HEAD] //

- Name: 
- Action: Closure

## [GET|HEAD] /api/atividades

- Name: atividades.index
- Action: App\Http\Controllers\Api\AtividadeController@index

## [POST] /api/atividades

- Name: atividades.store
- Action: App\Http\Controllers\Api\AtividadeController@store

## [GET|HEAD] /api/atividades/{atividade}

- Name: atividades.show
- Action: App\Http\Controllers\Api\AtividadeController@show

## [PUT|PATCH] /api/atividades/{atividade}

- Name: atividades.update
- Action: App\Http\Controllers\Api\AtividadeController@update

## [DELETE] /api/atividades/{atividade}

- Name: atividades.destroy
- Action: App\Http\Controllers\Api\AtividadeController@destroy

## [POST] /api/auth/login

- Name: 
- Action: App\Http\Controllers\Api\AuthController@login

## [POST] /api/auth/logout

- Name: 
- Action: App\Http\Controllers\Api\AuthController@logout

## [GET|HEAD] /api/auth/user

- Name: 
- Action: App\Http\Controllers\Api\AuthController@user

## [GET|HEAD] /api/centros-custo

- Name: 
- Action: App\Http\Controllers\Api\FaturaController@centrosCusto

## [POST] /api/centros-custo

- Name: 
- Action: App\Http\Controllers\Api\FaturaController@createCentroCusto

## [GET|HEAD] /api/escaloes

- Name: escaloes.index
- Action: App\Http\Controllers\Api\EscalaoController@index

## [POST] /api/escaloes

- Name: escaloes.store
- Action: App\Http\Controllers\Api\EscalaoController@store

## [GET|HEAD] /api/escaloes/{escalo}

- Name: escaloes.show
- Action: App\Http\Controllers\Api\EscalaoController@show

## [PUT|PATCH] /api/escaloes/{escalo}

- Name: escaloes.update
- Action: App\Http\Controllers\Api\EscalaoController@update

## [DELETE] /api/escaloes/{escalo}

- Name: escaloes.destroy
- Action: App\Http\Controllers\Api\EscalaoController@destroy

## [GET|HEAD] /api/faturas

- Name: faturas.index
- Action: App\Http\Controllers\Api\FaturaController@index

## [POST] /api/faturas

- Name: faturas.store
- Action: App\Http\Controllers\Api\FaturaController@store

## [POST] /api/faturas/gerar-anuais

- Name: 
- Action: App\Http\Controllers\Api\FaturaController@gerarAnuais

## [GET|HEAD] /api/faturas/{fatura}

- Name: faturas.show
- Action: App\Http\Controllers\Api\FaturaController@show

## [PUT|PATCH] /api/faturas/{fatura}

- Name: faturas.update
- Action: App\Http\Controllers\Api\FaturaController@update

## [DELETE] /api/faturas/{fatura}

- Name: faturas.destroy
- Action: App\Http\Controllers\Api\FaturaController@destroy

## [PUT] /api/faturas/{id}/pagar

- Name: 
- Action: App\Http\Controllers\Api\FaturaController@marcarPaga

## [POST] /api/login

- Name: 
- Action: App\Http\Controllers\Api\AuthController@login

## [POST] /api/logout

- Name: 
- Action: App\Http\Controllers\Api\AuthController@logout

## [GET|HEAD] /api/mensalidades

- Name: mensalidades.index
- Action: App\Http\Controllers\Api\MensalidadeController@index

## [POST] /api/mensalidades

- Name: mensalidades.store
- Action: App\Http\Controllers\Api\MensalidadeController@store

## [GET|HEAD] /api/mensalidades/stats

- Name: 
- Action: App\Http\Controllers\Api\MensalidadeController@stats

## [GET|HEAD] /api/mensalidades/{mensalidade}

- Name: mensalidades.show
- Action: App\Http\Controllers\Api\MensalidadeController@show

## [PUT|PATCH] /api/mensalidades/{mensalidade}

- Name: mensalidades.update
- Action: App\Http\Controllers\Api\MensalidadeController@update

## [DELETE] /api/mensalidades/{mensalidade}

- Name: mensalidades.destroy
- Action: App\Http\Controllers\Api\MensalidadeController@destroy

## [GET|HEAD] /api/pessoas

- Name: pessoas.index
- Action: App\Http\Controllers\Api\PessoaController@index

## [POST] /api/pessoas

- Name: pessoas.store
- Action: App\Http\Controllers\Api\PessoaController@store

## [GET|HEAD] /api/pessoas/{pessoa}

- Name: pessoas.show
- Action: App\Http\Controllers\Api\PessoaController@show

## [PUT|PATCH] /api/pessoas/{pessoa}

- Name: pessoas.update
- Action: App\Http\Controllers\Api\PessoaController@update

## [DELETE] /api/pessoas/{pessoa}

- Name: pessoas.destroy
- Action: App\Http\Controllers\Api\PessoaController@destroy

## [GET|HEAD] /api/ping

- Name: 
- Action: Closure

## [GET|HEAD] /api/presencas

- Name: presencas.index
- Action: App\Http\Controllers\Api\PresencaController@index

## [POST] /api/presencas

- Name: presencas.store
- Action: App\Http\Controllers\Api\PresencaController@store

## [GET|HEAD] /api/presencas/{presenca}

- Name: presencas.show
- Action: App\Http\Controllers\Api\PresencaController@show

## [PUT|PATCH] /api/presencas/{presenca}

- Name: presencas.update
- Action: App\Http\Controllers\Api\PresencaController@update

## [DELETE] /api/presencas/{presenca}

- Name: presencas.destroy
- Action: App\Http\Controllers\Api\PresencaController@destroy

## [PUT] /api/profile-images

- Name: 
- Action: App\Http\Controllers\Api\UserController@uploadProfileImage

## [GET|HEAD] /api/stats

- Name: 
- Action: App\Http\Controllers\Api\DashboardController@index

## [GET|HEAD] /api/tipos-mensalidade

- Name: 
- Action: App\Http\Controllers\Api\FaturaController@tiposMensalidade

## [POST] /api/tipos-mensalidade

- Name: 
- Action: App\Http\Controllers\Api\FaturaController@createTipoMensalidade

## [GET|HEAD] /api/user

- Name: 
- Action: App\Http\Controllers\Api\AuthController@user

## [GET|HEAD] /api/users

- Name: users.index
- Action: App\Http\Controllers\Api\UserController@index

## [POST] /api/users

- Name: users.store
- Action: App\Http\Controllers\Api\UserController@store

## [GET|HEAD] /api/users/{id}/dados-configuracao

- Name: 
- Action: App\Http\Controllers\Api\UserController@dadosConfiguracao

## [PUT] /api/users/{id}/dados-configuracao

- Name: 
- Action: App\Http\Controllers\Api\UserController@updateDadosConfiguracao

## [GET|HEAD] /api/users/{id}/dados-desportivos

- Name: 
- Action: App\Http\Controllers\Api\UserController@dadosDesportivos

## [PUT] /api/users/{id}/dados-desportivos

- Name: 
- Action: App\Http\Controllers\Api\UserController@updateDadosDesportivos

## [GET|HEAD] /api/users/{id}/resultados

- Name: 
- Action: App\Http\Controllers\Api\UserController@resultados

## [GET|HEAD] /api/users/{id}/treinos

- Name: 
- Action: App\Http\Controllers\Api\UserController@treinos

## [GET|HEAD] /api/users/{user}

- Name: users.show
- Action: App\Http\Controllers\Api\UserController@show

## [PUT|PATCH] /api/users/{user}

- Name: users.update
- Action: App\Http\Controllers\Api\UserController@update

## [DELETE] /api/users/{user}

- Name: users.destroy
- Action: App\Http\Controllers\Api\UserController@destroy

## [GET|HEAD] /atividades

- Name: atividades.index
- Action: App\Http\Controllers\Api\AtividadeController@index

## [POST] /atividades

- Name: atividades.store
- Action: App\Http\Controllers\Api\AtividadeController@store

## [GET|HEAD] /atividades/{atividade}

- Name: atividades.show
- Action: App\Http\Controllers\Api\AtividadeController@show

## [PUT|PATCH] /atividades/{atividade}

- Name: atividades.update
- Action: App\Http\Controllers\Api\AtividadeController@update

## [DELETE] /atividades/{atividade}

- Name: atividades.destroy
- Action: App\Http\Controllers\Api\AtividadeController@destroy

## [POST] /auth/login

- Name: 
- Action: App\Http\Controllers\Api\AuthController@login

## [POST] /auth/logout

- Name: 
- Action: App\Http\Controllers\Api\AuthController@logout

## [GET|HEAD] /auth/user

- Name: 
- Action: App\Http\Controllers\Api\AuthController@user

## [GET|HEAD] /centros-custo

- Name: 
- Action: App\Http\Controllers\Api\FaturaController@centrosCusto

## [POST] /centros-custo

- Name: 
- Action: App\Http\Controllers\Api\FaturaController@createCentroCusto

## [GET|HEAD] /escaloes

- Name: escaloes.index
- Action: App\Http\Controllers\Api\EscalaoController@index

## [POST] /escaloes

- Name: escaloes.store
- Action: App\Http\Controllers\Api\EscalaoController@store

## [GET|HEAD] /escaloes/{escalo}

- Name: escaloes.show
- Action: App\Http\Controllers\Api\EscalaoController@show

## [PUT|PATCH] /escaloes/{escalo}

- Name: escaloes.update
- Action: App\Http\Controllers\Api\EscalaoController@update

## [DELETE] /escaloes/{escalo}

- Name: escaloes.destroy
- Action: App\Http\Controllers\Api\EscalaoController@destroy

## [GET|HEAD] /faturas

- Name: faturas.index
- Action: App\Http\Controllers\Api\FaturaController@index

## [POST] /faturas

- Name: faturas.store
- Action: App\Http\Controllers\Api\FaturaController@store

## [POST] /faturas/gerar-anuais

- Name: 
- Action: App\Http\Controllers\Api\FaturaController@gerarAnuais

## [GET|HEAD] /faturas/{fatura}

- Name: faturas.show
- Action: App\Http\Controllers\Api\FaturaController@show

## [PUT|PATCH] /faturas/{fatura}

- Name: faturas.update
- Action: App\Http\Controllers\Api\FaturaController@update

## [DELETE] /faturas/{fatura}

- Name: faturas.destroy
- Action: App\Http\Controllers\Api\FaturaController@destroy

## [PUT] /faturas/{id}/pagar

- Name: 
- Action: App\Http\Controllers\Api\FaturaController@marcarPaga

## [POST] /login

- Name: 
- Action: App\Http\Controllers\Api\AuthController@login

## [POST] /logout

- Name: 
- Action: App\Http\Controllers\Api\AuthController@logout

## [GET|HEAD] /mensalidades

- Name: mensalidades.index
- Action: App\Http\Controllers\Api\MensalidadeController@index

## [POST] /mensalidades

- Name: mensalidades.store
- Action: App\Http\Controllers\Api\MensalidadeController@store

## [GET|HEAD] /mensalidades/stats

- Name: 
- Action: App\Http\Controllers\Api\MensalidadeController@stats

## [GET|HEAD] /mensalidades/{mensalidade}

- Name: mensalidades.show
- Action: App\Http\Controllers\Api\MensalidadeController@show

## [PUT|PATCH] /mensalidades/{mensalidade}

- Name: mensalidades.update
- Action: App\Http\Controllers\Api\MensalidadeController@update

## [DELETE] /mensalidades/{mensalidade}

- Name: mensalidades.destroy
- Action: App\Http\Controllers\Api\MensalidadeController@destroy

## [GET|HEAD] /pessoas

- Name: pessoas.index
- Action: App\Http\Controllers\Api\PessoaController@index

## [POST] /pessoas

- Name: pessoas.store
- Action: App\Http\Controllers\Api\PessoaController@store

## [GET|HEAD] /pessoas/{pessoa}

- Name: pessoas.show
- Action: App\Http\Controllers\Api\PessoaController@show

## [PUT|PATCH] /pessoas/{pessoa}

- Name: pessoas.update
- Action: App\Http\Controllers\Api\PessoaController@update

## [DELETE] /pessoas/{pessoa}

- Name: pessoas.destroy
- Action: App\Http\Controllers\Api\PessoaController@destroy

## [GET|HEAD] /ping

- Name: 
- Action: Closure

## [GET|HEAD] /presencas

- Name: presencas.index
- Action: App\Http\Controllers\Api\PresencaController@index

## [POST] /presencas

- Name: presencas.store
- Action: App\Http\Controllers\Api\PresencaController@store

## [GET|HEAD] /presencas/{presenca}

- Name: presencas.show
- Action: App\Http\Controllers\Api\PresencaController@show

## [PUT|PATCH] /presencas/{presenca}

- Name: presencas.update
- Action: App\Http\Controllers\Api\PresencaController@update

## [DELETE] /presencas/{presenca}

- Name: presencas.destroy
- Action: App\Http\Controllers\Api\PresencaController@destroy

## [PUT] /profile-images

- Name: 
- Action: App\Http\Controllers\Api\UserController@uploadProfileImage

## [GET|HEAD] /stats

- Name: 
- Action: App\Http\Controllers\Api\DashboardController@index

## [GET|HEAD] /storage/{path}

- Name: storage.local
- Action: Closure

## [GET|HEAD] /tipos-mensalidade

- Name: 
- Action: App\Http\Controllers\Api\FaturaController@tiposMensalidade

## [POST] /tipos-mensalidade

- Name: 
- Action: App\Http\Controllers\Api\FaturaController@createTipoMensalidade

## [GET|HEAD] /up

- Name: 
- Action: Closure

## [GET|HEAD] /user

- Name: 
- Action: App\Http\Controllers\Api\AuthController@user

## [GET|HEAD] /users

- Name: users.index
- Action: App\Http\Controllers\Api\UserController@index

## [POST] /users

- Name: users.store
- Action: App\Http\Controllers\Api\UserController@store

## [GET|HEAD] /users/{id}/dados-configuracao

- Name: 
- Action: App\Http\Controllers\Api\UserController@dadosConfiguracao

## [PUT] /users/{id}/dados-configuracao

- Name: 
- Action: App\Http\Controllers\Api\UserController@updateDadosConfiguracao

## [GET|HEAD] /users/{id}/dados-desportivos

- Name: 
- Action: App\Http\Controllers\Api\UserController@dadosDesportivos

## [PUT] /users/{id}/dados-desportivos

- Name: 
- Action: App\Http\Controllers\Api\UserController@updateDadosDesportivos

## [GET|HEAD] /users/{id}/resultados

- Name: 
- Action: App\Http\Controllers\Api\UserController@resultados

## [GET|HEAD] /users/{id}/treinos

- Name: 
- Action: App\Http\Controllers\Api\UserController@treinos

## [GET|HEAD] /users/{user}

- Name: users.show
- Action: App\Http\Controllers\Api\UserController@show

## [PUT|PATCH] /users/{user}

- Name: users.update
- Action: App\Http\Controllers\Api\UserController@update

## [DELETE] /users/{user}

- Name: users.destroy
- Action: App\Http\Controllers\Api\UserController@destroy


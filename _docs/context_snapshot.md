# Context Snapshot — 2025-11-03T16:38:37Z

## Estrutura
# Estrutura Geral
## Backend

## Rotas

## Frontend

## Rotas
# Rotas API
| Method | URI | Name | Action |
|---|---|---|---|
| GET|HEAD | // |  | Closure |
| GET|HEAD | /api/atividades | atividades.index | App\Http\Controllers\Api\AtividadeController@index |
| POST | /api/atividades | atividades.store | App\Http\Controllers\Api\AtividadeController@store |
| GET|HEAD | /api/atividades/{atividade} | atividades.show | App\Http\Controllers\Api\AtividadeController@show |
| PUT|PATCH | /api/atividades/{atividade} | atividades.update | App\Http\Controllers\Api\AtividadeController@update |
| DELETE | /api/atividades/{atividade} | atividades.destroy | App\Http\Controllers\Api\AtividadeController@destroy |
| POST | /api/auth/login |  | App\Http\Controllers\Api\AuthController@login |
| POST | /api/auth/logout |  | App\Http\Controllers\Api\AuthController@logout |
| GET|HEAD | /api/auth/user |  | App\Http\Controllers\Api\AuthController@user |
| GET|HEAD | /api/centros-custo |  | App\Http\Controllers\Api\FaturaController@centrosCusto |
| POST | /api/centros-custo |  | App\Http\Controllers\Api\FaturaController@createCentroCusto |
| GET|HEAD | /api/escaloes | escaloes.index | App\Http\Controllers\Api\EscalaoController@index |
| POST | /api/escaloes | escaloes.store | App\Http\Controllers\Api\EscalaoController@store |
| GET|HEAD | /api/escaloes/{escalo} | escaloes.show | App\Http\Controllers\Api\EscalaoController@show |
| PUT|PATCH | /api/escaloes/{escalo} | escaloes.update | App\Http\Controllers\Api\EscalaoController@update |
| DELETE | /api/escaloes/{escalo} | escaloes.destroy | App\Http\Controllers\Api\EscalaoController@destroy |
| GET|HEAD | /api/faturas | faturas.index | App\Http\Controllers\Api\FaturaController@index |
| POST | /api/faturas | faturas.store | App\Http\Controllers\Api\FaturaController@store |
| POST | /api/faturas/gerar-anuais |  | App\Http\Controllers\Api\FaturaController@gerarAnuais |
| GET|HEAD | /api/faturas/{fatura} | faturas.show | App\Http\Controllers\Api\FaturaController@show |
| PUT|PATCH | /api/faturas/{fatura} | faturas.update | App\Http\Controllers\Api\FaturaController@update |
| DELETE | /api/faturas/{fatura} | faturas.destroy | App\Http\Controllers\Api\FaturaController@destroy |
| PUT | /api/faturas/{id}/pagar |  | App\Http\Controllers\Api\FaturaController@marcarPaga |
| POST | /api/login |  | App\Http\Controllers\Api\AuthController@login |
| POST | /api/logout |  | App\Http\Controllers\Api\AuthController@logout |
| GET|HEAD | /api/mensalidades | mensalidades.index | App\Http\Controllers\Api\MensalidadeController@index |
| POST | /api/mensalidades | mensalidades.store | App\Http\Controllers\Api\MensalidadeController@store |
| GET|HEAD | /api/mensalidades/stats |  | App\Http\Controllers\Api\MensalidadeController@stats |
| GET|HEAD | /api/mensalidades/{mensalidade} | mensalidades.show | App\Http\Controllers\Api\MensalidadeController@show |
| PUT|PATCH | /api/mensalidades/{mensalidade} | mensalidades.update | App\Http\Controllers\Api\MensalidadeController@update |
| DELETE | /api/mensalidades/{mensalidade} | mensalidades.destroy | App\Http\Controllers\Api\MensalidadeController@destroy |
| GET|HEAD | /api/pessoas | pessoas.index | App\Http\Controllers\Api\PessoaController@index |
| POST | /api/pessoas | pessoas.store | App\Http\Controllers\Api\PessoaController@store |
| GET|HEAD | /api/pessoas/{pessoa} | pessoas.show | App\Http\Controllers\Api\PessoaController@show |
| PUT|PATCH | /api/pessoas/{pessoa} | pessoas.update | App\Http\Controllers\Api\PessoaController@update |
| DELETE | /api/pessoas/{pessoa} | pessoas.destroy | App\Http\Controllers\Api\PessoaController@destroy |
| GET|HEAD | /api/ping |  | Closure |
| GET|HEAD | /api/presencas | presencas.index | App\Http\Controllers\Api\PresencaController@index |
| POST | /api/presencas | presencas.store | App\Http\Controllers\Api\PresencaController@store |
| GET|HEAD | /api/presencas/{presenca} | presencas.show | App\Http\Controllers\Api\PresencaController@show |
| PUT|PATCH | /api/presencas/{presenca} | presencas.update | App\Http\Controllers\Api\PresencaController@update |
| DELETE | /api/presencas/{presenca} | presencas.destroy | App\Http\Controllers\Api\PresencaController@destroy |
| PUT | /api/profile-images |  | App\Http\Controllers\Api\UserController@uploadProfileImage |
| GET|HEAD | /api/stats |  | App\Http\Controllers\Api\DashboardController@index |
| GET|HEAD | /api/tipos-mensalidade |  | App\Http\Controllers\Api\FaturaController@tiposMensalidade |
| POST | /api/tipos-mensalidade |  | App\Http\Controllers\Api\FaturaController@createTipoMensalidade |
| GET|HEAD | /api/user |  | App\Http\Controllers\Api\AuthController@user |
| GET|HEAD | /api/users | users.index | App\Http\Controllers\Api\UserController@index |
| POST | /api/users | users.store | App\Http\Controllers\Api\UserController@store |
| GET|HEAD | /api/users/{id}/dados-configuracao |  | App\Http\Controllers\Api\UserController@dadosConfiguracao |
| PUT | /api/users/{id}/dados-configuracao |  | App\Http\Controllers\Api\UserController@updateDadosConfiguracao |
| GET|HEAD | /api/users/{id}/dados-desportivos |  | App\Http\Controllers\Api\UserController@dadosDesportivos |
| PUT | /api/users/{id}/dados-desportivos |  | App\Http\Controllers\Api\UserController@updateDadosDesportivos |
| GET|HEAD | /api/users/{id}/resultados |  | App\Http\Controllers\Api\UserController@resultados |
| GET|HEAD | /api/users/{id}/treinos |  | App\Http\Controllers\Api\UserController@treinos |
| GET|HEAD | /api/users/{user} | users.show | App\Http\Controllers\Api\UserController@show |
| PUT|PATCH | /api/users/{user} | users.update | App\Http\Controllers\Api\UserController@update |
| DELETE | /api/users/{user} | users.destroy | App\Http\Controllers\Api\UserController@destroy |
| GET|HEAD | /atividades | atividades.index | App\Http\Controllers\Api\AtividadeController@index |
| POST | /atividades | atividades.store | App\Http\Controllers\Api\AtividadeController@store |
| GET|HEAD | /atividades/{atividade} | atividades.show | App\Http\Controllers\Api\AtividadeController@show |
| PUT|PATCH | /atividades/{atividade} | atividades.update | App\Http\Controllers\Api\AtividadeController@update |
| DELETE | /atividades/{atividade} | atividades.destroy | App\Http\Controllers\Api\AtividadeController@destroy |
| POST | /auth/login |  | App\Http\Controllers\Api\AuthController@login |
| POST | /auth/logout |  | App\Http\Controllers\Api\AuthController@logout |
| GET|HEAD | /auth/user |  | App\Http\Controllers\Api\AuthController@user |
| GET|HEAD | /centros-custo |  | App\Http\Controllers\Api\FaturaController@centrosCusto |
| POST | /centros-custo |  | App\Http\Controllers\Api\FaturaController@createCentroCusto |
| GET|HEAD | /escaloes | escaloes.index | App\Http\Controllers\Api\EscalaoController@index |
| POST | /escaloes | escaloes.store | App\Http\Controllers\Api\EscalaoController@store |
| GET|HEAD | /escaloes/{escalo} | escaloes.show | App\Http\Controllers\Api\EscalaoController@show |
| PUT|PATCH | /escaloes/{escalo} | escaloes.update | App\Http\Controllers\Api\EscalaoController@update |
| DELETE | /escaloes/{escalo} | escaloes.destroy | App\Http\Controllers\Api\EscalaoController@destroy |
| GET|HEAD | /faturas | faturas.index | App\Http\Controllers\Api\FaturaController@index |
| POST | /faturas | faturas.store | App\Http\Controllers\Api\FaturaController@store |
| POST | /faturas/gerar-anuais |  | App\Http\Controllers\Api\FaturaController@gerarAnuais |
| GET|HEAD | /faturas/{fatura} | faturas.show | App\Http\Controllers\Api\FaturaController@show |
| PUT|PATCH | /faturas/{fatura} | faturas.update | App\Http\Controllers\Api\FaturaController@update |
| DELETE | /faturas/{fatura} | faturas.destroy | App\Http\Controllers\Api\FaturaController@destroy |
| PUT | /faturas/{id}/pagar |  | App\Http\Controllers\Api\FaturaController@marcarPaga |
| POST | /login |  | App\Http\Controllers\Api\AuthController@login |
| POST | /logout |  | App\Http\Controllers\Api\AuthController@logout |
| GET|HEAD | /mensalidades | mensalidades.index | App\Http\Controllers\Api\MensalidadeController@index |
| POST | /mensalidades | mensalidades.store | App\Http\Controllers\Api\MensalidadeController@store |
| GET|HEAD | /mensalidades/stats |  | App\Http\Controllers\Api\MensalidadeController@stats |
| GET|HEAD | /mensalidades/{mensalidade} | mensalidades.show | App\Http\Controllers\Api\MensalidadeController@show |
| PUT|PATCH | /mensalidades/{mensalidade} | mensalidades.update | App\Http\Controllers\Api\MensalidadeController@update |
| DELETE | /mensalidades/{mensalidade} | mensalidades.destroy | App\Http\Controllers\Api\MensalidadeController@destroy |
| GET|HEAD | /pessoas | pessoas.index | App\Http\Controllers\Api\PessoaController@index |
| POST | /pessoas | pessoas.store | App\Http\Controllers\Api\PessoaController@store |
| GET|HEAD | /pessoas/{pessoa} | pessoas.show | App\Http\Controllers\Api\PessoaController@show |
| PUT|PATCH | /pessoas/{pessoa} | pessoas.update | App\Http\Controllers\Api\PessoaController@update |
| DELETE | /pessoas/{pessoa} | pessoas.destroy | App\Http\Controllers\Api\PessoaController@destroy |
| GET|HEAD | /ping |  | Closure |
| GET|HEAD | /presencas | presencas.index | App\Http\Controllers\Api\PresencaController@index |
| POST | /presencas | presencas.store | App\Http\Controllers\Api\PresencaController@store |
| GET|HEAD | /presencas/{presenca} | presencas.show | App\Http\Controllers\Api\PresencaController@show |
| PUT|PATCH | /presencas/{presenca} | presencas.update | App\Http\Controllers\Api\PresencaController@update |
| DELETE | /presencas/{presenca} | presencas.destroy | App\Http\Controllers\Api\PresencaController@destroy |
| PUT | /profile-images |  | App\Http\Controllers\Api\UserController@uploadProfileImage |
| GET|HEAD | /stats |  | App\Http\Controllers\Api\DashboardController@index |
| GET|HEAD | /storage/{path} | storage.local | Closure |
| GET|HEAD | /tipos-mensalidade |  | App\Http\Controllers\Api\FaturaController@tiposMensalidade |
| POST | /tipos-mensalidade |  | App\Http\Controllers\Api\FaturaController@createTipoMensalidade |
| GET|HEAD | /up |  | Closure |
| GET|HEAD | /user |  | App\Http\Controllers\Api\AuthController@user |
| GET|HEAD | /users | users.index | App\Http\Controllers\Api\UserController@index |
| POST | /users | users.store | App\Http\Controllers\Api\UserController@store |
| GET|HEAD | /users/{id}/dados-configuracao |  | App\Http\Controllers\Api\UserController@dadosConfiguracao |
| PUT | /users/{id}/dados-configuracao |  | App\Http\Controllers\Api\UserController@updateDadosConfiguracao |
| GET|HEAD | /users/{id}/dados-desportivos |  | App\Http\Controllers\Api\UserController@dadosDesportivos |
| PUT | /users/{id}/dados-desportivos |  | App\Http\Controllers\Api\UserController@updateDadosDesportivos |
| GET|HEAD | /users/{id}/resultados |  | App\Http\Controllers\Api\UserController@resultados |
| GET|HEAD | /users/{id}/treinos |  | App\Http\Controllers\Api\UserController@treinos |
| GET|HEAD | /users/{user} | users.show | App\Http\Controllers\Api\UserController@show |
| PUT|PATCH | /users/{user} | users.update | App\Http\Controllers\Api\UserController@update |
| DELETE | /users/{user} | users.destroy | App\Http\Controllers\Api\UserController@destroy |

## Endpoints
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


## Tabelas
# Tabelas
*(DB não encontrada; corre migrations)*

## Componentes Frontend
# Componentes Frontend
- client/src/App.tsx
- client/src/components/ActivityCard.tsx
- client/src/components/AthleteCard.tsx
- client/src/components/DataTable.tsx
- client/src/components/FinanceCard.tsx
- client/src/components/InventoryCard.tsx
- client/src/components/ObjectUploader.tsx
- client/src/components/StatCard.tsx
- client/src/components/ThemeProvider.tsx
- client/src/components/ThemeToggle.tsx
- client/src/components/app-sidebar.tsx
- client/src/components/examples/ActivityCard.tsx
- client/src/components/examples/AppSidebar.tsx
- client/src/components/examples/AthleteCard.tsx
- client/src/components/examples/DataTable.tsx
- client/src/components/examples/FinanceCard.tsx
- client/src/components/examples/InventoryCard.tsx
- client/src/components/examples/StatCard.tsx
- client/src/components/ui/accordion.tsx
- client/src/components/ui/alert-dialog.tsx
- client/src/components/ui/alert.tsx
- client/src/components/ui/aspect-ratio.tsx
- client/src/components/ui/avatar.tsx
- client/src/components/ui/badge.tsx
- client/src/components/ui/breadcrumb.tsx
- client/src/components/ui/button.tsx
- client/src/components/ui/calendar.tsx
- client/src/components/ui/card.tsx
- client/src/components/ui/carousel.tsx
- client/src/components/ui/chart.tsx
- client/src/components/ui/checkbox.tsx
- client/src/components/ui/collapsible.tsx
- client/src/components/ui/command.tsx
- client/src/components/ui/context-menu.tsx
- client/src/components/ui/dialog.tsx
- client/src/components/ui/drawer.tsx
- client/src/components/ui/dropdown-menu.tsx
- client/src/components/ui/form.tsx
- client/src/components/ui/hover-card.tsx
- client/src/components/ui/input-otp.tsx
- client/src/components/ui/input.tsx
- client/src/components/ui/label.tsx
- client/src/components/ui/menubar.tsx
- client/src/components/ui/navigation-menu.tsx
- client/src/components/ui/pagination.tsx
- client/src/components/ui/popover.tsx
- client/src/components/ui/progress.tsx
- client/src/components/ui/radio-group.tsx
- client/src/components/ui/resizable.tsx
- client/src/components/ui/scroll-area.tsx
- client/src/components/ui/select.tsx
- client/src/components/ui/separator.tsx
- client/src/components/ui/sheet.tsx
- client/src/components/ui/sidebar.tsx
- client/src/components/ui/skeleton.tsx
- client/src/components/ui/slider.tsx
- client/src/components/ui/switch.tsx
- client/src/components/ui/table.tsx
- client/src/components/ui/tabs.tsx
- client/src/components/ui/textarea.tsx
- client/src/components/ui/toast.tsx
- client/src/components/ui/toaster.tsx
- client/src/components/ui/toggle-group.tsx
- client/src/components/ui/toggle.tsx
- client/src/components/ui/tooltip.tsx
- client/src/hooks/use-mobile.tsx
- client/src/main.tsx
- client/src/pages/Atividades.tsx
- client/src/pages/Comunicacao.tsx
- client/src/pages/Configuracoes.tsx
- client/src/pages/Dashboard.tsx
- client/src/pages/Financeiro.tsx
- client/src/pages/Inventario.tsx
- client/src/pages/Landing.tsx
- client/src/pages/PessoaDetalhes.tsx
- client/src/pages/Pessoas.tsx
- client/src/pages/Relatorios.tsx
- client/src/pages/not-found.tsx

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

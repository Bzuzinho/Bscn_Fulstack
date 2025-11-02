<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DadosConfiguracao extends Model
{
    protected $table = 'dados_configuracao';

    protected $fillable = [
        'user_id', 'tema', 'idioma', 'notificacoes',
    ];

    protected $casts = [
        'user_id' => 'string',
        'notificacoes' => 'boolean',
    ];
}

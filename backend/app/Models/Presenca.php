<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presenca extends Model
{
    protected $table = 'presencas_novo';

    protected $fillable = [
        'atividade_id', 'pessoa_id', 'presente', 'justificacao',
    ];

    protected $casts = [
        'atividade_id' => 'integer',
        'pessoa_id' => 'integer',
        'presente' => 'boolean',
    ];
}

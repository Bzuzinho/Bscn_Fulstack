<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Atividade extends Model
{
    protected $table = 'atividades';

    protected $fillable = [
        'nome', 'tipo', 'data', 'hora_inicio', 'hora_fim',
        'local', 'escalao', 'descricao',
    ];

    protected $casts = [
        'data' => 'date',
        'escalao' => 'integer',
    ];
}

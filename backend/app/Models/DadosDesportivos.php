<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DadosDesportivos extends Model
{
    protected $table = 'dados_desportivos';

    protected $fillable = [
        'user_id', 'modalidade', 'posicao', 'nivel_competitivo',
    ];

    protected $casts = [
        'user_id' => 'string',
    ];
}

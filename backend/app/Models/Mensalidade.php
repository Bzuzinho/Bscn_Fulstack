<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mensalidade extends Model
{
    protected $table = 'mensalidades';

    protected $fillable = [
        'pessoa_id', 'mes_referencia', 'valor', 'estado', 'tipo_mensalidade_id',
    ];

    protected $casts = [
        'pessoa_id' => 'integer',
        'mes_referencia' => 'date',
        'valor' => 'decimal:2',
        'tipo_mensalidade_id' => 'integer',
    ];
}

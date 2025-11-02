<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fatura extends Model
{
    protected $table = 'faturas';

    protected $fillable = [
        'numero', 'pessoa_id', 'data_emissao', 'data_vencimento',
        'valor_total', 'estado', 'descricao',
    ];

    protected $casts = [
        'pessoa_id' => 'integer',
        'data_emissao' => 'date',
        'data_vencimento' => 'date',
        'valor_total' => 'decimal:2',
    ];
}
